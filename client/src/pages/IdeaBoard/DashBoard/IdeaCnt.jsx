import React, { useState, useEffect } from "react";
import "./ideaCnt.scss";
import CreateIcon from "@mui/icons-material/Create";
import WebhookIcon from "@mui/icons-material/Webhook";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const IdeaCnt = () => {
  const [counts, setCounts] = useState({
    totalCnt: 0,
    registerCnt: 0,
    developing: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdeaCounts = async () => {
      try {
        setLoading(true);

        // IdeaTable.jsx와 동일한 API 호출
        const response = await axios.get("/api/ideas");

        // 전체 등록건수
        const totalCount = response.data.length;

        // 등록 상태 카운트 (등록, 선정, pilot, 검증, 개발심의, DROP)
        const registerCount = response.data.filter((idea) =>
          ["등록", "선정", "pilot", "검증", "개발심의", "Drop"].includes(
            idea.status
          )
        ).length;

        // 개발중 상태 카운트
        const developingCount = response.data.filter(
          (idea) => idea.status === "개발중" || idea.status === "developing"
        ).length;

        // 완료 상태 카운트
        const completedCount = response.data.filter(
          (idea) =>
            idea.status === "완료" ||
            idea.status === "completed" ||
            idea.status === "개발완료" ||
            idea.status === "developmentCompleted"
        ).length;

        setCounts({
          totalCnt: totalCount,
          registerCnt: registerCount,
          developing: developingCount,
          completed: completedCount,
        });

        setLoading(false);
      } catch (err) {
        console.error("아이디어 카운트 데이터를 가져오는 중 오류 발생:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchIdeaCounts();
  }, []);

  // 숫자 포맷팅 함수 (천 단위 콤마)
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return (
      <div className="ideaCnt">
        <div className="loading-container">
          <CircularProgress size={24} />
          <span>데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ideaCnt">
        <div className="error-message">
          데이터를 불러오는 중 오류가 발생했습니다: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="ideaCnt">
      <div className="header">
        <span>IDEA 등록</span>
        <span>기준 : {new Date().getFullYear()}년 누적</span>
      </div>
      <div className="totalCnt">
        <div className="totalCntTitle">총 등록건수</div>
        <p>{formatNumber(counts.totalCnt)}</p>
      </div>
      <div className="ideaCntBox">
        <div className="box regBox">
          <div className="boxHeader">
            <div className="iconCircle">
              <CreateIcon />
            </div>
            <p>등록</p>
          </div>
          <div className="boxContent">
            <p>{formatNumber(counts.registerCnt)}건</p>
          </div>
        </div>
        <div className="box devBox">
          <div className="boxHeader">
            <div className="iconCircle">
              <WebhookIcon />
            </div>
            <p>개발중</p>
          </div>
          <div className="boxContent">
            <p>{formatNumber(counts.developing)}건</p>
          </div>
        </div>
        <div className="box compBox">
          <div className="boxHeader">
            <div className="iconCircle">
              <MilitaryTechIcon />
            </div>
            <p>완료</p>
          </div>
          <div className="boxContent">
            <p>{formatNumber(counts.completed)}건</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCnt;
