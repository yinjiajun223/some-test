// 手写节流
function throttle(fn, delay) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 限制函数在m秒内只能执行n次
 * @param {Function} fn 需要被限制的函数
 * @param {number} m 时间窗口的长度，单位为毫秒
 * @param {number} n 在时间窗口内允许的最大调用次数
 * 定时器实现
 */

// function limitFunction(fn, m, n) {
//   let callCount = 0;
//   return function (...args) {
//     if (callCount >= n) return;
//     callCount++;

//     setTimeout(() => {
//       fn.apply(this, args);
//       callCount--;
//     }, m);
//   };
// }

// 参考节流实现
function limitFunction(fn, m, n) {
  let callCount = 0;
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= m) {
      lastTime = now;
      callCount = 0; // 重置调用次数
    }
    
    if (callCount < n) {
      callCount++;
      fn.apply(this, args);
    }
  };
}

const limitedFn = limitFunction(() => console.count("调用次数"), 3000, 3);

limitedFn(); // 输出: 调用次数: 1
setTimeout(() => {
  limitedFn(); // 输出: 调用次数: 2
  limitedFn(); // 输出: 调用次数: 3
  limitedFn(); // 不输出
  limitedFn(); // 不输出
}, 2000);

setTimeout(() => {
  limitedFn(); // 输出: 调用次数: 4 (因为前面的调用已经过了3秒)
}, 3500);
