import { httpRequest } from './httpApi';

const HttpList = {
  queryBooks: (params: object | undefined) =>
    httpRequest({ method: 'GET', url: 'queryBooks' }, params),
  queryCatalog: (params: object | undefined) =>
    httpRequest({ method: 'GET', url: 'queryCatalog' }, params),
  queryChapter: (params: object | undefined) =>
    httpRequest({ method: 'GET', url: 'queryChapter' }, params)
};

export default HttpList;
