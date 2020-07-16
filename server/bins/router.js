// 路由

// 导入express
const express = require("express");
// 导入handlers和apis
const handlers = require("./handlers");
const apis = require(`./apis`);

// hooks
// 1.解决跨域和允许OPTIONS请求
const corsHandler = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.send("access options");
  } else {
    next();
  }
};
// 2.认证用户
const authHandler = async (req, res, next) => {
  await handlers.auth(req);
  next();
};
// 3.记录日志
const logHandler = async (req, res, next) => {
  await handlers.log(req);
  next();
};
// 4.处理错误
const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(404).end();
  next(false);
};

// 创建router
const router = express.Router();
// 使用hooks
router.use("/", corsHandler);
router.use("/", authHandler);
router.use("/", logHandler);
// 使用handlers
Object.keys(apis).forEach((key) => {
  let api = apis[key];
  router.post(api.path, handlers[key]);
});
// 使用hooks
router.use(errorHandler);

module.exports = router;
