// 数据库连接

// 导入mongoose
const mongoose = require("mongoose");
// 导入configs和handlers
const { dbUrl, dbName } = require("./configs");
const handlers = require("./handlers");

// 设置禁用findAndModify驱动
mongoose.set("useFindAndModify", false);

// 连接数据库
console.log("开始连接数据库……");
mongoose
  // 开始连接
  .connect(`${dbUrl}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // 回调
  .then(
    // 成功的回调
    async () => {
      console.log("数据库连接成功！");
      // 自动创建/更新管理员用户
      await handlers.init();
    },
    // 失败的回调
    (err) => {
      console.log("数据库连接失败！");
      console.log(err);
    }
  );
