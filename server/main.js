// 服务端入口

// 连接数据库
require("./bins/connection");

// 导入express和bodyParser中间件
const express = require("express");
const bodyParser = require("body-parser");
// 导入configs和router
const { serverPort } = require("./bins/configs");
const router = require("./bins/router");

// 创建服务
const app = express();
// 使用bodyParser中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 设置路由
app.use("/", router);
// 开始监听
app.listen(serverPort, () => {
  console.log(`服务器监听端口 ${serverPort} 中……`);
});
