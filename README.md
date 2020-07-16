## 项目说明

该项目为基于 MVVM 架构的解析木信息管理系统。系统前后端分离并采用 MongoDB 数据库、Express 后端框架和 Vue 前端框架，支持用户对解析木信息进行上传、编辑和删除操作，并对已上传解析木信息进行一键解析，自动计算和输出各圆盘高度对应年龄、各年龄树高、各年龄材积计算过程、各年龄材积、材积生长方程、材积生长曲线、各年龄材积生长率及其曲线、各年龄胸高形数及其曲线、各年龄各生长量及其曲线、树干纵断面图、树干三维模型这些解析结果。

![00 登录页面](./screenshots/00 登录页面.png)
![10 用户管理页面](./screenshots/10 用户管理页面.png)
![30 消息通知页面](./screenshots/30 消息通知页面.png)
![40 日志记录页面](./screenshots/40 日志记录页面.png)
![20 解析木页面](./screenshots/20 解析木页面.png)
![21 添加解析木](./screenshots/21 添加解析木.png)
![23 解析结果 1](./screenshots/23 解析结果 1.png)
![24 解析结果 2](./screenshots/24 解析结果 2.png)
![25 解析结果 3](./screenshots/25 解析结果 3.png)
![26 解析结果 4](./screenshots/26 解析结果 4.png)
![27 解析结果 5](./screenshots/27 解析结果 5.png)
![28 解析结果 6](./screenshots/28 解析结果 6.png)
![29 解析结果 7](./screenshots/29 解析结果 7.png)

## 如何构建？

下载项目代码后，需按照以下步骤进行项目构建：

1. 安装`node.js`环境。
2. 安装`MongoDB`数据库。
3. 进入`server`目录。
   4.1 修改`./bin/config.js`中的相关配置项。
   4.2 运行`npm run start`命令，启动服务器。
4. 进入`www`目录。
   4.1 修改`./src/services/service.js`中的 api 地址。
   4.2 运行`npm run build`命令，构建项目到`./dist`文件夹下。
   4.3 将构建好的项目放到服务器中公开的文件夹下。

## 后端 API

见`www/bins/apis.js`。

## 前端组件

```shell
App 根页面
|-PageLogin 登录页面
|-ContainerHeader 页头
|-ContainerContent 内容
  |-TreeList 树木列表
    |-TreeForm 树木表单
    |-TreeAdd 添加树木
    |-TreeEdit 编辑树木
    |-TreeResult 解析结果
  |-UserList 用户列表
  |-MessageList 通知列表
  |-LogList 日志列表
|-ContainerFooter 页脚
```
