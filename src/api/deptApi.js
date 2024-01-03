import http from "@/utils/request";

export const getDeptByName = (parameter) => {
  return http.get("/departments/name", {
    params: parameter,
  });
};
