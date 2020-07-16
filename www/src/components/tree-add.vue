<template>
  <div>
    <!--页头-->
    <a-page-header title="添加解析木" @back="handleBack" />
    <!--表单-->
    <TreeForm scene="add" @submit="addTree" />
  </div>
</template>

<script>
import TreeForm from "./tree-form";
import { serviceAddTree } from "@/services";
export default {
  name: "TreeAdd",
  components: { TreeForm },
  methods: {
    // 添加解析木
    async addTree(data) {
      try {
        let result = await serviceAddTree(data);
        this.$message.success(result.msg);
        this.handleBack();
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 【操作】返回解析木页面
    handleBack() {
      this.$router.push("/tree-list");
    }
  }
};
</script>

<style lang="less" scoped>
</style>