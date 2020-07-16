// handlers

// 导入childProcess
const childProcess = require("child_process");
// 导入configs、models、apis
const { adminUsername, adminPassword, adminDescription } = require("./configs");
const { User, Message, Tree, Log } = require("./models");
const apis = require("./apis");

// 包装result
const Result = function (data, msg = "") {
  this.data = data;
  this.msg = msg;
};

// handlers
const handlers = {
  // 自动创建/更新管理员用户
  init: async () => {
    // 查询管理员用户是否已存在
    // 如果存在则更新，不存在则创建
    let conditions = {
      isAdmin: true,
    };
    let update = {
      username: adminUsername,
      password: adminPassword,
      description: adminDescription,
      isAdmin: true,
      isEnabled: true,
    };
    let options = {
      upsert: true,
    };
    let query = User.findOneAndUpdate(conditions, update, options);
    await query.exec();
    console.log("已自动创建/更新管理员用户", update);
  },
  // 用户认证
  auth: async (req) => {
    // 获取参数
    let { path } = req;
    // 转换path：'/xxx'=>'xxx'
    let key = path.slice(1);
    // 判断是否需要权限
    let auth = apis[key].requireAuth;
    if (!auth) return;
    // 获取用户信息并进行认证
    let { user } = req.body;
    let conditions = {
      username: user.username,
      password: user.password,
      isEnabled: true,
    };
    if (auth === "admin") conditions.isAdmin = true;
    let query = User.findOne(conditions);
    let data = await query.exec();
    // 认证失败则报错
    if (!data) throw new Error("用户认证失败！");
  },
  // 日志记录
  log: async (req) => {
    // 获取参数
    let { ip, path } = req;
    // 转换path：'/xxx'=>'xxx'
    let key = path.slice(1);
    // 判断是否需要记录
    let log = apis[key].requireLog;
    if (!log) return;
    // 添加日志
    let { user } = req.body;
    let doc = {
      user: user._id,
      ip,
      path,
      description: apis[key].description,
      params: req.body,
    };
    await new Log(doc).save();
  },
  // 登录
  login: async (req, res) => {
    // 获取参数
    let { username, password } = req.body;
    // 判断账号和密码是否正确，以及用户是否可用
    let conditions = {
      username,
      password,
      isEnabled: true,
    };
    let query = User.findOne(conditions);
    let data = await query.exec();
    // 返回登录结果
    let result = data
      ? new Result(data, "登录成功！")
      : new Result({}, "登录失败！");
    res.send(result);
  },
  // 管理员用户获取所有用户信息
  getUsersAsAdmin: async (req, res) => {
    // 筛选出普通用户
    let conditions = {
      isAdmin: false,
    };
    let query = User.find(conditions);
    let data = await query.exec();
    // 返回结果
    let result = new Result(data);
    res.send(result);
  },
  // 管理员用户添加普通用户
  addUserAsAdmin: async (req, res) => {
    // 获取参数
    let { username, password, description } = req.body;
    // 生成用户
    let doc = {
      username,
      password,
      description,
      isAdmin: false,
      isEnabled: true,
    };
    // 查询用户名是否已存在
    let conditions = {
      username,
    };
    let query = User.findOne(conditions);
    let user = await query.exec();
    // 返回注册结果
    let result = user
      ? new Result({ username }, "添加用户失败！")
      : new Result(await new User(doc).save(), "添加用户成功！");
    res.send(result);
  },
  // 管理员用户编辑普通用户
  editUserAsAdmin: async (req, res) => {
    // 获取参数
    let { id, username, password, description } = req.body;
    // 更新用户
    let update = {
      username,
      password,
      description,
    };
    let query = User.findByIdAndUpdate(id, update);
    let data = await query.exec();
    // 返回更新结果
    let result = new Result(data, "编辑用户成功！");
    res.send(result);
  },
  // 管理员启用用户
  setUserEnabledAsAdmin: async (req, res) => {
    // 获取参数
    let { id } = req.body;
    // 更新用户
    let update = {
      isEnabled: true,
    };
    let query = User.findByIdAndUpdate(id, update);
    let data = await query.exec();
    // 返回更新结果
    let result = new Result(data, "启用用户成功！");
    res.send(result);
  },
  // 管理员禁用用户
  setUserDisabledAsAdmin: async (req, res) => {
    // 获取参数
    let { id } = req.body;
    // 更新用户
    let update = {
      isEnabled: false,
    };
    let query = User.findByIdAndUpdate(id, update);
    let data = await query.exec();
    // 返回更新结果
    let result = new Result(data, "停用用户成功！");
    res.send(result);
  },
  // 获取当前用户信息
  getUser: async (req, res) => {
    // 获取参数
    let { user } = req.body;
    // 获取当前用户
    let query = User.findOneById(user._id);
    let data = await query.exec();
    // 返回结果
    let result = new Result(data);
    res.send(result);
  },
  // 管理员获取消息
  getMessagesAsAdmin: async (req, res) => {
    // 获取参数
    let { user } = req.body;
    // 获取消息
    let conditions = {
      userSend: user._id,
    };
    let query = Message.find(conditions)
      .populate("userSend")
      .populate("usersReceive");
    let data = await query.exec();
    // 返回结果
    let result = new Result(data);
    res.send(result);
  },
  // 管理员发送消息
  addMessageAsAdmin: async (req, res) => {
    // 获取参数
    let { user, ids, title, content } = req.body;
    // 发送消息
    // 发件人方数据
    let doc = {
      userSend: user._id,
      usersReceive: ids,
      title,
      content,
      hasRead: false,
    };
    await new Message(doc).save();
    // 收件人方数据
    await ids.forEach(async (id) => {
      let doc = {
        userSend: id,
        usersReceive: null,
        title,
        content,
        hasRead: false,
      };
      await new Message(doc).save();
    });
    let data = { user, ids, title, content };
    // 返回结果
    let result = new Result(data, "发送消息成功！");
    res.send(result);
  },
  // 获取消息
  getMessages: async (req, res) => {
    // 获取参数
    let { user } = req.body;
    // 获取消息
    let conditions = {
      userSend: user._id,
    };
    let query = Message.find(conditions)
      .populate("userSend")
      .populate("usersReceive");
    let data = await query.exec();
    // 返回结果
    let result = new Result(data);
    res.send(result);
  },
  // 设置消息已读
  setMessageRead: async (req, res) => {
    // 获取参数
    let { id } = req.body;
    // 更新消息
    let update = {
      hasRead: true,
    };
    let query = Message.findByIdAndUpdate(id, update);
    let data = await query.exec();
    // 返回结果
    let result = new Result(data, "设置消息已读成功！");
    res.send(result);
  },
  // 设置消息未读
  setMessageUnread: async (req, res) => {
    // 获取参数
    let { id } = req.body;
    // 更新消息
    let update = {
      hasRead: false,
    };
    let query = Message.findByIdAndUpdate(id, update);
    let data = await query.exec();
    // 返回结果
    let result = new Result(data, "设置消息未读成功！");
    res.send(result);
  },
  // 删除消息
  deleteMessage: async (req, res) => {
    // 获取参数
    let { id } = req.body;
    // 更新消息
    let query = Message.findByIdAndRemove(id);
    let data = await query.exec();
    // 返回结果
    let result = new Result(data, "删除消息成功！");
    res.send(result);
  },
  // 管理员用户获取日志
  getLogsAsAdmin: async (req, res) => {
    // 获取日志
    let query = Log.find().populate("user");
    let data = await query.exec();
    // 返回结果
    let result = new Result(data);
    res.send(result);
  },
  // 获取日志
  getLogs: async (req, res) => {
    // 获取参数
    let { user } = req.body;
    // 获取日志
    let conditions = {
      user: user._id,
    };
    let query = Log.find(conditions).populate("user");
    let data = await query.exec();
    // 返回结果
    let result = new Result(data);
    res.send(result);
  },
  // 删除日志
  deleteLog: async (req, res) => {
    // 获取参数
    let { id } = req.body;
    // 删除日志
    let query = Log.findByIdAndRemove(id);
    let data = await query.exec();
    // 返回结果
    let result = new Result(data, "删除日志成功！");
    res.send(result);
  },
  // 管理员用户获取解析木列表
  getTreesAsAdmin: async (req, res) => {
    // 获取所有解析木
    let query = Tree.find().populate("user");
    let data = await query.exec();
    // 返回数据
    let result = new Result(data);
    res.send(result);
  },
  // 普通用户获取解析木列表
  getTrees: async (req, res) => {
    // 获取参数
    let { user } = req.body;
    // 获取解析木
    let conditions = {
      user: user._id,
    };
    let query = Tree.find(conditions).populate("user");
    let data = await query.exec();
    // 返回数据
    let result = new Result(data);
    res.send(result);
  },
  // 获取单个解析木
  getTree: async (req, res) => {
    // 获取参数
    let { id } = req.body;
    // 获取解析木
    let query = Tree.findById(id).populate("user");
    let data = await query.exec();
    // 返回结果
    let result = new Result(data);
    res.send(result);
  },
  // 添加解析木
  addTree: async (req, res) => {
    // 获取参数
    let { user, treeInfo, discsInfo, extraInfo } = req.body;
    // 存储解析木
    let doc = {
      user: user._id,
      treeInfo,
      discsInfo,
      extraInfo,
    };
    let data = await new Tree(doc).save();
    // 返回结果
    let result = new Result(data, "添加解析木成功！");
    res.send(result);
  },
  // 编辑解析木
  editTree: async (req, res) => {
    // 获取参数
    let { user, id, treeInfo, discsInfo, extraInfo } = req.body;
    // 更新解析木
    let update = {
      user: user._id,
      treeInfo,
      discsInfo,
      extraInfo,
    };
    let query = Tree.findByIdAndUpdate(id, update);
    let data = await query.exec();
    // 返回结果
    let result = new Result(data, "编辑解析木成功！");
    res.send(result);
  },
  // 删除解析木
  deleteTree: async (req, res) => {
    // 获取参数
    let { id } = req.body;
    // 删除解析木
    let query = Tree.findByIdAndRemove(id);
    let data = await query.exec();
    // 返回结果
    let result = new Result(data, "delete tree success");
    res.send(result);
  },
  // 获取解析木生长方程信息
  getTreeModel: async (req, res) => {
    // 获取参数
    let { ages, volumes } = req.body;
    // 创建子进程
    let workerProcess = childProcess.spawn("python", [
      "getTreeModel.py",
      "-ages",
      ...ages,
      "-volumes",
      ...volumes,
    ]);
    // 子进程传递数据
    workerProcess.stdout.on("data", (codes) => {
      // 初始化字符串
      let str = "";
      // 转换和连接字符串
      for (let code of codes) {
        let char = String.fromCharCode(code);
        str = str.concat(char);
      }
      // 剔除末尾符
      str = str.slice(0, str.length - 2);
      // 把单引号转化为双引号
      str = str.replace(/'/g, '"');
      // 解析成对象
      let data = JSON.parse(str);
      // 返回结果
      let result = new Result(data, "get tree model success");
      res.send(result);
    });
  },
};

module.exports = handlers;
