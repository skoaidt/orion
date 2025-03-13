import React from "react";
import "./sideBar.scss";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="sideBar">
      <Link to="/">
        <div className="logo">Orion</div>
      </Link>
      <div className="menuNm">Dashboard</div>
      <div className="menuNm">IDEA 등록</div>
      <div className="menuNm">Project 관리</div>
    </div>
  );
};

export default SideBar;
