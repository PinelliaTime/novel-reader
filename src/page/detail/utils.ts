interface IReadInfo {
  bookId: number | string;
  chapterIndex: number;
  scrollHeight: number;
}

// 将当前的阅读信息存入localStorage
export function setReadInfoToLocal(bookId: string, readInfo: IReadInfo) {
  localStorage.setItem(bookId, JSON.stringify(readInfo));
}

// 从localStorage中读取当前的阅读信息
export function getReadInfoFromLocal(bookId: string) {
  const localInfo: string | null = localStorage.getItem(bookId);

  if (localInfo !== null) {
    let bookInfo: IReadInfo = JSON.parse(localInfo);
    return bookInfo;
  } else {
    return localInfo;
  }
}

interface IReadSetting {
  pageBackgroundColor: string;
  fontSize: number;
  fontColor: string;
  isNight: boolean;
}

export const defaultReadSetting = {
  pageBackgroundColor: '#F8F0EB',
  fontSize: 16,
  fontColor: '#333',
  isNight: false
};

// 将当前的阅读设置存入localStorage
export function setReadSettingToLocal(readSetting: IReadSetting) {
  const readSettingStr = JSON.stringify(readSetting);
  localStorage.setItem('READ_SETTING', readSettingStr);
}

// 从localStorage中读取当前的阅读设置
export function getReadSettingFromLocal() {
  const readSetting = localStorage.getItem('READ_SETTING');

  if (readSetting) {
    return JSON.parse(readSetting);
  }
  return defaultReadSetting;
}
