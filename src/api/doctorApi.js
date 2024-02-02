import http from "@/utils/request";

//分页api
export const getPageDoctor = (parameter) => {
  return http.get("/doctorDepts", {
    params: parameter,
  });
};

//按名字模糊查询
export const getLikeDoctorByDoctorName = (parameter) => {
  return http.get("/doctors/like", {
    params: parameter,
  });
};

//按id查询
export const getDoctorDeptByDoctorId = (parameter) => {
  return http.get("/doctorDepts/doctorId", {
    params: parameter,
  });
};

//按科室id查询
export const getDoctorByDeptId = (parameter) => {
  return http.get("/doctorDepts/deptId", {
    params: parameter,
  });
};

//按id删除
export const removeDoctorByDoctorId = (parameter) => {
  return http.delete("/doctors", {
    params: parameter,
  });
};

//更新
export const modifyDoctor = (parameter) => {
  return http.put("/doctors", parameter);
};

export const addDoctor = (parameter) => {
  return http.post("/doctors", parameter);
};
