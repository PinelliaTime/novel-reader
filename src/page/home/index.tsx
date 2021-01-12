import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast } from 'antd-mobile';

import HttpList from '@/service/httpList';
import SvgMode from '@/component/SvgMode';

import './index.scss';

interface IBook {
  author: string;
  bookCover: string;
  bookId: number;
  bookName: string;
  chapterCount: number;
  description: string;
  wordCount: string;
  completeStatus: number;
}

export default function Home() {
  const history: any = useHistory();

  const [data, setData] = useState(() => []);

  useEffect(() => {
    document.title = '林区';
    async function fetchData() {
      Toast.loading('数据请求中...', 30);
      const info = await HttpList.queryBooks({});
      Toast.hide();
      setData(info?.resultList || []);
    }
    fetchData();
  }, []);

  const onBookClick = useCallback(
    (bookInfo: IBook) => {
      history.push({
        pathname: `detail/${bookInfo.bookId}`,
        state: { bookInfo }
      });
    },
    [history]
  );

  const onUserInfoClick = useCallback(() => {
    history.push('login');
  }, [history]);

  return (
    <div>
      <div className="home-header">
        <span>林区</span>
        <div className="home-header-svg">
          <div onClick={onUserInfoClick}>
            <SvgMode name="mine" color="#ed424b" />
          </div>
          <div>
            <SvgMode name="bookshelf" color="#ed424b" />
          </div>
        </div>
      </div>
      {data.map((item: IBook) => (
        <div
          key={item.bookId}
          className="book"
          onClick={() => onBookClick(item)}
        >
          <div className="book-left">
            <img
              src={`http://106.15.233.185:8983/${item.bookCover}`}
              alt="图片"
            />
          </div>
          <div className="book-right">
            <h4 className="book-right-name">{item.bookName}</h4>
            <div className="book-right-desc">
              <div className="book-right-desc-msg">{item.description}</div>
            </div>
            <div className="book-right-info">
              <span className="book-right-info-author">{item.author}</span>
              <div className="book-right-info-right">
                <span>{item.completeStatus ? '完本' : '连载中'}</span>
                <span>{item.wordCount}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
