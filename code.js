var maxLevelSum = function (root) {
  // 取出根节点值（会直接修改传入数组）
  let rootNum = root.splice(0, 1)[0];
  // 计算除根节点外剩余元素最多需要多少层（按完全二叉树层级估算）
  const level = Math.ceil(root.length / 2);
  // 记录当前最大层级（默认根节点层级为 1）
  let resLevel = 1;
  // 从第 2 层开始逐层计算节点和
  for (let i = 2; i < level + 1; i++) {
    // 取出当前层的两个节点并求和，空节点按 0 处理
    const num = root.splice(0, 2).reduce((acc, cur) => acc + (cur || 0));
    console.log("num", num, i, rootNum);
    // 若当前层和更大则更新结果层级
    resLevel = rootNum > num ? resLevel : i;
  }
  // 返回最大层级
  return resLevel;
};
console.log(maxLevelSum([989, null, 10250, 98693, -89388, null, null, null, -32127]));
// created by Yinjiajun
