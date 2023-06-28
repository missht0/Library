import axios from "axios";
import { notification } from "antd";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { BrowserRouter } from "react-router-dom";
import errorCode from "./errorCode";
import Local from "@/utils/storage";
import { getCookie } from "@/utils";

if (!window.Promise) {
  window.Promise = Promise;
}

notification.config({
  maxCount: 1,
});

NProgress.configure({
  minimum: 0.1,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

// axios.defaults.baseURL = "http://127.0.0.1:8080";
axios.defaults.baseURL = "http://47.99.134.228:8080";

axios.interceptors.request.use(
  (config) => {
    NProgress.start();
    config.headers = {
      ...config.headers,
      Authorization: getCookie("userInfo"),
    };
    return config;
  },
  (err) => {
    NProgress.done();
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    NProgress.done();
    if (response.data.errorMsg) {
      notification.error({
        message: "错误",
        description: response.data.errorMsg,
      });
      return Promise.reject(response);
    } else {
      return response;
    }
  },
  (err) => {
    NProgress.done();
    if (err && err.response) {
      err.message = errorCode[err.response.status] || err.response.data.data || err.response.data.error || err.response.data.errorMsg;
    } else {
      err.message = "连接服务器失败!";
    }

    if (err.response.status === 502 || err.response.status === 504) {
      err.message = "平台网络无连接，请检查后重试!";
    }

    if (err.response.status === 401) {
      Local.removeLocal("token");
      const router = new BrowserRouter();
      router.history.replace("/login");
    } else if ("get" !== err.response.config?.method && err.response.status !== 500) {
      notification.error({
        message: "错误",
        description: err.message,
      });
    }

    return Promise.reject(err);
  }
);

/**
 * _get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} option [请求配置]
 * @param {String} method [请求方法]
 */
function _get(url, params = {}, option = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    const { restUrl, data } = restfulAPI(url, params, method);
    let options = {
      url: restUrl,
      params: data,
      method,
      ...option,
    };
    axios(options)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

function _delete(url, params = {}, option = {}) {
  return _get(url, params, option, "DELETE");
}

/**
 * _post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} option [请求配置]
 * @param {String} method [请求方法]
 */
function _post(url, params = {}, option = {}, method = "POST") {
  return new Promise((resolve, reject) => {
    const { restUrl, data } = restfulAPI(url, params, method);
    let options = {
      url: restUrl,
      data: data,
      method,
      headers: {
        // "Content-Type": "application/json;charset=UTF-8",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      ...option,
    };
    console.log("post", options);
    axios(options)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

function _put(url, params = {}, option = {}) {
  return _post(url, params, option, "PUT");
}

const restfulAPI = function (url, formData, method) {
  const newFormData = Array.isArray(formData) ? [...formData] : { ...formData };
  if (!url) throw new Error("url不能为空");
  if (url.indexOf("{") === -1 || !formData) return { restUrl: url, data: newFormData };
  let restfulArray = url.split("/");
  const result = restfulArray.map((item) => {
    if (item.indexOf("{") !== -1) {
      const key = item.substring(1, item.length - 1);
      delete newFormData[key];
      if (Array.isArray(formData)) {
        return formData[0][key] || "";
      } else {
        return formData[key] || "";
      }
    }
    return item;
  });

  return { restUrl: result.join("/"), data: newFormData };
};

export default {
  get: _get,
  delete: _delete,
  post: _post,
  put: _put,
  restfulAPI: restfulAPI,
};
