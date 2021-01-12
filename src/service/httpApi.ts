import axios from 'axios';
import { Toast } from 'antd-mobile';

import { isEmpty } from '@/utils/universal';
import { IHeaderInfo, IHttpConfig } from './interface';

axios.defaults.baseURL = 'http://106.15.233.185:8080/api/reader/book/';

// 请求列表
const requestList: Array<string> = [];
// 取消列表
const CancelToken = axios.CancelToken;
let sources: any = {};

// axios请求拦截器
axios.interceptors.request.use(
  (config) => {
    const request = JSON.stringify(config.url) + JSON.stringify(config.data);
    config.cancelToken = new CancelToken((cancel) => {
      sources[request] = cancel;
    });
    // 判断请求是否已存在请求列表，避免重复请求，将当前请求添加进请求列表数组；
    if (requestList.includes(request)) {
      sources[request]('取消重复请求');
      requestList.splice(
        requestList.findIndex((item) => item === request),
        1
      );
      requestList.push(request);
    } else {
      requestList.push(request);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axios响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 将当前请求中请求列表中删除
    const request: string =
      JSON.stringify(response.config.url) +
      JSON.stringify(response.config.data);
    requestList.splice(
      requestList.findIndex((item: string) => item === request),
      1
    );

    return response.data;
  },
  (error) => {
    requestList.splice(0, requestList.length);
    if (axios.isCancel(error)) {
      console.log(new axios.Cancel('请求已取消！'));
    } else if (error.message.includes('Network')) {
      // 无法连接网络
      return Promise.reject(new Error('网络异常，请稍后重试！'));
    } else if (
      error.message.includes('timeout') ||
      error.message.includes('网络请求超时')
    ) {
      // 超时
      return Promise.reject(new Error('网络超时，请稍后重试！'));
    } else if (error.response) {
      let statusErrorMsg = '';
      // http状态码判断
      switch (error.response.status) {
        case 400:
          statusErrorMsg = '请求参数错误！';
          break;
        case 401:
          statusErrorMsg = '服务端无法识别！';
          break;
        case 403:
          statusErrorMsg = '没有访问权限！';
          break;
        case 404:
          statusErrorMsg = '请求的资源不存在！';
          break;
        case 405:
          statusErrorMsg = '请求方法错误！';
          break;
        case 500:
          statusErrorMsg = '服务器错误，请稍后重试！';
          break;
        case 503:
          statusErrorMsg = '服务器正在维护，请稍后重试！';
          break;
        default:
          statusErrorMsg = '请求出错了！';
          break;
      }
      return Promise.reject(new Error(statusErrorMsg));
    } else {
      return Promise.reject(error);
    }
  }
);

// axios请求
const request = (httpConfig: IHttpConfig, params = {}) => {
  const { method, url } = httpConfig;
  let headerInfo: Partial<IHeaderInfo> = {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
    method: method.toUpperCase(),
    url
  };

  if (method === 'GET' && !isEmpty(params)) {
    headerInfo.params = params;
  } else {
    headerInfo.data = params;
  }

  return axios(headerInfo)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
};

// 数据处理
const httpRequest = async (
  httpConfig: IHttpConfig,
  params: object | undefined
) => {
  try {
    const info = await request(httpConfig, params);
    if (info.status === 200) {
      return info.data;
    } else {
      Toast.fail(info.message);
    }
  } catch (error) {
    Toast.fail('系统异常！');
  }
};

export { sources, httpRequest };
