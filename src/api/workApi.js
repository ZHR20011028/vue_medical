import http from "@/utils/request";

export const addWork = (parameter) => {
  return http.post("/works", parameter);
};

export const modifyWork = (parameter) => {
  return http.put("/works", parameter);
};
