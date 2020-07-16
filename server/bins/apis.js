// apis
const apis = {
  // 通用
  login: {
    path: "/login",
    params: ["username", "password"],
    description: "用户登录",
    requireAuth: false,
    requireLog: false,
  },
  // 用户
  getUsersAsAdmin: {
    path: "/getUsersAsAdmin",
    params: [],
    description: "获取所有普通用户信息",
    requireAuth: "admin",
    requireLog: false,
  },
  addUserAsAdmin: {
    path: "/addUserAsAdmin",
    params: ["username", "password", "description"],
    description: "添加普通用户",
    requireAuth: "admin",
    requireLog: true,
  },
  editUserAsAdmin: {
    path: "/editUserAsAdmin",
    params: ["id", "username", "password", "description"],
    description: "编辑普通用户信息",
    requireAuth: "admin",
    requireLog: true,
  },
  setUserEnabledAsAdmin: {
    path: "/setUserEnabledAsAdmin",
    params: ["id"],
    description: "启用普通用户",
    requireAuth: "admin",
    requireLog: true,
  },
  setUserDisabledAsAdmin: {
    path: "/setUserDisabledAsAdmin",
    params: ["id"],
    description: "停用普通用户",
    requireAuth: "admin",
    requireLog: true,
  },
  getUser: {
    path: "/getUser",
    params: [],
    description: "获取当前用户信息",
    requireAuth: "common",
    requireLog: false,
  },
  // 消息
  getMessagesAsAdmin: {
    path: "/getMessagesAsAdmin",
    params: [],
    description: "获取发送的消息通知",
    requireAuth: "admin",
    requireLog: false,
  },
  addMessageAsAdmin: {
    path: "/addMessageAsAdmin",
    params: ["[ids]", "title", "content"],
    description: "发送消息通知",
    requireAuth: "admin",
    requireLog: true,
  },
  getMessages: {
    path: "/getMessages",
    params: [],
    description: "获取收到的消息通知",
    requireAuth: "common",
    requireLog: false,
  },
  setMessageRead: {
    path: "/setMessageRead",
    params: ["id"],
    description: "设置消息通知为已读",
    requireAuth: "common",
    requireLog: true,
  },
  setMessageUnread: {
    path: "/setMessageUnread",
    params: ["id"],
    description: "设置消息通知为未读",
    requireAuth: "common",
    requireLog: true,
  },
  deleteMessage: {
    path: "/deleteMessage",
    params: ["id"],
    description: "删除消息通知",
    requireAuth: "common",
    requireLog: true,
  },
  // 日志
  getLogsAsAdmin: {
    path: "/getLogsAsAdmin",
    params: [],
    description: "获取日志记录",
    requireAuth: "admin",
    requireLog: false,
  },
  getLogs: {
    path: "/getLogs",
    params: [],
    description: "获取日志记录",
    requireAuth: "common",
    requireLog: false,
  },
  deleteLog: {
    path: "/deleteLog",
    params: ["id"],
    description: "删除日志记录",
    requireAuth: "common",
    requireLog: false,
  },
  // 解析木
  getTreesAsAdmin: {
    path: "/getTreesAsAdmin",
    params: [],
    description: "获取所有解析木信息",
    requireAuth: "admin",
    requireLog: false,
  },
  getTrees: {
    path: "/getTrees",
    params: [],
    description: "获取所有解析木信息",
    requireAuth: "common",
    requireLog: false,
  },
  getTree: {
    path: "/getTree",
    params: ["id"],
    description: "获取单个解析木信息",
    requireAuth: "common",
    requireLog: false,
  },
  addTree: {
    path: "/addTree",
    params: ["treeInfo", "discsInfo", "extraInfo"],
    description: "添加解析木信息",
    requireAuth: "common",
    requireLog: true,
  },
  editTree: {
    path: "/editTree",
    params: ["id", "treeInfo", "discsInfo", "extraInfo"],
    description: "编辑解析木信息",
    requireAuth: "common",
    requireLog: true,
  },
  deleteTree: {
    path: "/deleteTree",
    params: ["id"],
    description: "删除解析木信息",
    requireAuth: "common",
    requireLog: true,
  },
  getTreeModel: {
    path: "/getTreeModel",
    params: ["ages", "volumes"],
    description: "获取当前解析木材积生长方程",
    requireAuth: "common",
    requireLog: false,
  },
};

module.exports = apis;
