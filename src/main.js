import Vue from "vue";
import App from "./App.vue";
//导入element
import ElementUI from "element-ui";
//导入element样式
import "element-ui/lib/theme-chalk/index.css";
//导入路由
import router from "@/router";

//全局引入element
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
