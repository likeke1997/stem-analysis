<template>
  <div>
    <!--页头-->
    <a-page-header title="通知列表" :backIcon="false">
      <template slot="tags">
        <a-tag>数量 {{messagesCount}}</a-tag>
      </template>
      <template v-if="isAdmin" slot="extra">
        <a-button type="primary" icon="plus" @click="handleAddMessage">发布通知</a-button>
      </template>
    </a-page-header>
    <!--通知列表-->
    <a-table
      :loading="messagesInfo.isLoading"
      :columns="messagesInfo.columns"
      :dataSource="messagesInfo.datas"
      :rowKey="record => record._id"
    >
      <!--状态-->
      <template slot="hasRead" slot-scope="value">
        <a-tag :color="value?'green':'red'">{{value?'已读':'未读'}}</a-tag>
      </template>
      <!--操作-->
      <template slot="actions" slot-scope="value,record">
        <a-button-group size="small">
          <a-button type="link" @click="handleEyeMessage(record)">查看</a-button>
        </a-button-group>
      </template>
    </a-table>
    <!--发布通知-->
    <a-modal v-model="messageAddInfo.isShow" title="发布通知" :footer="null">
      <a-form-item label="收件用户">
        <a-checkbox-group v-model="messageAddInfo.receivers" :options="messageAddInfo.users" />
      </a-form-item>
      <a-form-item label="标题">
        <a-input v-model="messageAddInfo.title" placeholder="请填写通知标题" />
      </a-form-item>
      <a-form-item label="内容">
        <a-textarea v-model="messageAddInfo.content" :rows="10" placeholder="请填写通知内容" />
      </a-form-item>
      <a-button
        type="primary"
        block
        :loading="messageAddInfo.isLoading"
        @click="handleAddMessage_"
      >提交</a-button>
    </a-modal>
    <!--通知详情-->
    <a-modal v-model="messageDetailInfo.isShow" title="通知详情" :footer="null">
      <a-descriptions :title="messageDetailInfo.time" layout="vertical">
        <a-descriptions-item v-if="isAdmin" label="收件用户" :span="3">
          <a-tag
            v-for="(receiver,receiverIndex) in messageDetailInfo.receivers"
            :key="receiverIndex"
          >{{receiver}}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="标题" :span="3">{{messageDetailInfo.title}}</a-descriptions-item>
        <a-descriptions-item label="内容" :span="3">
          <pre>{{messageDetailInfo.content}}</pre>
        </a-descriptions-item>
      </a-descriptions>
      <a-button
        v-if="!isAdmin"
        block
        :loading="messageDetailInfo.isLoading"
        @click="handleUnreadMessage"
      >设置为未读</a-button>
    </a-modal>
  </div>
</template>

<script>
import { COLUMNS, UTILS } from "@/const";
import {
  serviceGetUsersAsAdmin,
  serviceGetMessagesAsAdmin,
  serviceAddMessageAsAdmin,
  serviceGetMessages,
  serviceSetMessageRead,
  serviceSetMessageUnread
} from "@/services";
export default {
  name: "MessageList",
  data() {
    return {
      // 通知列表
      messagesInfo: {
        isLoading: true,
        columns: [],
        datas: []
      },
      // 发布通知
      messageAddInfo: {
        isShow: false,
        isLoading: false,
        users: [],
        receivers: [],
        title: "",
        content: ""
      },
      // 通知详情
      messageDetailInfo: {
        isShow: false,
        isLoading: false,
        _id: "",
        time: "",
        title: "",
        content: "",
        receivers: [],
        hasRead: ""
      }
    };
  },
  computed: {
    // 是管理员用户？
    isAdmin() {
      return this.$store.state.user.isAdmin;
    },
    // 通知数量
    messagesCount() {
      return this.messagesInfo.datas.length;
    }
  },
  created() {
    // 获取用户列表
    if (this.isAdmin) this.getUsers();
    this.getMessages();
  },
  methods: {
    // 初始化通知列表的列
    initColumns() {
      if (this.messagesInfo.columns.length) return;
      this.messagesInfo.columns = this.isAdmin
        ? COLUMNS.messagesAsAdmin
        : COLUMNS.messages;
    },
    // 获取用户列表
    async getUsers() {
      try {
        let result = await serviceGetUsersAsAdmin();
        result.data.forEach(user => {
          this.messageAddInfo.users.push({
            label: user.username,
            value: user._id
          });
        });
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 获取通知列表
    async getMessages() {
      this.messagesInfo.isLoading = true;
      try {
        this.initColumns();
        let service = this.isAdmin
          ? serviceGetMessagesAsAdmin
          : serviceGetMessages;
        let result = await service();
        this.messagesInfo.datas = result.data;
      } catch (err) {
        this.$message.error(err);
      }
      this.messagesInfo.isLoading = false;
    },
    // 发布通知
    async addMessage() {
      this.messageAddInfo.isLoading = true;
      try {
        let params = {
          ids: this.messageAddInfo.receivers,
          title: this.messageAddInfo.title,
          content: this.messageAddInfo.content
        };
        let result = await serviceAddMessageAsAdmin(params);
        this.$message.success(result.msg);
        this.messageAddInfo.isShow = false;
        this.getMessages();
      } catch (err) {
        this.$message.error(err);
      }
      this.messageAddInfo.isLoading = false;
    },
    // 设置消息已读
    async readMessage(id) {
      try {
        let params = { id };
        await serviceSetMessageRead(params);
        this.messageDetailInfo.hasRead = true;
        this.getMessages();
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 设置消息未读
    async unreadMessage() {
      this.messageDetailInfo.isLoading = true;
      try {
        let params = {
          id: this.messageDetailInfo._id
        };
        let result = await serviceSetMessageUnread(params);
        this.$message.success(result.msg);
        this.messageDetailInfo.hasRead = false;
        this.getMessages();
      } catch (err) {
        this.$message.error(err);
      }
      this.messageDetailInfo.isLoading = false;
    },
    // 【操作】发布通知
    handleAddMessage() {
      this.messageAddInfo.receivers = [];
      this.messageAddInfo.title = "";
      this.messageAddInfo.content = "";
      this.messageAddInfo.isShow = true;
    },
    // 【操作】发布通知（提交）
    handleAddMessage_() {
      this.addMessage();
    },
    // 【操作】查看通知详情
    handleEyeMessage(record) {
      this.messageDetailInfo._id = record._id;
      this.messageDetailInfo.time = UTILS.getFormatedTime(record._created);
      this.messageDetailInfo.title = record.title;
      this.messageDetailInfo.content = record.content;
      if (this.isAdmin)
        this.messageDetailInfo.receivers = record.usersReceive.map(user => {
          return user.username;
        });
      this.messageDetailInfo.isShow = true;
      this.readMessage(record._id);
    },
    // 【操作】设置消息未读
    handleUnreadMessage() {
      this.unreadMessage();
    }
  }
};
</script>

<style lang="less" scoped>
</style>