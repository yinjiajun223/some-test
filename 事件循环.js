const p1 = new Promise((resolve, reject) => {
  resolve();
});

p1.then((res) => {
  console.log(0);

  return new Promise((resolve, reject) => {
    resolve(4);
  });
}).then(console.log);

const p2 = new Promise((resolve, reject) => {
  resolve();
});

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
  });
