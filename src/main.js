import Vue from "vue";
import App from "./App.vue";
//导入element
import ElementUI from "element-ui";
//导入element样式
import "element-ui/lib/theme-chalk/index.css";
//导入路由
import router from "@/router";
//导入store
import store from "@/store";
import Cookie from "js-cookie";
import "./assets/icon/iconfont.js"; //引入阿里巴巴图标库js
import "./assets/icon/iconfont.css"; //引入阿里巴巴图标库css
//全局引入element
Vue.use(ElementUI);

Vue.config.productionTip = false;

// 添加全局前置导航守卫
router.beforeEach((to, from, next) => {
  const token = Cookie.get("token");
  // token不存在，应当跳转到登录页面
  if (
    !token &&
    to.name !== "login" &&
    to.name !== "userRegistered" &&
    to.name !== "doctorRegistered"
  ) {
    next({ name: "login" });
  } else if (
    token &&
    (to.name === "login" ||
      to.name === "userRegistered" ||
      to.name === "doctorRegistered")
  ) {
    console.log(111111);
    //token存在，说明用户已登录，此时跳转至首页
    next({ name: "home" });
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (
      to.meta.roles &&
      to.meta.roles.indexOf(localStorage.getItem("id")) === -1
    ) {
      next({ name: "home" });
    } else {
      // 用户已登录，并且有权限，继续
      next();
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
