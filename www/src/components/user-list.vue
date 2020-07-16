<template>
  <div>
    <!--页头-->
    <a-page-header title="用户列表" :backIcon="false">
      <template slot="tags">
        <a-tag>数量 {{usersCount}}</a-tag>
      </template>
      <template slot="extra">
        <a-button type="primary" icon="user-add" @click="handleAddUser">添加用户</a-button>
      </template>
    </a-page-header>
    <!--用户列表-->
    <a-table
      :loading="usersInfo.isLoading"
      :columns="usersInfo.columns"
      :dataSource="usersInfo.datas"
      :rowKey="record => record._id"
    >
      <!--状态-->
      <template slot="isEnabled" slot-scope="value">
        <a-tag :color="value?'green':'red'">{{value?'可用':'禁用'}}</a-tag>
      </template>
      <!--操作-->
      <template slot="actions" slot-scope="value,record">
        <a-button-group size="small">
          <a-button type="link" @click="handleEditUser(record)">编辑</a-button>
          <a-button type="link" @click="handleEnableUser(record)" :disabled="record.isEnabled">启用</a-button>
          <a-button type="link" @click="handleDisableUser(record)" :disabled="!record.isEnabled">停用</a-button>
        </a-button-group>
      </template>
    </a-table>
    <!--用户添加/编辑-->
    <a-modal v-model="userInfo.isShow" :title="userInfo.scene==='add'?'添加用户':'编辑用户'" :footer="null">
      <a-form-item v-if="userInfo.scene==='edit'">
        <a-input v-model="userInfo._id" :disabled="true">
          <a-icon slot="prefix" type="idcard" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-model="userInfo.username" placeholder="请填写用户名">
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-model="userInfo.password" placeholder="请填写密码">
          <a-icon slot="prefix" type="lock" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-model="userInfo.description" placeholder="请填写描述">
          <a-icon slot="prefix" type="exception" />
        </a-input>
      </a-form-item>
      <a-button type="primary" block :loading="userInfo.isLoading" @click="handleSubmit">提交</a-button>
    </a-modal>
  </div>
</template>

<script>
import { COLUMNS } from "@/const";
import {
  serviceGetUsersAsAdmin,
  serviceAddUserAsAdmin,
  serviceEditUserAsAdmin,
  serviceSetUserEnabledAsAdmin,
  serviceSetUserDisabledAsAdmin
} from "@/services";
export default {
  name: "UserList",
  data() {
    return {
      // 用户列表
      usersInfo: {
        isLoading: true,
        columns: COLUMNS.usersAsAdmin,
        datas: []
      },
      // 用户添加/编辑
      userInfo: {
        isShow: false,
        isLoading: false,
        scene: "",
        _id: "",
        username: "",
        password: "",
        description: ""
      }
    };
  },
  computed: {
    // 用户数量
    usersCount() {
      return this.usersInfo.datas.length;
    }
  },
  created() {
    // 获取用户列表
    this.getUsers();
  },
  methods: {
    // 获取用户列表
    async getUsers() {
      this.usersInfo.isLoading = true;
      try {
        let result = await serviceGetUsersAsAdmin();
        this.usersInfo.datas = result.data;
      } catch (err) {
        this.$message.error(err);
      }
      this.usersInfo.isLoading = false;
    },
    // 添加用户
    async addUser() {
      this.userInfo.isLoading = true;
      try {
        let params = {
          username: this.userInfo.username,
          password: this.userInfo.password,
          description: this.userInfo.description
        };
        let result = await serviceAddUserAsAdmin(params);
        this.$message.success(result.msg);
        this.userInfo.isShow = false;
        this.getUsers();
      } catch (err) {
        this.$message.error(err);
      }
      this.userInfo.isLoading = false;
    },
    // 编辑用户
    async editUser() {
      this.userInfo.isLoading = true;
      try {
        let params = {
          id: this.userInfo._id,
          username: this.userInfo.username,
          password: this.userInfo.password,
          description: this.userInfo.description
        };
        let result = await serviceEditUserAsAdmin(params);
        this.$message.success(result.msg);
        this.userInfo.isShow = false;
        this.getUsers();
      } catch (err) {
        this.$message.error(err);
      }
      this.userInfo.isLoading = false;
    },
    // 启用用户
    async enableUser(id) {
      try {
        let params = { id };
        let result = await serviceSetUserEnabledAsAdmin(params);
        this.$message.success(result.msg);
        this.getUsers();
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 停用用户
    async disableUser(id) {
      try {
        let params = { id };
        let result = await serviceSetUserDisabledAsAdmin(params);
        this.$message.success(result.msg);
        this.getUsers();
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 【操作】添加用户
    handleAddUser() {
      this.userInfo.scene = "add";
      this.userInfo._id = "";
      this.userInfo.username = "";
      this.userInfo.password = "";
      this.userInfo.description = "";
      this.userInfo.isShow = true;
    },
    // 【操作】编辑用户
    handleEditUser(record) {
      this.userInfo.scene = "edit";
      this.userInfo._id = record._id;
      this.userInfo.username = record.username;
      this.userInfo.password = record.password;
      this.userInfo.description = record.description;
      this.userInfo.isShow = true;
    },
    // 【操作】启用用户
    handleEnableUser(record) {
      this.enableUser(record._id);
    },
    // 【操作】停用用户
    handleDisableUser(record) {
      this.disableUser(record._id);
    },
    // 【操作】提交添加/编辑用户
    handleSubmit() {
      let handler = {
        add: this.addUser,
        edit: this.editUser
      };
      handler[this.userInfo.scene]();
    }
  }
};
</script>

<style lang="less" scoped>
</style>