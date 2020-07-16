import UserList from "@/components/user-list";
import TreeList from "@/components/tree-list";
import TreeAdd from "@/components/tree-add";
import TreeEdit from "@/components/tree-edit";
import TreeResult from "@/components/tree-result";
import MessageList from "@/components/message-list";
import LogList from "@/components/log-list";

export default [
  {
    path: "/",
  },
  {
    path: "/user-list",
    component: UserList,
    meta: {
      requireAuth: "admin",
    },
  },
  {
    path: "/tree-list",
    component: TreeList,
    meta: {
      requireAuth: "common",
    },
  },
  {
    path: "/tree-add",
    component: TreeAdd,
    meta: {
      requireAuth: "common",
    },
  },
  {
    path: "/tree-edit/:id",
    component: TreeEdit,
    meta: {
      requireAuth: "common",
    },
  },
  {
    path: "/tree-result/:id",
    component: TreeResult,
    meta: {
      requireAuth: "common",
    },
  },
  {
    path: "/message-list",
    component: MessageList,
    meta: {
      requireAuth: "common",
    },
  },
  {
    path: "/log-list",
    component: LogList,
    meta: {
      requireAuth: "common",
    },
  },
];
