import React from "react";
import "./sideBar.scss";

const SideBar = () => {
  return (
    <div className="sideBar">
      <div className="menuNm">아이디어 등록</div>
      <div className="menuNm">팀 구성</div>
      <div className="menuNm">Solution 등록</div>
      <div className="menuNm">진행률 관리</div>
      <div className="menuNm">과제 평가</div>
    </div>
  );
};

export default SideBar;
