import http from "@/utils/request";

export const addLog = (parameter) => {
  return http.post("/logs", parameter);
};
