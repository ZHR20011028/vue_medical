import http from "@/utils/request";

export const getDeptByDeptId = (parameter) => {
  return http.get("/departments/one", {
    params: parameter,
  });
};

export const addDept = (parameter) => {
  return http.post("/departments", parameter);
};

export const removeDept = (parameter) => {
  return http.delete("/departments", {
    params: parameter,
  });
};

export const modifyDept = (parameter) => {
  return http.put("/departments", parameter);
};

export const getPageDept = (parameter) => {
  return http.get("/departments/page", {
    params: parameter,
  });
};

export const getLikeDept = (parameter) => {
  return http.get("/departments/like", {
    params: parameter,
  });
};

export const getDeptByDeptName = (parameter) => {
  return http.get("/departments/name", {
    params: parameter,
  });
};

export const getAllDept = () => {
  return http.get("/departments");
};
