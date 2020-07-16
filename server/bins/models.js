// 模型

// 导入mongoose相关
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

// options
const options = {
  // 时间戳
  timestamps: {
    createdAt: "_created",
    updatedAt: "_updated",
  },
};

// 用户
const User = Schema(
  {
    username: String,
    password: String,
    description: String,
    isAdmin: Boolean,
    isEnabled: Boolean,
  },
  options
);

// 消息
const Message = Schema(
  {
    userSend: { type: Schema.Types.ObjectId, ref: "User" },
    usersReceive: [{ type: Schema.Types.ObjectId, ref: "User" }],
    title: String,
    content: String,
    hasRead: Boolean,
  },
  options
);

// 日志
const Log = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    ip: String,
    path: String,
    description: String,
    params: Object,
  },
  options
);

// 解析木
const Tree = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    treeInfo: {
      species: String,
      age: Number,
      height: Number,
    },
    discsInfo: {
      count: Number,
      gradation: Number,
      bark: Boolean,
      datas: [
        { number: Number, height: Number, ring: Number, diameters: Object },
      ],
    },
    extraInfo: {
      color: String,
      remarks: String,
    },
  },
  options
);

// 汇总
const Models = {
  User: Model("User", User),
  Message: Model("Message", Message),
  Log: Model("Log", Log),
  Tree: Model("Tree", Tree),
};

module.exports = Models;
