import http from "@/utils/request";

//返回注册人数
export const getRegisters = () => {
  return http.get("/registers");
};

// 挂号
export const addRegisters = (parameter) => {
  return http.post("/registers", parameter);
};

//取消挂号
export const removeRegisters = (parameter) => {
  return http.delete("/registers", {
    data: parameter,
  });
};

//查询是否挂号
export const getRegisterOne = (parameter) => {
  return http.get("/registers/" + parameter);
};

//查询某个部门的挂号情况
export const getRegisterByDeptId = (parameter) => {
  return http.get("/registers/deptId", {
    params: parameter,
  });
};
