import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MockData } from './Mockup';
import { getMockData  } from './api/getMockupData';

const App: React.FC = () => {
  const [dataList, setDataList] = useState<MockData[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 데이터 가져오는 함수
  const fetchMockData = async () => {
    console.log("가져오기");
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    const { datas, isEnd } = await getMockData(page);
    setDataList((prevData) => [...prevData, ...datas]);
    setPage((prevPage) => prevPage + 1);
    setHasMore(!isEnd);

    setIsLoading(false);
  }

  const lastElementCallback = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMockData();
      }
    });

    if (node) {
      observerRef.current.observe(node);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    fetchMockData();
  }, []);

  return (
    <>
        <div>
          <h1
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              margin: 0,
              backgroundColor: '#fff',
              padding: '20px',
              boxShadow: '0 2px 5px rbga(0,0,0,.1)',
              zIndex: 999,
              textAlign: 'center',
            }}
          >{dataList.reduce((prev, next) => prev + next.price, 0)} USD</h1>
          <div style={{ marginTop: '80px', padding: '10px' }}>
            {dataList.map((data, index) => {
              if (index === dataList.length - 1) {
                return (
                  <div
                    ref={lastElementCallback}
                    key={data.productId}
                    style={{ border: '1px solid #ccc', margin: '8px', padding: '16px' }}
                  >
                    <p>
                      Product Name: {data.productName}
                    </p>
                    <p>
                      Price: {data.price} USD
                    </p>
                    <p>
                      Bought Date: {data.boughtDate}
                    </p>
                  </div>
                );
              }
              else {
                return (
                  <div
                  key={data.productId}
                  style={{ border: '1px solid #ccc', margin: '8px', padding: '16px' }}
                >
                  <p>
                    Product Name: {data.productName}
                  </p>
                  <p>
                    Price: {data.price} USD
                  </p>
                  <p>
                    Bought Date: {data.boughtDate}
                  </p>
                </div>
                );
              }
            })}
          </div>
          {isLoading && <h4 style={{ textAlign: 'center' }}>Loading...</h4>}
          {!hasMore && <p style={{ textAlign: 'center' }}>더이상 가져올 데이터가 없습니다.</p>}
        </div>
    </>
  )
}

export default App
