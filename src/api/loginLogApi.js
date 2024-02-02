import http from "@/utils/request";

//分页接口
export const getPageLoginLog = (parameter) => {
  return http.get("/loginLogs", {
    params: parameter,
  });
};

//模糊查询接口
export const getLikeLoginByUsername = (parameter) => {
  return http.get("/loginLogs/like", {
    params: parameter,
  });
};

//通过username查询
export const getLoginByUsername = (parameter) => {
  return http.get("/loginLogs/search", {
    params: parameter,
  });
};
