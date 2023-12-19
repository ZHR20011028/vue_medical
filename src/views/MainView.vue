<template>
  <el-container>
    <el-header>
      <header-component />
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
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
.el-container{
  .el-header{
    padding: 0;
  }
}
</style>
