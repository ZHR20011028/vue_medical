import http from "@/utils/request";

export const getAllDutyOK = (parameter) => {
  return http.get("/duties/ok", {
    params: parameter,
  });
};

export const getAllDutyNo = (parameter) => {
  return http.get("/duties/no", {
    params: parameter,
  });
};
