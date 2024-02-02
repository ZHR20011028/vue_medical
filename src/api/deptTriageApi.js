import http from "@/utils/request";

//返回某科室分诊人数
export const getTriageCountByDeptId = (parameter) => {
  return http.get("/triages/count", {
    params: parameter,
  });
};

//返回分页信息
export const getTriagePageByDeptId = (deptId, pageNumber, pageSize) => {
  return http.get("/triages/page", {
    params: {
      deptId: deptId,
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
  });
};
