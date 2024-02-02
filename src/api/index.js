import http from "@/utils/request";

// 返回值班数据
export const getAllWork = () => {
  return http.get("/doctorWorkDepts");
};

//返回通知
export const getAllNotice = ()=>{
  return http.get("/notices")
}


