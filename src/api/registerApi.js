import http from "@/utils/request";

//返回注册人数
export const getRegisters = () => {
  return http.get("/deptRegisters");
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
  return http.get("/deptRegisters/deptId", {
    params: parameter,
  });
};

//更新挂号状态
export const modifyRegisterState = (parameter) => {
  return http.put("/registers", parameter);
};
