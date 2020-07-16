// 引入Vue相关
import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
// 引入antd相关
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.less";
Vue.use(Antd);

// 设置productionTip
Vue.config.productionTip = false;

// 创建vm
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
