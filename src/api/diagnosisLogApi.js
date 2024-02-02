import http from "@/utils/request";

//分页接口
export const getPageDiagnosisLog = (parameter) => {
  return http.get("/diagnosisLogs", {
    params: parameter,
  });
};

//按医生查询
export const getDiagnosisLogByDoctorName = (parameter) => {
  return http.get("/diagnosisLogs/search", {
    params: parameter,
  });
};
