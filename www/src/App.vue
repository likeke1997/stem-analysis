<template>
  <div id="app">
    <a-config-provider :locale="zh_CN">
      <PageLogin v-if="!isLogin" />
      <a-layout v-else class="layout">
        <a-layout-header class="header">
          <ContainerHeader />
        </a-layout-header>
        <a-layout-content class="content">
          <ContainerContent />
        </a-layout-content>
        <a-layout-footer class="footer">
          <ContainerFooter />
        </a-layout-footer>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import PageLogin from "@/components/page-login";
import ContainerHeader from "@/components/container-header";
import ContainerContent from "@/components/container-content";
import ContainerFooter from "@/components/container-footer";
export default {
  name: "App",
  components: {
    PageLogin,
    ContainerHeader,
    ContainerContent,
    ContainerFooter
  },
  data() {
    return {
      zh_CN
    };
  },
  computed: {
    isLogin() {
      return this.$store.state.user._id;
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  .page {
    width: 100vw;
    height: 100vh;
  }
  .layout {
    min-height: 100vh;
    .header {
      height: 64px;
      background: white;
      box-shadow: 0 2px 8px #f0f1f2;
    }
    .content {
      height: calc(100% - 64px - 64px);
      padding: 32px;
    }
    .footer {
      height: 64px;
      text-align: center;
    }
  }
}
.ant-card-body {
  height: 100%;
}
.ant-form-item {
  margin: 16px 0 16px 0 !important;
  .ant-input-number,
  .ant-select {
    width: 100%;
  }
}
.ant-tabs-bar {
  margin: 0 !important;
}
</style>
