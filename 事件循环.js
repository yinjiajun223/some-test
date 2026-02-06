// 创建第一个 Promise，执行器同步运行并立刻 resolve，相关 then 进入微任务队列
const p1 = new Promise((resolve, reject) => {
  resolve();
});

// 第一次 then 执行：输出 0，并返回一个新的 Promise 作为下一个 then 的结果
p1.then((res) => {
  console.log(0);

  // 返回的 Promise 立即 resolve(4)，其结果会传递给后续 then
  return new Promise((resolve, reject) => {
    resolve(4);
  });
// 直接把 console.log 当作回调，打印上一个 then 返回的值 4
}).then(console.log);

// 创建第二个 Promise，同样立即 resolve，触发后续 then 的微任务
const p2 = new Promise((resolve, reject) => {
  resolve();
});

// 依次注册多个 then，微任务会按注册顺序依次执行
p2.then(() => {
  console.log(1);
})
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  }); // created by Yinjiajun
