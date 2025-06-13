import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./trendPage.scss";

const TrendDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 임시 데이터 (실제로는 API 호출)
    const mockTrend = {
      id: parseInt(id),
      title: "AI 기술 동향 및 발전 방향",
      category: "AI",
      createDate: "2024-03-15",
      writer: "관리자",
      viewlog: "150",
      contents: `AI 기술의 최신 동향과 미래 발전 방향에 대한 분석

1. 현재 AI 기술 동향
- 딥러닝 기술의 발전
- 자연어 처리의 혁신
- 컴퓨터 비전의 발전

2. 미래 전망
- AI와 인간의 협업
- 윤리적 AI 개발
- 산업별 AI 적용 사례

3. 결론
AI 기술은 계속해서 발전하고 있으며, 우리의 일상과 비즈니스에 큰 영향을 미치고 있습니다.`,
      image: "/images/ai-trend.jpg",
    };

    setTrend(mockTrend);
    setLoading(false);
  }, [id]);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!trend) return <div className="error">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="trendPage">
      <div className="trendPageContainer">
        <div className="trendDetail">
          <div className="trendDetailHeader">
            <h1>{trend.title}</h1>
            <div className="trendDetailInfo">
              <span>작성자: {trend.writer}</span>
              <span>작성일: {trend.createDate}</span>
              <span>조회수: {trend.viewlog}</span>
              <span>카테고리: {trend.category}</span>
            </div>
          </div>

          <div className="trendDetailContent">
            {trend.image && (
              <div className="trendDetailImage">
                <img src={trend.image} alt={trend.title} />
              </div>
            )}
            <div className="trendDetailText">
              {trend.contents.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          <div className="trendDetailFooter">
            <button onClick={() => navigate("/ideaboard/trend")}>
              목록으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendDetail;
