<template>
  <el-container :style="windowStyle">
    <el-header>
      <header-component />
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer style="height: 35px">
      <div class="footer-div">
        <span>footer</span>
      </div>
    </el-footer>
  </el-container>
</template>
<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
export default {
  data() {
    return {
      windowStyle: {
        width: "100%",
        height: "100%",
      },
    };
  },
  components: {
    HeaderComponent,
  },
  mounted() {
    this.updateWindowSize();
    window.addEventListener("resize", this.updateWindowSize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowSize);
  },
  methods: {
    updateWindowSize() {
      this.windowStyle.width = window.innerWidth + "px";
      this.windowStyle.height = window.innerHeight + "px";
    },
  },
};
</script>
<style lang="scss" scoped>
.el-container {
  min-width: 100vw;
  .el-header {
    padding: 0;
  }
  .el-main {
    padding: 0;
  }
  .el-footer {
    align-self: flex-end;
    width: 100%;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
  }
}
</style>
