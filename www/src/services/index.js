import service from "./service";

// 通用
export function serviceLogin(params) {
  return service("login", params);
}

// 用户管理
export function serviceGetUsersAsAdmin(params) {
  return service("getUsersAsAdmin", params);
}
export function serviceAddUserAsAdmin(params) {
  return service("addUserAsAdmin", params);
}
export function serviceEditUserAsAdmin(params) {
  return service("editUserAsAdmin", params);
}
export function serviceSetUserEnabledAsAdmin(params) {
  return service("setUserEnabledAsAdmin", params);
}
export function serviceSetUserDisabledAsAdmin(params) {
  return service("setUserDisabledAsAdmin", params);
}
export function serviceGetUser(params) {
  return service("getUser", params);
}

// 消息通知
export function serviceGetMessagesAsAdmin(params) {
  return service("getMessagesAsAdmin", params);
}
export function serviceAddMessageAsAdmin(params) {
  return service("addMessageAsAdmin", params);
}
export function serviceGetMessages(params) {
  return service("getMessages", params);
}
export function serviceSetMessageRead(params) {
  return service("setMessageRead", params);
}
export function serviceSetMessageUnread(params) {
  return service("setMessageUnread", params);
}
export function serviceDeleteMessage(params) {
  return service("deleteMessage", params);
}

// 日志管理
export function serviceGetLogsAsAdmin(params) {
  return service("getLogsAsAdmin", params);
}
export function serviceGetLogs(params) {
  return service("getLogs", params);
}
export function serviceDeleteLog(params) {
  return service("deleteLog", params);
}

// 解析木管理
export function serviceGetTreesAsAdmin(params) {
  return service("getTreesAsAdmin", params);
}
export function serviceGetTrees(params) {
  return service("getTrees", params);
}
export function serviceGetTree(params) {
  return service("getTree", params);
}
export function serviceAddTree(params) {
  return service("addTree", params);
}
export function serviceEditTree(params) {
  return service("editTree", params);
}
export function serviceDeleteTree(params) {
  return service("deleteTree", params);
}
export function serviceGetTreeModel(params) {
  return service("getTreeModel", params);
}
