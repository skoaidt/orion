import React from "react";
import "./sideBar.scss";
import { Link, useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();

  // 시스템 활용률 링크 클릭 핸들러
  const handleStatsClick = (e) => {
    e.preventDefault();
    console.log("시스템 활용률 링크 클릭됨");
    console.log("이동 경로: /ideaboard/devstats");
    // 직접 경로 이동
    navigate("/ideaboard/devstats");
  };

  return (
    <div className="sideBar">
      <div className="topMenus">
        <Link to="/">
          <div className="logo">Orion</div>
        </Link>

        <hr
          style={{
            width: "70%",
            border: "1px solid #8c8c8c",
          }}
        />
        <Link to="/dashboard">
          <div className="menuNm">Dashboard</div>
        </Link>
        <Link to="/ideaboard">
          <div className="menuNm">IDEA 등록</div>
        </Link>
        <Link to="/ideaboard/devtable">
          <div className="menuNm">개발 관리</div>
        </Link>
      </div>

      <div className="bottomMenus">
        <Link to="/ideaboard/devstats" onClick={handleStatsClick}>
          <div className="menuNm">
            System
            <br />
            활용률
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
