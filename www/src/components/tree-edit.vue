<template>
  <div>
    <!--页头-->
    <a-page-header title="编辑解析木" @back="handleBack" />
    <!--表单-->
    <TreeForm scene="edit" @submit="editTree" />
  </div>
</template>

<script>
import TreeForm from "./tree-form";
import { serviceEditTree } from "@/services";
export default {
  name: "TreeEdit",
  components: { TreeForm },
  methods: {
    // 编辑解析木
    async editTree(data) {
      try {
        let result = await serviceEditTree(data);
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