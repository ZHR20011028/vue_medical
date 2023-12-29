import http from "@/utils/request";

// 返回值班数据
export const getAllWork = () => {
  return http.get("/works");
};

export const getRegisters = () => {
  return http.get("/registers");
};
