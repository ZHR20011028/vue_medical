import http from "@/utils/request";

//分页查询
export const getPageFile = (parameter) => {
  return http.get("/files/page", {
    params: parameter,
  });
};

//模糊查询
export const getLikeFile = (parameter) => {
  return http.get("/files/like", {
    params: parameter,
  });
};

//按id查询
export const getFileByFileId = (parameter) => {
  return http.get("/files/id", {
    params: parameter,
  });
};

//下载文件
export const download = (parameter) => {
  return http.get("/files/download", {
    params: parameter,
  });
};

//删除文件
export const removeFile = (parameter) => {
  return http.delete("/files", {
    params: parameter,
  });
};
