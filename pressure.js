#!/usr/bin/env node

const http = require("http");
const https = require("https");
const crypto = require("crypto");
const { URL } = require("url");
const { performance } = require("perf_hooks");

const DEFAULT_TARGET = {
  url: "https://jmclint.hwwt2.com/open/sharing/open/doPreOrder",
  method: "POST",
  signToken: "7d63c4df21b64c76acf64b99430dbcdf",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({
    jde_id_out: "980",
    baisheng_id_in: "7799",
    business_main_no: "1791231237831501",
    order_amt: "500",
    discount_amt: "150",
    attach: "JDE测试供应链",
    order_body: "JDE测试供应链",
    sharing_type: "0",
    api_ver: "100",
    inst_no: "52100001",
    trace_no: "12345678123456781234567812345678",
    key_sign: "{{key_sign}}",
  }),
};

const args = parseArgs(process.argv.slice(2));
const signToken = args["sign-token"] || args.signToken || process.env.E_TOKEN || process.env.e_token || DEFAULT_TARGET.signToken;
const rawBody = args.body || DEFAULT_TARGET.body;
const mergedHeaders = Object.assign({}, DEFAULT_TARGET.headers, parseHeaders(args.header));
const durationSeconds = parseDurationSeconds(args);
const concurrency = Number(args.concurrency || args.c || 10);
const requests = Number(args.once ? 1 : args.requests || 0);
const showResponse = Boolean(args["show-response"] || args.showResponse || args.once);
const showAllResponses = Boolean(args["show-all-responses"] || args.showAllResponses);
const randomBusinessMainNo = args["random-business-main-no"] !== "false";
let bodyTemplate = null;

if (rawBody) {
  try {
    bodyTemplate = JSON.parse(rawBody);
  } catch (err) {
    console.error(`body 必须是 JSON 字符串，当前解析失败：${err.message}`);
    process.exit(1);
  }
}

// 将命令行参数归一化为压测配置，后续逻辑统一从 config 读取。
const config = {
  url: args.url || DEFAULT_TARGET.url,
  method: (args.method || DEFAULT_TARGET.method).toUpperCase(),
  duration: durationSeconds,
  concurrency,
  timeout: Number(args.timeout || 10000),
  requests,
  bodyTemplate,
  headers: mergedHeaders,
  hasSignToken: Boolean(signToken),
  randomBusinessMainNo,
  showResponse,
  showAllResponses,
};

if (!config.url) {
  console.log(`
缺少参数：--url

示例：

GET:
node load-test-node14.js --url http://localhost:3000/api/test --duration 30 --concurrency 50

POST:
node load-test-node14.js \\
  --url http://localhost:3000/api/login \\
  --method POST \\
  --header "content-type:application/json" \\
  --body '{"username":"test","password":"123456"}' \\
  --duration 30 \\
  --concurrency 50

单次测试带签名接口:
node pressure.js \\
  --url https://jmclint.hwwt2.com/open/sharing/open/doPreOrder \\
  --method POST \\
  --header "content-type:application/json" \\
  --sign-token "<e_token>" \\
  --requests 1 \\
  --show-response \\
  --body '{"jde_id_out":"980","baisheng_id_in":"7799","business_main_no":"1791231237831501","order_amt":"500","discount_amt":"150","attach":"JDE测试供应链","order_body":"JDE测试供应链","sharing_type":"0","api_ver":"100","inst_no":"52100001","trace_no":"12345678123456781234567812345678","key_sign":"{{key_sign}}"}'

默认目标接口快速执行（无需传 url/token/body）:
node pressure.js --time 10 --concurrency 5

默认目标接口单次调试（自动展示首个响应）:
node pressure.js --once

只跑一轮 5 个并发请求:
node pressure.js --requests 5 --concurrency 5

查看每个请求结果:
node pressure.js --requests 5 --concurrency 5 --show-all-responses

关闭 business_main_no 随机生成:
node pressure.js --random-business-main-no false
`);
  process.exit(1);
}

// 运行期统计数据：请求完成后即时累加，最终用于汇总 QPS、成功率和耗时分位数。
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  timeout: 0,
  networkError: 0,
  statusCount: {},
  durations: [],
  errors: {},
};

const startTime = Date.now();
const endTime = startTime + config.duration * 1000;
let activeCount = 0;
let scheduledCount = 0;
let firstResponse = null;
const responseDetails = [];

console.log("压测开始：");
console.log({
  url: config.url,
  method: config.method,
  duration: `${config.duration}s`,
  concurrency: config.concurrency,
  requests: config.requests || "不限",
  timeout: `${config.timeout}ms`,
  headers: config.headers,
  hasBody: Boolean(config.bodyTemplate),
  hasSignToken: config.hasSignToken,
  randomBusinessMainNo: config.randomBusinessMainNo,
  showResponse: config.showResponse,
  showAllResponses: config.showAllResponses,
});
console.log("----------------------------------------");

// 定时刷新压测进度，使用 \r 覆盖同一行，减少终端输出刷屏。
const progressTimer = setInterval(() => {
  const elapsed = (Date.now() - startTime) / 1000;
  const qps = stats.total / Math.max(elapsed, 1);

  process.stdout.write(
    `\r已运行 ${elapsed.toFixed(1)}s | 总请求 ${stats.total} | 成功 ${stats.success} | 失败 ${stats.failed} | 平均QPS ${qps.toFixed(2)} | 活跃 ${activeCount}   `,
  );
}, 1000);

main()
  .then(() => {
    clearInterval(progressTimer);
    console.log("\n----------------------------------------");
    printResult();
  })
  .catch((err) => {
    clearInterval(progressTimer);
    console.error("\n压测异常：", err);
    process.exit(1);
  });

async function main() {
  const workers = [];

  // 每个 worker 串行发送请求；多个 worker 并行运行以达到指定并发数。
  for (let i = 0; i < config.concurrency; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
}

async function worker() {
  while (Date.now() < endTime) {
    const requestId = reserveRequest();

    if (!requestId) break;

    await sendRequest(requestId);
  }
}

function reserveRequest() {
  if (config.requests > 0 && scheduledCount >= config.requests) {
    return false;
  }

  scheduledCount++;
  return scheduledCount;
}

function sendRequest(requestId) {
  return new Promise((resolve) => {
    activeCount++;

    // 根据 URL 协议选择 http/https 客户端，并组装 Node 原生 request 选项。
    const urlObj = new URL(config.url);
    const isHttps = urlObj.protocol === "https:";
    const client = isHttps ? https : http;

    const payload = buildRequestBody();
    const bodyBuffer = Buffer.from(payload.body);

    const headers = Object.assign({}, config.headers);

    if (shouldSendBody(config.method) && payload.body) {
      ensureContentType(headers);
      headers["content-length"] = bodyBuffer.length;
    }

    const options = {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: config.method,
      headers,
      timeout: config.timeout,
    };

    const requestStart = performance.now();

    // 默认不统计响应体；需要调试接口时可通过 --show-response/--show-all-responses 打印响应。
    const req = client.request(options, (res) => {
      const shouldCaptureResponse = config.showAllResponses || (config.showResponse && !firstResponse);
      const chunks = [];

      if (shouldCaptureResponse) {
        res.on("data", (chunk) => {
          chunks.push(chunk);
        });
      } else {
        res.resume();
      }

      res.on("end", () => {
        const duration = performance.now() - requestStart;

        stats.total++;
        stats.durations.push(duration);
        stats.statusCount[res.statusCode] = (stats.statusCount[res.statusCode] || 0) + 1;

        if (res.statusCode >= 200 && res.statusCode < 400) {
          stats.success++;
        } else {
          stats.failed++;
        }

        if (shouldCaptureResponse) {
          const detail = {
            requestId,
            business_main_no: payload.businessMainNo,
            statusCode: res.statusCode,
            duration: `${duration.toFixed(2)}ms`,
            headers: res.headers,
            body: Buffer.concat(chunks).toString("utf8"),
          };

          if (!firstResponse) {
            firstResponse = detail;
          }

          if (config.showAllResponses) {
            responseDetails.push(detail);
          }
        }

        activeCount--;
        resolve();
      });
    });

    req.on("timeout", () => {
      req.destroy(new Error("RequestTimeout"));
    });

    // 超时和网络错误统一进入失败统计，确保每个请求最终都会 resolve。
    req.on("error", (err) => {
      const duration = performance.now() - requestStart;

      stats.total++;
      stats.failed++;
      stats.durations.push(duration);

      if (err.message === "RequestTimeout") {
        stats.timeout++;
        stats.errors.timeout = (stats.errors.timeout || 0) + 1;
      } else {
        stats.networkError++;
        const key = err.code || err.message || "NetworkError";
        stats.errors[key] = (stats.errors[key] || 0) + 1;
      }

      if (config.showAllResponses) {
        responseDetails.push({
          requestId,
          business_main_no: payload.businessMainNo,
          statusCode: null,
          duration: `${duration.toFixed(2)}ms`,
          error: err.code || err.message || "NetworkError",
        });
      }

      activeCount--;
      resolve();
    });

    if (shouldSendBody(config.method) && payload.body) {
      req.write(bodyBuffer);
    }

    req.end();
  });
}

function printResult() {
  const totalTime = (Date.now() - startTime) / 1000;
  const durations = stats.durations.sort((a, b) => a - b);

  // durations 可能为空，下面的指标统一兜底为 0，避免空数组计算异常。
  const avg = durations.length ? durations.reduce((sum, item) => sum + item, 0) / durations.length : 0;

  const result = {
    总耗时: `${totalTime.toFixed(2)}s`,
    总请求数: stats.total,
    成功数: stats.success,
    失败数: stats.failed,
    超时数: stats.timeout,
    网络错误数: stats.networkError,
    平均QPS: (stats.total / Math.max(totalTime, 1)).toFixed(2),
    成功率: `${((stats.success / Math.max(stats.total, 1)) * 100).toFixed(2)}%`,
    平均耗时: `${avg.toFixed(2)}ms`,
    最小耗时: `${(durations[0] || 0).toFixed(2)}ms`,
    最大耗时: `${(durations[durations.length - 1] || 0).toFixed(2)}ms`,
    P50: `${percentile(durations, 50).toFixed(2)}ms`,
    P90: `${percentile(durations, 90).toFixed(2)}ms`,
    P95: `${percentile(durations, 95).toFixed(2)}ms`,
    P99: `${percentile(durations, 99).toFixed(2)}ms`,
    状态码统计: stats.statusCount,
    错误统计: stats.errors,
  };

  if (config.showResponse) {
    result.首个响应 = firstResponse;
  }

  if (config.showAllResponses) {
    result.请求明细 = responseDetails.sort((a, b) => a.requestId - b.requestId);
  }

  console.log(JSON.stringify(result, null, 2));
}

function percentile(sortedArr, p) {
  // 输入数组必须已按升序排列，调用方负责排序以避免重复开销。
  if (!sortedArr.length) return 0;

  const index = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.min(Math.max(index, 0), sortedArr.length - 1)];
}

function parseArgs(argv) {
  const result = {};

  // 支持 --key value 与重复参数；重复参数会收集成数组，例如多个 --header。
  for (let i = 0; i < argv.length; i++) {
    const item = argv[i];

    if (!item.startsWith("--")) continue;

    const key = item.slice(2);
    const next = argv[i + 1];

    if (!next || next.startsWith("--")) {
      result[key] = true;
    } else {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          result[key].push(next);
        } else {
          result[key] = [result[key], next];
        }
      } else {
        result[key] = next;
      }

      i++;
    }
  }

  return result;
}

function parseDurationSeconds(args) {
  if (args.duration) return Number(args.duration);
  if (args.time) return Number(args.time);
  if (args.minutes) return Number(args.minutes) * 60;
  return 30;
}

function parseHeaders(headerArgs) {
  const headers = {};

  if (!headerArgs) return headers;

  // header 格式为 "key:value"，只按第一个冒号切分，保留 value 内部的冒号。
  const list = Array.isArray(headerArgs) ? headerArgs : [headerArgs];

  for (const item of list) {
    const index = item.indexOf(":");

    if (index === -1) continue;

    const key = item.slice(0, index).trim();
    const value = item.slice(index + 1).trim();

    if (key) {
      headers[key] = value;
    }
  }

  return headers;
}

function buildRequestBody() {
  if (!config.bodyTemplate) {
    return {
      body: "",
      businessMainNo: "",
    };
  }

  const jsondata = Object.assign({}, config.bodyTemplate);

  if (config.randomBusinessMainNo) {
    jsondata.business_main_no = generateBusinessMainNo();
  }

  if (signToken) {
    jsondata.key_sign = signBody(jsondata, signToken);
  }

  return {
    body: JSON.stringify(jsondata),
    businessMainNo: jsondata.business_main_no || "",
  };
}

function signBody(jsondata, token) {
  if (!token) return jsondata.key_sign || "";

  const signSource = Object.keys(jsondata)
    .sort()
    .filter((key) => key !== "key_sign")
    .map((key) => `${key}=${jsondata[key]}`)
    .join("&");

  const md5String = `${signSource}&key=${token}`;
  return crypto.createHash("md5").update(md5String).digest("hex").toUpperCase();
}

function generateBusinessMainNo() {
  const timestamp = Date.now().toString();
  const random = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

  return `${timestamp}${random}`;
}

function ensureContentType(headers) {
  const hasContentType = Object.keys(headers).some((key) => key.toLowerCase() === "content-type");

  if (!hasContentType) {
    headers["content-type"] = "application/json";
  }
}

function shouldSendBody(method) {
  return !["GET", "HEAD"].includes(method);
}
