export interface IHttpConfig {
  method: string;
  url: string;
}

export interface IHeaderInfo {
  headers: object;
  timeout: number;
  method: any;
  url: string;
  params: object;
  data: object;
}
