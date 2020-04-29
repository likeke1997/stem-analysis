<template>
  <div id="app">
    <!--layout-->
    <a-layout class="layout">
      <!--header-->
      <a-layout-header class="header">
        <img alt="logo" src="./assets/logo.png" class="logo" />
        <span class="title">在线树干解析系统</span>
        <span class="button">
          <a-button
            icon="exclamation-circle"
            type="primary"
            ghost
            @click="showModal('systemModal')"
          >系统介绍</a-button>
        </span>
      </a-layout-header>
      <!--content-->
      <a-layout-content class="content">
        <Content />
      </a-layout-content>
      <!--footer-->
      <a-layout-footer class="footer">
        <div>
          Created By
          <a @click="showModal('authorModal')">柯小龙</a>
        </div>
      </a-layout-footer>
    </a-layout>
    <!--systemModal-->
    <a-modal
      v-model="systemModal.isShow"
      title="系统介绍"
      :footer="null"
      @cancel="closeModal('systemModal')"
    >
      <a-row v-for="(detail,detailIndex) in systemModal.detail" :key="detailIndex">
        <a-col :span="4" style="text-align:right;">{{detail.title}}：</a-col>
        <a-col :span="20">{{detail.value}}</a-col>
      </a-row>
    </a-modal>
    <!--authorModal-->
    <a-modal
      v-model="authorModal.isShow"
      title="作者介绍"
      :footer="null"
      @cancel="closeModal('authorModal')"
    >
      <a-row v-for="(detail,detailIndex) in authorModal.detail" :key="detailIndex">
        <a-col :span="4" style="text-align:right;">{{detail.title}}：</a-col>
        <a-col :span="20">{{detail.value}}</a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { SYSTEM_INFO, AUTHOR_INFO } from "@/const";
import Content from "@/components/Content.vue";
export default {
  name: "App",
  components: {
    Content
  },
  data() {
    return {
      systemModal: {
        isShow: false,
        detail: SYSTEM_INFO
      },
      authorModal: {
        isShow: false,
        detail: AUTHOR_INFO
      }
    };
  },
  methods: {
    showModal(modal) {
      this[modal].isShow = true;
    },
    closeModal(modal) {
      this[modal].isShow = false;
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  .layout {
    min-height: 100vh;
    .header {
      height: 64px;
      background: white;
      box-shadow: 0 2px 8px #f0f1f2;
      .logo {
        width: 48px;
      }
      .title {
        display: inline-block;
        width: calc(100% - 64px - 48px - 128px);
        margin: 0 32px;
        font-size: 1.5em;
      }
      .button {
        width: 128px;
      }
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
  margin: 16px !important;
}
.ant-tabs-bar {
  margin: 0 !important;
}
</style>
