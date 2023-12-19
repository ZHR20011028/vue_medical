<template>
  <div class="header-container">
    <div class="l_content">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#f8f8f8"
        text-color="#777"
      >
        <h3>分诊管理系统</h3>
        <el-menu-item
          @click="clickMenu(item)"
          v-for="item in noChildren"
          :key="item.name"
          :index="item.name"
          >{{ item.label }}</el-menu-item
        >
        <el-submenu
          v-for="subItem in hasChildren"
          :key="subItem.label"
          :index="subItem.label"
        >
          <template slot="title">{{ subItem.label }}</template>
          <el-menu-item
            @click="clickMenu(item)"
            v-for="item in subItem.children"
            :key="item.name"
            :index="item.name"
            >{{ item.label }}</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </div>
    <div class="r_content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar icon="el-icon-user-solid"></el-avatar>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuData: [
        {
          path: "/home",
          name: "home",
          label: "首页",
        },
        {
          path: "/registered",
          name: "registered",
          label: "挂号中心",
        },
        {
          path: "/triage",
          name: "triage",
          label: "分诊管理",
        },
        {
          path: "/patient",
          name: "patient",
          label: "患者管理",
        },
        {
          path: "/department",
          name: "department",
          label: "科室管理",
        },
        {
          path: "/doctor",
          name: "doctor",
          label: "医生管理",
        },
        {
          path: "/share",
          name: "share",
          label: "共享文件",
        },
        {
          label: "医药采购平台",
          children: [
            {
              path: "/drugManage",
              name: "drugManage",
              label: "药品管理",
            },
            {
              path: "/drugReview",
              name: "drugReview",
              label: "药品审核",
            },
          ],
        },
        {
          label: "日志管理",
          children: [
            {
              path: "/loginLog",
              name: "loginLog",
              label: "登录日志",
            },
            {
              path: "/diagnosisLog",
              name: "diagnosisLog",
              label: "诊断日志",
            },
          ],
        },
        {
          label: "其他管理",
          children: [
            {
              path: "/dutyManage",
              name: "dutyManage",
              label: "值班管理",
            },
            {
              path: "/noticeManage",
              name: "noticeManage",
              label: "通知管理",
            },
          ],
        },
      ],
    };
  },
  computed: {
    noChildren() {
      return this.menuData.filter((item) => !item.children);
    },
    hasChildren() {
      return this.menuData.filter((item) => item.children);
    },
  },
  methods: {
    //点击菜单
    clickMenu(item) {
      //当前页面的路由与跳转的路由不一致时才允许跳转
      if (
        this.$route.path !== item.path &&
        !(this.$route.path === "/home" && item === "/")
      ) {
        this.$router.push(item.path);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  background-color: #f8f8f8;
  border-bottom: solid 1px #e6e6e6;
  .l_content {
    .el-menu {
      display: flex;
      align-items: center;
      border-bottom: none;
      h3 {
        width: 180px;
        height: 20px;
        text-align: center;
        font-size: 30px;
        color: #777;
        line-height: 20px;
        margin: 15px;
        white-space: nowrap;
      }
    }
  }
  .r_content {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
}
</style>
