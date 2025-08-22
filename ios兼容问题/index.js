const http = require("http");
const url = require("url");

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 解析URL
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // 设置响应头
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 处理OPTIONS预检请求
  if (method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // 路由处理
  if (path === "/hello" && method === "GET") {
    // Hello World接口
    const response = {
      message: "Hello World!",
      timestamp: new Date().toISOString(),
      method: method,
      path: path,
    };

    res.writeHead(200);
    setTimeout(() => {
      console.log("1231" + new Date().getTime());
      res.end(JSON.stringify(response, null, 2));
    }, 500);
  } else if (path === "/hello" && method === "POST") {
    // POST版本的Hello World接口
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      let requestData = {};
      try {
        requestData = JSON.parse(body);
      } catch (e) {
        requestData = { raw: body };
      }

      const response = {
        message: "Hello World!",
        timestamp: new Date().toISOString(),
        method: method,
        path: path,
        receivedData: requestData,
      };

      res.writeHead(200);
      res.end(JSON.stringify(response, null, 2));
    });
  } else if (path === "/api/status" && method === "GET") {
    // 状态检查接口
    const response = {
      status: "ok",
      message: "Server is running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
  } else {
    // 404 未找到
    const response = {
      error: "Not Found",
      message: `Path ${path} not found`,
      availableEndpoints: ["GET /hello - Hello World接口", "POST /hello - Hello World接口(支持POST数据)", "GET /api/status - 服务器状态检查"],
    };

    res.writeHead(404);
    res.end(JSON.stringify(response, null, 2));
  }
});

// 设置端口
const PORT = process.env.PORT || 3000;

// 启动服务器
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/hello`);
  console.log(`   POST http://localhost:${PORT}/hello`);
  console.log(`   GET  http://localhost:${PORT}/api/status`);
});
