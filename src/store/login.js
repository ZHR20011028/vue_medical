export default {
  state: {
    admin: {
      adminNav: [
        {
          path: "/home",
          name: "home",
          label: "首页",
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
          path: "/dutyManage",
          name: "dutyManage",
          label: "值班管理",
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
      ],
    },
    patient: {
      patientNav: [
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
      ],
    },
    doctor: {
      doctorNav: [
        {
          path: "/home",
          name: "home",
          label: "首页",
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
          path: "/share",
          name: "share",
          label: "共享文件",
        },
      ],
    },
  },
  mutations: {
    setRouterAndNavData(state, permissions) {
      if (permissions === 1) {
        localStorage.setItem("id", "admin");
        localStorage.setItem("menuData", JSON.stringify(state.admin.adminNav));
      } else if (permissions === 2) {
        localStorage.setItem("id", "doctor");
        localStorage.setItem(
          "menuData",
          JSON.stringify(state.doctor.doctorNav)
        );
      } else if (permissions === 3) {
        localStorage.setItem("id", "patient");
        localStorage.setItem(
          "menuData",
          JSON.stringify(state.patient.patientNav)
        );
      }
    },
  },
};
