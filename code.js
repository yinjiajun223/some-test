var maxLevelSum = function (root) {
  let rootNum = root.splice(0, 1)[0];
  const level = Math.ceil(root.length / 2);
  let resLevel = 1;
  for (let i = 2; i < level + 1; i++) {
    const num = root.splice(0, 2).reduce((acc, cur) => acc + (cur || 0));
    console.log("num", num, i, rootNum);
    resLevel = rootNum > num ? resLevel : i;
  }
  return resLevel;
};
console.log(maxLevelSum([989, null, 10250, 98693, -89388, null, null, null, -32127]));
