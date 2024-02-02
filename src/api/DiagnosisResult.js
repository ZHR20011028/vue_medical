import http from "@/utils/request";

//查询是否挂号
export const getOneDiagnosisResult = (parameter) => {
  return http.get("/diagnosisResults/one", {
    params: parameter,
  });
};

//增加病例
export const addDiagnosisResult = (parameter) => {
  return http.post("/diagnosisResults", parameter);
};

//更新诊断结果
export const modifyDiagnosisResult = (parameter) => {
  return http.put("/diagnosisResults", parameter);
};
