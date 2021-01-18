import { AxiosRequestConfig, Method } from 'axios';

export interface IXhrRequest {
  url?: string;
  method?: Method;
  params: any;
  data: any;
  withoutLoading?: boolean | undefined;
  cancel: Function;
}

export interface IAxiosRequestConfig extends AxiosRequestConfig {
  withoutLoading?: boolean | undefined;
  loadingMessage?: string | undefined;
}

export interface IXhrResponse {
  status?: number;
  data?: any;
  prompt: string;
}
