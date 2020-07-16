<template>
  <div>
    <!--页头-->
    <a-page-header title="解析木列表" :backIcon="false">
      <template slot="tags">
        <a-tag>数量 {{treesCount}}</a-tag>
      </template>
      <template v-if="!isAdmin" slot="extra">
        <a-button type="primary" @click="handleAddTree">添加解析木</a-button>
      </template>
    </a-page-header>
    <!--树木列表-->
    <a-table
      :loading="treesInfo.isLoading"
      :columns="treesInfo.columns"
      :dataSource="treesInfo.datas"
      :rowKey="record => record._id"
    >
      <!--是否带皮-->
      <template slot="bark" slot-scope="value,record">{{record.discsInfo.bark?'是':'否'}}</template>
      <!--颜色-->
      <template slot="color" slot-scope="value,record">
        <a-tag :color="record.extraInfo.color">⚪</a-tag>
      </template>
      <!--操作-->
      <template slot="actions" slot-scope="value,record">
        <a-button-group size="small">
          <a-button type="link" @click="handleAnalysisTree(record)">解析</a-button>
          <a-button v-if="!isAdmin" type="link" @click="handleEditTree(record)">编辑</a-button>
          <a-button type="link" @click="handleDeleteTree(record)">删除</a-button>
        </a-button-group>
      </template>
    </a-table>
  </div>
</template>

<script>
import { COLUMNS, FILTERS, UTILS } from "@/const";
import {
  serviceGetTreesAsAdmin,
  serviceGetTrees,
  serviceDeleteTree
} from "@/services";
export default {
  name: "TreeList",
  data() {
    return {
      // 树木列表
      treesInfo: {
        isLoading: true,
        columns: [],
        datas: []
      }
    };
  },
  computed: {
    // 是管理员用户？
    isAdmin() {
      return this.$store.state.user.isAdmin;
    },
    // 树木列表
    treesCount() {
      return this.treesInfo.datas.length;
    }
  },
  created() {
    this.initColumns();
    this.getTrees();
  },
  methods: {
    // 初始化树木列表的列
    initColumns() {
      if (this.treesInfo.columns.length) return;
      this.treesInfo.columns = this.isAdmin
        ? COLUMNS.treesAsAdmin
        : COLUMNS.trees;
    },
    // 初始化树木列表的筛选
    initFilters() {
      let filters = this.isAdmin ? FILTERS.treesAsAdmin : FILTERS.trees;
      Object.keys(filters).forEach(index => {
        let fields = filters[index];
        this.treesInfo.columns[index].filters = UTILS.getFilters(
          this.treesInfo.datas,
          fields
        );
      });
    },
    // 获取树木列表
    async getTrees() {
      this.treesInfo.isLoading = true;
      try {
        let service = this.isAdmin ? serviceGetTreesAsAdmin : serviceGetTrees;
        let result = await service();
        this.treesInfo.datas = result.data;
        this.initFilters();
      } catch (err) {
        this.$message.error(err);
      }
      this.treesInfo.isLoading = false;
    },
    // 删除树木
    async deleteTree(id) {
      try {
        let params = { id };
        let result = await serviceDeleteTree(params);
        this.$message.success(result.msg);
        this.getTrees();
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 【操作】添加树木
    handleAddTree() {
      this.$router.push("/tree-add");
    },
    // 【操作】解析树木
    handleAnalysisTree(record) {
      let { _id } = record;
      this.$router.push(`/tree-result/${_id}`);
    },
    // 【操作】编辑树木
    handleEditTree(record) {
      let { _id } = record;
      this.$router.push(`/tree-edit/${_id}`);
    },
    // 【操作】删除树木
    handleDeleteTree(record) {
      this.deleteTree(record._id);
    }
  }
};
</script>

<style lang="less" scoped>
</style>