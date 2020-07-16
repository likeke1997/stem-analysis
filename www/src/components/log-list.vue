<template>
  <div>
    <!--页头-->
    <a-page-header title="日志列表" :backIcon="false">
      <template slot="tags">
        <a-tag>数量 {{logsCount}}</a-tag>
      </template>
    </a-page-header>
    <!--日志列表-->
    <a-table
      :loading="logsInfo.isLoading"
      :columns="logsInfo.columns"
      :dataSource="logsInfo.datas"
      :rowKey="record => record._id"
    >
      <!--操作-->
      <template slot="actions" slot-scope="value,record">
        <a-button-group size="small">
          <a-button type="link" @click="handleEyeLog(record)">查看</a-button>
          <a-button type="link" @click="handleDeleteLog(record)">删除</a-button>
        </a-button-group>
      </template>
    </a-table>
    <!--日志详情-->
    <a-modal v-model="logInfo.isShow" title="日志详情" :footer="null">
      <a-descriptions :title="logInfo.time" layout="vertical">
        <a-descriptions-item label="用户">{{logInfo.username}}</a-descriptions-item>
        <a-descriptions-item label="API">{{logInfo.path}}</a-descriptions-item>
        <a-descriptions-item label="描述">{{logInfo.description}}</a-descriptions-item>
        <a-descriptions-item label="携带参数" :span="3">
          <pre><code id="json">{{logInfo.params}}</code></pre>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { COLUMNS, FILTERS, UTILS } from "@/const";
import {
  serviceGetLogsAsAdmin,
  serviceGetLogs,
  serviceDeleteLog
} from "@/services";
export default {
  name: "LogList",
  data() {
    return {
      // 日志列表
      logsInfo: {
        isLoading: true,
        columns: [],
        datas: []
      },
      // 日志详情
      logInfo: {
        isShow: false,
        time: "",
        username: "",
        path: "",
        description: "",
        params: ""
      }
    };
  },
  computed: {
    // 是管理员用户？
    isAdmin() {
      return this.$store.state.user.isAdmin;
    },
    // 日志数量
    logsCount() {
      return this.logsInfo.datas.length;
    }
  },
  created() {
    // 获取日志列表
    this.getLogs();
  },
  methods: {
    // 初始化日志列表的列信息
    initColumns() {
      if (this.logsInfo.columns.length) return;
      this.logsInfo.columns = this.isAdmin ? COLUMNS.logsAsAdmin : COLUMNS.logs;
    },
    // 初始化日志列表的筛选信息
    initFilters() {
      let filters = this.isAdmin ? FILTERS.logsAsAdmin : FILTERS.logs;
      Object.keys(filters).forEach(index => {
        let fields = filters[index];
        this.logsInfo.columns[index].filters = UTILS.getFilters(
          this.logsInfo.datas,
          fields
        );
      });
    },
    /// 获取日志列表
    async getLogs() {
      this.logsInfo.isLoading = true;
      try {
        this.initColumns();
        let service = this.isAdmin ? serviceGetLogsAsAdmin : serviceGetLogs;
        let result = await service();
        this.logsInfo.datas = result.data;
        this.initFilters();
      } catch (err) {
        this.$message.error(err);
      }
      this.logsInfo.isLoading = false;
    },
    // 删除日志
    async deleteLog(id) {
      try {
        let params = { id };
        let result = await serviceDeleteLog(params);
        this.$message.success(result.msg);
        this.getLogs();
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 【操作】查看日志
    handleEyeLog(record) {
      this.logInfo.isShow = true;
      this.logInfo.time = UTILS.getFormatedTime(record._created);
      this.logInfo.username = record.user.username;
      this.logInfo.path = record.path;
      this.logInfo.description = record.description;
      this.logInfo.params = record.params;
    },
    // 【操作】删除日志
    handleDeleteLog(record) {
      this.deleteLog(record._id);
    }
  }
};
</script>

<style lang="less" scoped>
</style>