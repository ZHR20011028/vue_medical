import axios from "axios";
import router from "@/router";

const http = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000, //超时时间
});

//添加请求拦截器
http.interceptors.request.use(
  function (config) {
    //请求前做什么
    return config;
  },
  function (error) {
    //请求失败做什么
    return Promise.reject(error);
  }
);

//添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // 请求错误时做些事
    let status = "";
    if (error.request) {
      status = error.request.status;
    } else if (error.response) {
      status = error.response.status;
    }

    if (status) {
      switch (status.status) {
        case 400:
          error.message = "请求错误(400)";
          break;
        case 401:
          error.message = "未授权，请重新登录(401)";
          router.push("/401");
          break;
        case 403:
          error.message = "拒绝访问(403)";
          break;
        case 404:
          error.message = "请求出错(404)";
          router.push("/404");
          break;
        case 408:
          error.message = "请求超时(408)";
          break;
        case 500:
          error.message = "服务器错误(500)";
          router.push("/500");
          break;
        case 501:
          error.message = "服务未实现(501)";
          break;
        case 502:
          error.message = "网络错误(502)";
          break;
        case 503:
          error.message = "服务不可用(503)";
          break;
        case 504:
          error.message = "网络超时(504)";
          break;
        case 505:
          error.message = "HTTP版本不受支持(505)";
          break;
        default:
          error.message = `连接出错(${error.response.status})!`;
      }
    } else {
      router.push("/404");
    }
    return Promise.reject(error);
  }
);

export default http;
