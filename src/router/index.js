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
import UserRegistered from "@/views/UserRegistered.vue"

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
        meta: { requiresAuth: true, roles: ["patient"] },
      },
      {
        path: "/triage",
        name: "triage",
        component: Triage,
        meta: { requiresAuth: true, roles: ["doctor"] },
      },
      {
        path: "/patient",
        name: "patient",
        component: Patient,
        meta: { requiresAuth: true, roles: ["doctor"] },
      },
      {
        path: "/department",
        name: "department",
        component: Department,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "/doctor",
        name: "doctor",
        component: Doctor,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "/share",
        name: "share",
        component: Share,
        meta: { requiresAuth: true, roles: ["doctor"] },
      },
      {
        path: "/drugManage",
        name: "drugManage",
        component: DrugManage,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "/drugReview",
        name: "drugReview",
        component: DrugReview,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "/loginLog",
        name: "loginLog",
        component: LoginLog,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "/diagnosisLog",
        name: "diagnosisLog",
        component: DiagnosisLog,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "/dutyManage",
        name: "dutyManage",
        component: DutyManage,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path:"/userRegistered",
    name:"userRegistered",
    component: UserRegistered
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
