import xhrRequest from '@/utils/xhrRequest';

// 查询书籍
export function httpQueryBooks() {
  return xhrRequest.get({ url: 'queryBooks' });
}

// 查询章节目录
export function httpQueryCatalog(params: { book_id: string }) {
  return xhrRequest.get({ url: 'queryCatalog', params, withoutLoading: true });
}

// 查询章节内容
export function httpQueryChapter(params: {
  book_id: string | number;
  chapter_index: number;
}) {
  return xhrRequest.get({ url: 'queryChapter', params });
}
