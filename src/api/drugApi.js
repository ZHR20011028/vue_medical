import http from "@/utils/request";

//分页接口
export const getPageDrug = (parameter) => {
  return http.get("/drugs/page", {
    params: parameter,
  });
};

export const getPageDrugReview = (parameter) => {
  return http.get("/drugs/reviewPage", {
    params: parameter,
  });
};
//删除接口
export const delDrugByDrugId = (parameter) => {
  return http.delete("/drugs", {
    params: parameter,
  });
};

//修改接口
export const modifyDrug = (parameter) => {
  return http.put("/drugs", parameter);
};

//模糊查询
export const getLikeDrug = (parameter) => {
  return http.get("/drugs/like", {
    params: parameter,
  });
};

//按名字查询
export const getDrugByDrugsName = (parameter) => {
  return http.get("/drugs/name", {
    params: parameter,
  });
};

//增加
export const addDrug = (parameter) => {
  return http.post("/drugs", parameter);
};
