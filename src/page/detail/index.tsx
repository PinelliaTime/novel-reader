import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Toast } from 'antd-mobile';

import SvgMode from '@/component/SvgMode';
import { isEmpty } from '@/utils/universal';
import { httpQueryCatalog, httpQueryChapter } from '@/service/bookQuery';

import './index.scss';
import {
  defaultReadSetting,
  getReadInfoFromLocal,
  getReadSettingFromLocal,
  setReadInfoToLocal,
  setReadSettingToLocal
} from './utils';
import SetMode from './SetMode';

interface IBookContent {
  bookId: number;
  chapterTitle: string;
  chapterContent: string;
  chapterIndex: number;
}

interface IParams {
  bookId: string;
}

const ColorArray = ['#F8F1EB', '#E0CEBA', '#DEDFBD', '#F5DACF', '#D1B995'];

function Detail(props: any) {
  const { bookId } = useParams<IParams>();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const catalogRef = useRef<HTMLDivElement | null>(null);

  // 阅读设置
  const [readSetting, setReadSetting] = useState(() => {
    return defaultReadSetting;
  });
  // 章节内容
  const [bookContent, setBookContent] = useState<Partial<IBookContent>>({});
  // 页面设置是否显示
  const [maskVisible, setMaskVisible] = useState(false);
  // 阅读设置是否显示
  const [readVisible, setReadVisible] = useState(false);
  // 章节目录
  const [catalog, setCatalog] = useState(() => []);
  // 章节目录是否显示
  const [catalogVisible, setCatalogVisible] = useState(false);
  // 进度是否显示
  const [scheduleVisible, setScheduleVisible] = useState(false);

  // 查询章节目录
  const fetchCatalog = useCallback((book_id: string) => {
    (async () => {
      try {
        const { data = [] } = await httpQueryCatalog({ book_id });
        setCatalog(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // 查询章节内容
  const queryChapter = useCallback(
    (bookId: string, chapterIndex: number, scrollHeight?: number) => {
      (async () => {
        try {
          const { data = {} } = await httpQueryChapter({
            book_id: bookId,
            chapter_index: chapterIndex
          });
          setReadInfoToLocal(bookId, {
            bookId,
            chapterIndex,
            scrollHeight: scrollHeight || 0
          });
          if (data) {
            document.title = data.bookName;
            setBookContent(data);
          }
          if (scrollHeight) {
            setTimeout(() => {
              window.scrollTo(0, scrollHeight);
            }, 16);
          } else {
            window.scrollTo(0, 0);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    },
    []
  );

  useEffect(() => {
    const localReadInfo = getReadInfoFromLocal(bookId);

    const localReadSettig = getReadSettingFromLocal();
    setReadSetting(localReadSettig);

    if (localReadInfo) {
      const { chapterIndex, scrollHeight } = localReadInfo;
      queryChapter(bookId, chapterIndex, scrollHeight);
    } else {
      queryChapter(bookId, 1);
    }
    setTimeout(() => {
      fetchCatalog(bookId);
    }, 400);
  }, [fetchCatalog, queryChapter, bookId]);

  // body滚动时关闭所有的mask
  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.onscroll = () => {
        if (maskVisible) {
          setMaskVisible(false);
        }
      };
    }
  }, [maskVisible]);

  // 滚动是记录滚动距离
  useEffect(() => {
    const saveScroll = () => {
      const localReadInfo = getReadInfoFromLocal(bookId);
      let scrollHeight = document.documentElement.scrollTop;
      if (scrollHeight > 0) {
        setReadInfoToLocal(bookId, {
          bookId,
          chapterIndex: localReadInfo ? localReadInfo.chapterIndex : 1,
          scrollHeight
        });
      }
    };

    window.addEventListener('scroll', saveScroll, true);

    return () => window.removeEventListener('scroll', saveScroll, true);
  }, [bookId]);

  // 唤起章节目录后禁止body滚动
  useEffect(() => {
    const body = document.querySelector('body');
    const localReadInfo = getReadInfoFromLocal(bookId);
    let chapterIndex = localReadInfo?.chapterIndex || 1;
    if (body) {
      if (catalogVisible) {
        body.style.overflow = 'hidden';
        catalogRef.current?.scrollTo(0, (chapterIndex - 1) * 45);
      } else {
        body.style.overflow = 'scroll';
      }
    }
  }, [bookId, catalogVisible]);

  // 返回书城
  const goBackBookCity = useCallback(() => {
    props.history.goBack();
  }, [props.history]);

  // 唤起/关闭 设置蒙板
  const onContentClick = useCallback(() => {
    setMaskVisible(!maskVisible);
    setReadVisible(false);
    setScheduleVisible(false);
  }, [maskVisible]);

  // 唤起/关闭 阅读设置
  const onReadSetClick = useCallback(() => {
    setScheduleVisible(false);
    setReadVisible(!readVisible);
  }, [readVisible]);

  // 字体 加
  const onFontAddClick = useCallback(() => {
    const localReadSettig = getReadSettingFromLocal();
    if (localReadSettig.fontSize < 25) {
      let newReadSetting = {
        ...localReadSettig,
        fontSize: localReadSettig.fontSize + 1
      };
      setReadSettingToLocal(newReadSetting);
      setReadSetting(newReadSetting);
    }
  }, []);

  // 字体 减
  const onFontDownClick = useCallback(() => {
    const localReadSettig = getReadSettingFromLocal();
    if (localReadSettig.fontSize > 14) {
      let newReadSetting = {
        ...localReadSettig,
        fontSize: localReadSettig.fontSize - 1
      };
      setReadSettingToLocal(newReadSetting);
      setReadSetting(newReadSetting);
    }
  }, []);

  // 背景色
  const onBackgroundColorClick = useCallback((color: string) => {
    const localReadSettig = getReadSettingFromLocal();
    let newReadSetting = {
      ...localReadSettig,
      pageBackgroundColor: color
    };
    setReadSettingToLocal(newReadSetting);
    setReadSetting(newReadSetting);
  }, []);

  // 上一章 点击事件
  const onPrevPageClick = useCallback(() => {
    const localReadInfo = getReadInfoFromLocal(bookId);
    if (localReadInfo && localReadInfo.chapterIndex > 1) {
      queryChapter(bookId, localReadInfo.chapterIndex - 1);
    } else {
      Toast.info('已经是第一章啦！', 1);
    }
  }, [bookId, queryChapter]);

  // 下一章 点击事件
  const onNextPageClick = useCallback(() => {
    const localReadInfo = getReadInfoFromLocal(bookId);
    if (localReadInfo && localReadInfo.chapterIndex < catalog.length) {
      queryChapter(bookId, localReadInfo.chapterIndex + 1);
    } else {
      Toast.info('已经是最后一章啦！', 1);
    }
  }, [bookId, catalog, queryChapter]);

  // 指定章节点击事件
  const onSpecifyPageClick = useCallback(
    (item) => {
      queryChapter(bookId, item.chapterIndex);
      setCatalogVisible(false);
      setReadVisible(false);
      setMaskVisible(false);
      setScheduleVisible(false);
    },
    [bookId, queryChapter]
  );

  // 唤起/关闭 章节目录
  const onCatalogClick = useCallback(() => {
    setCatalogVisible(!catalogVisible);
  }, [catalogVisible]);

  // 唤起/关闭 进度
  const onScheduleClick = useCallback(() => {
    setReadVisible(false);
    setScheduleVisible(!scheduleVisible);
  }, [scheduleVisible]);

  // 日间/夜间 切换
  const onNightOrDayClick = useCallback(() => {
    const localReadSettig = getReadSettingFromLocal();
    let newReadSetting = { ...localReadSettig };
    if (localReadSettig.isNight) {
      newReadSetting = {
        ...newReadSetting,
        isNight: false,
        fontColor: '#333'
      };
    } else {
      newReadSetting = { ...newReadSetting, isNight: true, fontColor: '#666' };
    }
    setReadSettingToLocal(newReadSetting);
    setReadSetting(newReadSetting);
  }, []);

  return (
    <div
      style={{
        backgroundColor: readSetting.isNight
          ? '#111'
          : readSetting.pageBackgroundColor
      }}
      className="book-detail"
    >
      <div
        className="book-detail-title"
        style={{
          backgroundColor: readSetting.isNight
            ? '#111'
            : readSetting.pageBackgroundColor,
          color: readSetting.fontColor
        }}
      >
        {bookContent.chapterTitle || ''}
      </div>
      <h2 style={{ color: readSetting.fontColor }}>
        {bookContent.chapterTitle || ''}
      </h2>
      <div
        ref={scrollRef}
        className="book-detail-content"
        style={{ fontSize: readSetting.fontSize, color: readSetting.fontColor }}
        dangerouslySetInnerHTML={{ __html: bookContent.chapterContent || '' }}
        onClick={onContentClick}
      />
      {!isEmpty(bookContent) && (
        <div
          style={{ color: readSetting.fontColor }}
          className="book-detail-footer"
        >
          <span onClick={onPrevPageClick}>上一章</span>
          <span onClick={onNextPageClick}>下一章</span>
        </div>
      )}
      <div
        style={{ visibility: maskVisible ? 'visible' : 'hidden' }}
        className="book-detail-mask"
      >
        <div className="book-detail-mask-header">
          <div onClick={goBackBookCity}>
            <SvgMode name="back" color="#fff" />
            返回书城
          </div>
        </div>
        <div className="book-detail-mask-empty" onClick={onContentClick} />
        <div className="book-detail-mask-footer">
          {readVisible && (
            <div className="book-detail-mask-footer-read">
              <div className="book-detail-mask-footer-read-font">
                <div
                  className="book-detail-mask-footer-read-font-down"
                  onClick={onFontDownClick}
                >
                  <SvgMode width={20} height={20} name="reduce" color="#fff" />
                </div>
                <div className="book-detail-mask-footer-read-font-size">
                  {readSetting.fontSize}
                </div>
                <div
                  className="book-detail-mask-footer-read-font-add"
                  onClick={onFontAddClick}
                >
                  <SvgMode width={20} height={20} name="plus" color="#fff" />
                </div>
              </div>
              <div className="book-detail-mask-footer-read-bgc">
                {ColorArray.map((color, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: color,
                        borderColor:
                          readSetting.pageBackgroundColor === color
                            ? '#aaa'
                            : 'transparent'
                      }}
                      onClick={() => onBackgroundColorClick(color)}
                    />
                  );
                })}
              </div>
            </div>
          )}
          {scheduleVisible && (
            <div className="book-detail-mask-footer-page">
              <div onClick={onPrevPageClick}>上一章</div>
              <div style={{ flex: 1 }}>
                当前进度：
                {bookContent && bookContent.chapterIndex && !isEmpty(catalog)
                  ? (bookContent.chapterIndex / catalog.length).toFixed(4) +
                    ' %'
                  : '0 %'}
              </div>
              <div onClick={onNextPageClick}>下一章</div>
            </div>
          )}
          <div className="book-detail-mask-footer-set">
            <SetMode
              name="catalog"
              color="#fff"
              title="目录"
              onClick={onCatalogClick}
            />
            <SetMode
              name="schedule"
              color="#fff"
              title="进度"
              onClick={onScheduleClick}
            />
            <SetMode
              name="site"
              color="#fff"
              title="设置"
              onClick={onReadSetClick}
            />
            <SetMode
              name={readSetting.isNight ? 'day' : 'night'}
              color="#fff"
              title={readSetting.isNight ? '日间' : '夜间'}
              onClick={onNightOrDayClick}
            />
          </div>
        </div>
      </div>
      <div
        style={{ visibility: catalogVisible ? 'visible' : 'hidden' }}
        className="book-detail-catalog"
      >
        <div className="book-detail-catalog-section">
          <div className="book-detail-catalog-section-header">目录</div>
          <div ref={catalogRef} className="book-detail-catalog-section-scroll">
            {catalog.map((item: any) => {
              let checked = item.chapterIndex === bookContent.chapterIndex;
              return (
                <div
                  key={item.chapterIndex}
                  style={{
                    color: checked ? '#ed424b' : '#33373d'
                  }}
                  onClick={() => onSpecifyPageClick(item)}
                >
                  {item.chapterTitle}
                </div>
              );
            })}
          </div>
        </div>
        <div className="book-detail-catalog-empty" onClick={onCatalogClick} />
      </div>
    </div>
  );
}

export default Detail;
