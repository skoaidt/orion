import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import "./ideaNavbar.scss"; // SCSS 파일 import
import axios from "axios";

const IdeaNavbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdeaCounts = async () => {
      const response = await axios.get("/api/ideas");
      setCount(response.data.length);
    };
    fetchIdeaCounts();
  }, []);

  return (
    <div className="ideaNavbar">
      <div className="controls">
        <div className="noti">
          <NotificationsNoneOutlinedIcon />
          <div className="notiNum">{count}</div>
        </div>

        <div className="notiDetail">
          <div className="header">이번주 신규 과제</div>
          <div className="content">
            <div className="item">
              <div className="name">전다현</div>
              <div className="team">선유기획팀</div>
              <div className="title">정량화 실적관리 자동화 구현(대시보드)</div>
              <div className="dday">1일전</div>
            </div>
          </div>
        </div>
        <div className="person">
          <AccountCircleIcon />
        </div>
      </div>
    </div>
  );
};

export default IdeaNavbar;
