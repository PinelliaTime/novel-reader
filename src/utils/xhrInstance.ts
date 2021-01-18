import axios from 'axios';
import { Toast } from 'antd-mobile';

import { IAxiosRequestConfig } from '@/types/xhrTypes';
import xhrRequestQueue from './xhrRequestQueue';

const {
  needAddToXhrQueue,
  needOpenLoading,
  needCloseLoading,
  addToXhrQueue,
  removeFromXhrQueue
} = xhrRequestQueue;

// 取消重复请求
const CancelToken = axios.CancelToken;
// axios 实例
const xhrInstance = axios.create({
  timeout: 30000,
  responseType: 'json'
});

// 添加请求拦截器
xhrInstance.interceptors.request.use(
  (request: IAxiosRequestConfig) => {
    const flag = needAddToXhrQueue(request);
    const needLoad = needOpenLoading(request);

    if (flag) {
      request.cancelToken = new CancelToken((c) => {
        addToXhrQueue(request, c);
      });
      if (needLoad) {
        Toast.loading(request.loadingMessage || '数据请求中...');
      }

      return request;
    } else {
      return Promise.reject(request);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
xhrInstance.interceptors.response.use(
  (response) => {
    removeFromXhrQueue(response.config);
    const needClose = needCloseLoading();

    if (needClose) {
      Toast.hide();
    }

    if (response.status === 200) {
      return response;
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    removeFromXhrQueue(error.config || error);
    Toast.hide();

    // “取消请求” 不需要进行错误处理
    if (axios.isCancel(error) || !error.config) {
      return Promise.reject(error);
    }

    // 根据返回的http状态码做不同的处理
    switch (error?.response?.status) {
      case 400:
        error.prompt = '请求参数错误！';
        break;
      case 401:
        error.prompt = '服务端无法识别！';
        break;
      case 403:
        error.prompt = '没有访问权限！';
        break;
      case 404:
        error.prompt = '请求的资源不存在！';
        break;
      case 405:
        error.prompt = '请求方法错误！';
        break;
      case 500:
        error.prompt = '服务器错误，请稍后重试！';
        break;
      case 503:
        error.prompt = '服务器正在维护，请稍后重试！';
        break;
      default:
        error.prompt = '系统异常！';
        break;
    }
    error.exceptionType = 'system';

    return Promise.reject(error);
  }
);

export default xhrInstance;
