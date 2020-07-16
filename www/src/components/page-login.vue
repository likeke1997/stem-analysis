 <template>
  <div class="page">
    <a-card class="card">
      <div class="title">
        <img src="@/assets/logo.png" class="logo" />
        <span class="text">{{APP.title}}</span>
      </div>
      <a-form-item>
        <a-input v-model="loginInfo.username" placeholder="请填写用户名">
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input-password v-model="loginInfo.password" placeholder="请填写密码">
          <a-icon slot="prefix" type="lock" />
        </a-input-password>
      </a-form-item>
      <a-button
        type="primary"
        icon="login"
        block
        :loading="loginInfo.isLoading"
        @click="handleLogin"
      >登录</a-button>
    </a-card>
  </div>
</template>
          
<script>
import { INFO } from "@/const";
import { serviceLogin } from "@/services";
export default {
  name: "PageLogin",
  data() {
    return {
      // 应用信息
      APP: INFO.app,
      // 登录信息
      loginInfo: {
        isLoading: false,
        username: "",
        password: ""
      }
    };
  },
  methods: {
    // 用户登录
    async login() {
      this.loginInfo.isLoading = true;
      try {
        let params = {
          username: this.loginInfo.username,
          password: this.loginInfo.password
        };
        let result = await serviceLogin(params);
        let payload = result.data;
        switch (result.msg) {
          case "登录成功！":
            this.$message.success(result.msg);
            this.$store.commit("login", payload);
            this.$router.push("/tree-list");
            break;
          case "登录失败！":
            this.$message.error(result.msg);
            break;
        }
      } catch (err) {
        this.$message.error(err);
      }
      this.loginInfo.isLoading = false;
    },
    // 【操作】用户登录
    handleLogin() {
      let validate = true;
      if (!this.loginInfo.username) validate = false;
      if (!this.loginInfo.password) validate = false;
      if (validate) this.login();
      else this.$message.info("请填写用户名和密码！");
    }
  }
};
</script>
        
<style lang="less" scoped>
.page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url(../assets/background.jpg);
  .card {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 480px;
    padding: 16px;
    transform: translate(-50%, -50%);
    .title {
      margin-bottom: 32px;
      text-align: center;
      .logo {
        height: 48px;
      }
      .text {
        display: inline-block;
        height: 48px;
        margin-left: 16px;
        font-size: 32px;
        font-weight: 800;
        vertical-align: middle;
      }
    }
  }
}
</style>