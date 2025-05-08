import React, { useEffect } from "react";
import "./DevStats.scss";
import GitHubIcon from "@mui/icons-material/GitHub";

const DevStats = () => {
  // 컴포넌트 마운트 시 로그 출력
  useEffect(() => {
    console.log("DevStats 컴포넌트가 렌더링되었습니다.");
  }, []);

  // 이미지 로드 오류 처리
  const handleImageError = (e) => {
    console.log("이미지 로드 실패, 플레이스홀더 표시");
    e.target.style.display = "none";
    const placeholder = document.querySelector(".image-placeholder");
    if (placeholder) {
      placeholder.style.display = "block";
    }
  };

  return (
    <div className="devStats">
      {/* IdeaTable 스타일의 타이틀 헤더 */}
      <div className="titleHeader">
        <GitHubIcon style={{ fontSize: "30px", color: "#565656" }} />
        <h1>System 활용률</h1>
      </div>

      {/* 헤더 행 */}
      <div className="headerRow">
        <span>시스템 활용률 현황 그래프입니다</span>
      </div>

      {/* 이미지 표시 영역 */}
      <div className="image-container">
        {/* 이 부분에 실제 이미지 파일 경로를 지정하세요 */}
        <img
          src="/images/system-usage-chart.png"
          alt="System 활용률 차트"
          className="system-usage-image"
          onError={handleImageError}
        />
        <div className="image-placeholder">
          <p>System 활용률 차트가 이곳에 표시됩니다.</p>
          <p>
            실제 이미지 파일을 '/images/system-usage-chart.png' 경로에
            업로드하시거나 경로를 수정해주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevStats;
