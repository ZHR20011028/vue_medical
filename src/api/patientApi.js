import http from "@/utils/request";

//分页查询
export const getPagePatient = (parameter) => {
  return http.get("/patients/page", {
    params: parameter,
  });
};

//按患者名搜素
export const getPatientByPatientId = (parameter) => {
  return http.get("/patients/patientId", {
    params: parameter,
  });
};

//返回患者所有的诊断信息
export const getAllDiagnosisByPatientId = (parameter) => {
  return http.get("/diagnosisPatientDoctors", {
    params: parameter,
  });
};

export const getPatientByLike = (parameter) => {
  return http.get("/patients/like", {
    params: parameter,
  });
};

export const addPatient = (parameter) => {
  return http.post("/patients/register", parameter);
};

export const modifyPatient = (parameter) => {
  return http.put("/patients", parameter);
};
