class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  const getNode = (l1: ListNode | null, l2: ListNode | null): ListNode | null => {
    if (l1 === null) return l2;
    if (l2 === null) return l1;

    if (l1.val < l2.val) {
      l1.next = getNode(l1.next, l2);
      console.dir(l1, { depth: null });
      return l1;
    } else {
      l2.next = getNode(l1, l2.next);
      console.dir(l2, { depth: null });
      return l2;
    }
  };

  return getNode(list1, list2);
}

// const list1 = new ListNode(1, new ListNode(2, new ListNode(4)));
// const list2 = new ListNode(1, new ListNode(3, new ListNode(4)));
// const mergedList = mergeTwoLists(list1, list2);

// function removeElements(head: ListNode | null, val: number): ListNode | null {
//   // 添加虚拟节点
//   const data = new ListNode(0, head);
//   let pre = data,
//     cur = data.next;
//   while (cur) {
//     if (cur.val === val) {
//       pre.next = cur.next;
//     } else {
//       pre = cur;
//     }
//     cur = cur.next;
//   }
//   return data.next;
// }

// const list1 = new ListNode(1, new ListNode(2));
// const res = removeElements(list1, 2);

function swapPairs(head: ListNode | null): ListNode | null {
  let dummy = new ListNode(0, head);
  let pre = dummy;

  while (pre.next && pre.next.next) {
    let a = pre.next;
    let b = pre.next.next;

    // 交换
    pre.next = b;
    a.next = b.next;
    b.next = a;

    // 移动 pre
    pre = a;
  }

  return dummy.next;
}

const list1 = new ListNode(1, new ListNode(2));

const res = swapPairs(list1);
