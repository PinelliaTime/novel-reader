import { IAxiosRequestConfig, IXhrResponse } from '@/types/xhrTypes';
import { Toast } from 'antd-mobile';

import xhrInstance from './xhrInstance';

class XhrRequest {
  static instance: XhrRequest;

  static getInstance() {
    if (!this.instance) {
      this.instance = new XhrRequest();
    }
    return this.instance;
  }

  protected baseURL: string = 'http://106.15.233.185:8080/api/reader/book/';
  protected headers: object = { ContentType: 'application/json;charset=UTF-8' };

  private xhrMethod(args: IAxiosRequestConfig) {
    !args.baseURL && (args.baseURL = this.baseURL);
    !args.headers && (args.headers = this.headers);

    return new Promise<IXhrResponse>((resolve, reject) => {
      xhrInstance(args)
        .then((response) => {
          const resData = response.data;
          let value: IXhrResponse = {
            status: resData.status,
            data: resData.data,
            prompt: resData.desc
          };

          if (resData.status === 200 || resData.status === 4031) {
            resolve(value);
          } else {
            Toast.fail(resData.desc, 1.5);
            reject(value);
          }
        })
        .catch((error) => {
          if (error.exceptionType === 'system') {
            Toast.fail(error.prompt, 1.5);
            reject({ prompt: error.prompt });
          }
        });
    });
  }

  /**
   * GET类型的网络请求
   */
  get(args: IAxiosRequestConfig) {
    return this.xhrMethod({ ...args, method: 'GET' });
  }

  /**
   * POST类型的网络请求
   */
  post(args: IAxiosRequestConfig) {
    return this.xhrMethod({ ...args, method: 'POST' });
  }

  /**
   * PUT类型的网络请求
   */
  put(args: IAxiosRequestConfig) {
    return this.xhrMethod({ ...args, method: 'PUT' });
  }

  /**
   * DELETE类型的网络请求
   */
  delete(args: IAxiosRequestConfig) {
    return this.xhrMethod({ ...args, method: 'DELETE' });
  }
}

export default XhrRequest.getInstance();
