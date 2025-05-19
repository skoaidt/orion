import React, { useState, useEffect } from "react";
import "./connectCnt.scss";
import axios from "axios";

const ConnectCnt = () => {
  const [mauData, setMauData] = useState({
    totalCnt: 0, // 월 전체 활성 사용자 수
    thisWeek: 0, // 이번 주 활성 사용자 수
    lastWeek: 0, // 지난 주 활성 사용자 수
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMAUData = async () => {
      try {
        setLoading(true);
        // MAU 통계 데이터 가져오기
        const response = await axios.get("/api/analytics/mau-stats");
        setMauData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("MAU 데이터 가져오기 오류:", err);
        setError("MAU 데이터를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchMAUData();
  }, []);

  return (
    <div className="connectCnt">
      <div className="header">
        <span>접속자수</span>
        <span>(명)</span>
      </div>
      <div className="connectCntBox">
        <p>MAU</p>
        {loading ? (
          <div className="loading">데이터 로딩중...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="totalCnt">
              <p>
                {mauData.totalCnt
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
            </div>
            <div className="connectCntBoxItem">
              <div className="Week">
                <span>이번주</span>
                <span className="line"></span>
                <span>{mauData.thisWeek}</span>
              </div>
              <div className="Week">
                <span>저번주</span>
                <span className="line"></span>
                <span>{mauData.lastWeek}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectCnt;
