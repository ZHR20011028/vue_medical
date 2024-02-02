import http from "@/utils/request";

export const login = (parameter) => {
  return http.post("/users", parameter);
};

export const getRegisterData = (parameter) => {
  return http.get("/users", {
    params: parameter,
  });
};

export const addPatientUser = (parameter, idCard) => {
  return http.post("/users/" + idCard, parameter);
};

export const addDoctorUser = (parameter) => {
  return http.post("/users/doctor", parameter);
};
