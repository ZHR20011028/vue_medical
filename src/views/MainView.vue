<template>
  <el-container>
    <el-header>
      <header-component />
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer style="height: 35px">Footer</el-footer>
  </el-container>
</template>
<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
export default {
  data() {
    return {};
  },
  components: {
    HeaderComponent,
  },
};
</script>
<style lang="scss" scoped>
.el-container {
  .el-header {
    padding: 0;
  }
  .el-main {
    padding: 0;
  }
  .el-footer {
    width: 100%;
    position: absolute;
    bottom: 0px;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
  }
}
</style>
