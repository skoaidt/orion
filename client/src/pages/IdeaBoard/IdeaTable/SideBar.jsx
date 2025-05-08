import React from "react";
import "./sideBar.scss";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="sideBar">
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
        <div className="menuNm">Dev. 관리</div>
      </Link>
    </div>
  );
};

export default SideBar;
