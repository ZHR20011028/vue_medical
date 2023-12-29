import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

//导入组件
import Main from "@/views/MainView.vue";
import Login from "@/views/LoginView.vue";
import Home from "@/views/HomeView.vue";
import Registered from "@/views/RegisteredView.vue";
import Triage from "@/views/TriageView.vue";
import Patient from "@/views/PatientView.vue";
import Department from "@/views/DepartmentView.vue";
import Doctor from "@/views/DoctorView.vue";
import Share from "@/views/ShareView.vue";
import DrugManage from "@/views/DrugManageView.vue";
import DrugReview from "@/views/DrugReviewView.vue";
import LoginLog from "@/views/LoginLogView.vue";
import DiagnosisLog from "@/views/DiagnosisLogView.vue";
import DutyManage from "@/views/DutyManageView.vue";
import Error404 from "@/views/404.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: Home,
      },
      {
        path: "/registered",
        name: "registered",
        component: Registered,
      },
      {
        path: "/triage",
        name: "triage",
        component: Triage,
      },
      {
        path: "/patient",
        name: "patient",
        component: Patient,
      },
      {
        path: "/department",
        name: "department",
        component: Department,
      },
      {
        path: "/doctor",
        name: "doctor",
        component: Doctor,
      },
      {
        path: "/share",
        name: "share",
        component: Share,
      },
      {
        path: "/drugManage",
        name: "drugManage",
        component: DrugManage,
      },
      {
        path: "/drugReview",
        name: "drugReview",
        component: DrugReview,
      },
      {
        path: "/loginLog",
        name: "loginLog",
        component: LoginLog,
      },
      {
        path: "/diagnosisLog",
        name: "diagnosisLog",
        component: DiagnosisLog,
      },
      {
        path: "/dutyManage",
        name: "dutyManage",
        component: DutyManage,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/404",
    name: "404",
    component: Error404,
  },
];
const router = new VueRouter({
  routes,
});

export default router;
