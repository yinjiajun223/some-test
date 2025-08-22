/*
单位下：
  单位列表 pickId = fid-fid
  单位下通讯录下部门 id-id
  单位下组织架构下的组织架构 id-id或者fid-fid-serviceId-serviceId
  单位下组织架构下的部门id-id
团队下：
  部门id
课程下：
  课程 课程id
  班级 班级id

*/
let newData = {
  // 单位模块 角色组、角色
  rolesList: [
    { fid: 217097, roleGroupId: 4652, name:"AI 能力中心" }, //默认角色组
    // { fid: 1385, roleId: 2161791, name: "信息安全团队" }, //超星集团 自定义角色组 滚动后最后一个角色
  ],
  // 单位模块 单位、组织架构、部门

  // fid: 217097
  // id:AA1DBE346BE53C52C744BA3466E0E610
  //groupId: 21695623
  // NOTE: 部门回显数据
  deptsList: [
    // { id: "AA1DBE346BE53C52C744BA3466E0E610", name: "2" ,pic:"https://pan-yz.chaoxing.com/thumbnail/origin/2d87595486b0f93e4a01d26e1c4b52be"}, // 部门回显
    // { id: 2537789, name: "协作者"  }, // NOTE: 角色回显
    // // 有id 部门id/架构id fid 单位id
    // { fid: 201464, name: "定制世贸单位" },
    // {
    //   id: "64C088B46A43971F",
    //   nowSelectedRole: "3",
    //   name: "产品部", //冯雨晴的组织架构通讯录单位
    // },
    // {
    //   id: "14D66102F896EB43C744BA3466E0E610",
    //   nowSelectedRole: "-1",
    //   name: "公共服务", //冯雨晴的组织架构通讯录单位
    // },
    // {
    //   id: "0548073BEFDEAF57C744BA3466E0E610",
    //   nowSelectedRole: "3",
    //   name: "财务管理", //冯雨晴的组织架构通讯录单位
    // },
    // {
    //   fid: "197761",
    //   serviceId: 1723,
    //   nowSelectedRole: "1",
    //   name: "new", //冯雨晴的组织架构通讯录单位
    // },
    // // {
    // //   fid: 214594,
    // //   serviceId: 0,
    // //   name: "默认架构", //冯雨晴的组织架构通讯录单位
    // // },
    // // {
    // //   id: "215C26EAE43D3EDB",
    // //   name: "通讯录的通讯录", //冯雨晴的组织架构通讯录单位
    // // },
  ],
  // 团队模块中 部门
  teamsList: [
    // {
    //   id: "1450146",
    //   name: "新建团队",
    // },
    // {
    //   id: "1625551",
    //   name: "test", //团队
    // },
  ],
  // 小组模块中 小组
  groupsList: [
    // {
    //   id: "52825949",
    //   name: "要颖慧测试小组",
    // },
    // {
    //   id: "31576390",
    //   name: "test", //小组
    // },
  ],
  //课程模块中 课程
  clazzsList: [
    // {
    //   clazzid: "245671014", //clazzid 旧版测测课程
    //   name: "旧版测测",
    // },
    // {
    //   classid: "101464294", //classid  旧版图谱2课程下的2班
    //   name: "2班", //课程下班级
    // },
  ],
  //群聊模块中 群聊
  chatsList: [
    // {
    //   chatid: "266692341071873", //chatid
    //   name: "田雪阳", //群聊
    // },
  ],
  //成员列表
  personsList: [
    // { puid: 81464284, name: "李畅唱" },
    // { puid: 106371411, name: "韩洪昌" },
    // { puid: 288216473, name: "lhj4399" },
    // { puid: 135083285, name: "李泓渐" },
  ],
};

let uncheckList = {
  rolesList: [{ pic: "", fid: 197761, roleId: 217, roleName: "超级管理员" }],
  deptsList: [],
  teamsList: [],
  groupsList: [],
  clazzsList: [],
  chatsList: [],
  personsList: [],
};
/*
{
  list: [
    {
      fid: XXXX,单位ID
      type: 1,1 单位通讯录 2 组织架构
      ids: [
        { id: 部门ID,
          name: "部门名称"
          canCheck:false //当前部门数据不可选 可以不传该属性 不传该属性则默认当前部门数据可选 外层canCheck属性优先级高于此属性
        },
      ],
    },
    {
      fid: XXXX,单位ID
      type: 2,1 单位通讯录 2 组织架构
      ids: [
        { id: 部门ID, name: "部门名称"，serviceId：组织架构ID },
      ],
    },
  ],
  canCheck:false, //list 中所有数据都不可选 可以不传该属性 不传该属性则默认所有数据可选
}
*/
let onlyDeptData = {
  list: [
    {
      fid: 1385,
      type: 2,
      ids: [
        { id: "E5A860DCA5280F4F", name: "指导" },
        { id: "44C551376C0A1F8B", name: "细胞核" },
      ],
    },
    {
      fid: 210486, //数据中台演示单位
      type: 1,
      ids: [{ id: "BA2FF814C5B7EE57", name: "学习通通讯录部门" }],
    },
  ],
  canCheck: false,
};
/*
{
  list: [
    {
      fid: XXXX,单位ID
      ids: [
        { serviceId: 组织架构ID, 
          name: "组织架构名称"
          canCheck:false //当前组织架构数据不可选 可以不传该属性 不传该属性则默认当前组织架构数据可选 外层canCheck属性优先级高于此属性
        },
      ],
    },
    {
      fid: XXXX,单位ID
      ids: [
        { serviceId: 组织架构ID, name: "组织架构名称" },
      ],
    },
  ],
   canCheck:false, //list 中所有数据都不可选 可以不传该属性 不传该属性则默认所有数据可选
}
*/
let onlyStructureData = {
  list: [
    {
      fid: 325604, //冯雨晴的通讯录单位
      ids: [{ serviceId: " 0", name: "默认架构" }],
    },
    // {
    //   fid: 126176, //武汉移动图书馆测试
    //   ids: [{ serviceId: "433", name: "武汉研发" }],
    // },
  ],
  canCheck: false,
};
/*
单位下：
  单位列表 pickId = fid-fid
  单位下通讯录下部门 id-id
  单位下组织架构下的组织架构 id-id或者fid-fid-serviceId-serviceId
  单位下组织架构下的部门id-id
团队下：
  部门id
课程下：
  课程 课程id
  班级 班级id

*/
let newDataOldVersion = {
  // 单位模块 角色组、角色
  rolesList: [
    // { fid: 1385, roleGroupId: 1, name: "默认角色" }, //默认角色组
    // { fid: 1385, roleId: 2161791, name: "信息安全团队" }, //超星集团 自定义角色组 滚动后最后一个角色
  ],
  // 单位模块 单位、组织架构、部门
  deptsList: [
    // 有id 部门id/架构id fid 单位id
    // { fid: 1385, name: "超星集团" },
    // {
    //   fid: 214594,
    //   serviceId: 0,
    //   name: "默认架构", //冯雨晴的组织架构通讯录单位
    // },
    // {
    //   id: "215C26EAE43D3EDB",
    //   name: "通讯录的通讯录", //冯雨晴的组织架构通讯录单位
    // },
  ],
  // 团队模块中 部门
  teamsList: [
    // {
    //   id: "1450146",
    //   name: "新建团队",
    // },
  ],
  // 小组模块中 小组
  groupsList: [
    // {
    //   bbsid: "0362efe5-f6f9-4437-b722-e0fe71367a74",
    //   name: "要颖慧测试小组",
    // },
  ],
  //课程模块中 课程
  clazzsList: [
    // {
    //   clazzid: "245671014", //clazzid
    //   name: "旧版测测",
    // },
    // {
    //   classid: "101464294", //classid
    //   name: "2班",
    // },
  ],
  //群聊模块中 群聊
  chatsList: [
    // {
    //   chatid: "266692341071873", //chatid
    //   name: "田雪阳",
    // },
  ],
  //成员列表
  personsList: [
    // { uid: 58042222, name: "李畅唱" },
    // { uid: 137991409, name: "小星星" }, //小组 科技侃侃说 中的成员
  ],
};

let uncheckListOldVersion = {
  personsList: [
    // { uid: 58042222, name: "李畅唱" },
    // { uid: 274026076, name: "黄春雨测试01" },
  ],
};
