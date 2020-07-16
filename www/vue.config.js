module.exports = {
  // 路径
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  // 混入样式
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          "primary-color": "#41B883",
          "link-color": "#41B883",
          "border-radius-base": "2px",
        },
        javascriptEnabled: true,
      },
    },
  },
  // 设置页面标题
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "解析木信息管理系统";
      return args;
    });
  },
};
