 <template>
  <div class="container">
    <!--LOGO-->
    <img src="@/assets/logo.png" class="logo" />
    <!--TITLE-->
    <span class="text">{{APP.title}}</span>
    <!--菜单-->
    <a-menu v-model="current" mode="horizontal" class="menu">
      <a-sub-menu>
        <span slot="title">
          <a-icon type="user" />
          {{user.username}}
          <a-icon type="down" />
        </span>
        <a-menu-item key="tree" @click="handleToTree">
          <a-icon type="home" />解析木管理
        </a-menu-item>
        <a-menu-item key="user" v-if="user.isAdmin" @click="handleToUser">
          <a-icon type="team" />用户管理
        </a-menu-item>
        <a-menu-item key="message" @click="handleToMessage">
          <a-icon type="mail" />消息通知
        </a-menu-item>
        <a-menu-item key="log" @click="handleToLog">
          <a-icon type="book" />操作日志
        </a-menu-item>
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />退出登录
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
          
<script>
import { INFO } from "@/const";
export default {
  name: "ContainerHeader",
  data() {
    return {
      // app信息
      APP: INFO.app,
      // 当前菜单选项
      current: ["tree"]
    };
  },
  computed: {
    // 用户信息
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    // 【操作】跳转到树木管理页面
    handleToTree() {
      this.$router.push("/tree-list");
    },
    // 【操作】跳转到用户管理页面
    handleToUser() {
      this.$router.push("/user-list");
    },
    // 【操作】跳转到消息通知页面
    handleToMessage() {
      this.$router.push("/message-list");
    },
    // 【操作】跳转到日志管理页面
    handleToLog() {
      this.$router.push("/log-list");
    },
    // 【操作】登出
    handleLogout() {
      this.$store.commit("logout");
      this.$router.push("/");
    }
  }
};
</script>
        
<style lang="less" scoped>
.container {
  .logo {
    float: left;
    display: block;
    width: 48px;
    margin: 8px 0;
  }
  .text {
    float: left;
    display: block;
    margin: 0 32px;
    font-size: 1.75em;
  }
  .menu {
    float: right;
    display: block;
    margin: 8px 0;
    font-size: 1.25em;
  }
}
.ant-menu-horizontal {
  border-bottom: 0 !important;
}
</style>