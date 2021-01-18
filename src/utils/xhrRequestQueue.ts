import { Canceler } from 'axios';
import { IXhrRequest, IAxiosRequestConfig } from '@/types/xhrTypes';

class XhrRequestQueue {
  constructor() {
    this.xhrRequestQueue = [];
    this.loadingCount = 0;
  }

  static instance: XhrRequestQueue;
  public xhrRequestQueue: Array<IXhrRequest>;
  public loadingCount: number;

  static getInstance() {
    if (!this.instance) {
      this.instance = new XhrRequestQueue();
    }
    return this.instance;
  }

  // 判断请求是否需要开启loading
  needOpenLoading = (request: IAxiosRequestConfig) => {
    return !request.withoutLoading && this.loadingCount === 0;
  };

  // 判断请求队列中需要开启loading的请求是否已经全部完成
  needCloseLoading = () => {
    if (this.xhrRequestQueue.length === 0) {
      return true;
    } else {
      return this.loadingCount === 0;
    }
  };

  // 清空loading队列
  clearLoadingCount = () => {
    this.loadingCount = 0;
  };

  // 判断请求是否完全相同
  isRequestEqual = (request: IAxiosRequestConfig, list: IXhrRequest) => {
    return (
      list.url === request.url &&
      list.method === request.method &&
      JSON.stringify(list.params) === JSON.stringify(request.params) &&
      JSON.stringify(list.data) === JSON.stringify(request.data)
    );
  };

  // 判断请求是否要加到请求队列
  needAddToXhrQueue = (request: IAxiosRequestConfig): boolean => {
    let flag: boolean = true;
    for (const key in this.xhrRequestQueue) {
      const item: IXhrRequest = this.xhrRequestQueue[key];
      if (this.isRequestEqual(request, item)) {
        flag = false;
      }
    }
    return flag;
  };

  // 将请求加入到请求队列中
  addToXhrQueue = (request: IAxiosRequestConfig, cancel: Canceler) => {
    if (!request.withoutLoading) {
      this.loadingCount += 1;
    }
    this.xhrRequestQueue.push({
      url: request.url,
      method: request.method,
      params: request.params,
      data: request.data,
      withoutLoading: request.withoutLoading,
      cancel
    });
  };

  // 将请求从请求队列中移除
  removeFromXhrQueue = (request: IAxiosRequestConfig) => {
    for (const key in this.xhrRequestQueue) {
      const item: IXhrRequest = this.xhrRequestQueue[key];
      if (this.isRequestEqual(request, item)) {
        // 从请求队列中移除请求
        this.xhrRequestQueue.splice(Number(key), 1);
        if (!item.withoutLoading && this.loadingCount > 0) {
          this.loadingCount -= 1;
        }
      }
    }
  };
}

export default XhrRequestQueue.getInstance();
