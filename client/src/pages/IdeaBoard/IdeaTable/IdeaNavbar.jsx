import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import "./ideaNavbar.scss"; // SCSS 파일 import
import axios from "axios";

const IdeaNavbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [showNotiDetail, setShowNotiDetail] = useState(false);
  const [activeNotiIcon, setActiveNotiIcon] = useState(false);
  const [showPersonDetail, setShowPersonDetail] = useState(false);
  const notiDetailRef = useRef(null);
  const notiIconRef = useRef(null);
  const personDetailRef = useRef(null);
  const personIconRef = useRef(null);
  const navigate = useNavigate();

  // 최근 7일 이내의 아이디어만 가져오기
  useEffect(() => {
    const fetchRecentIdeas = async () => {
      try {
        const response = await axios.get("/api/ideas");

        // 최근 7일 이내의 아이디어만 필터링
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        const filteredIdeas = response.data
          .filter((idea) => {
            const createdAt = new Date(idea.created_at);
            return createdAt >= sevenDaysAgo;
          })
          .map((idea) => ({
            id: idea.id,
            title: idea.title,
            name: idea.name,
            dept_name: idea.dept_name,
            created_at: idea.created_at,
            daysAgo: calculateDaysAgo(idea.created_at),
          }));

        setRecentIdeas(filteredIdeas);
      } catch (err) {
        console.error("최근 아이디어 가져오기 오류:", err);
      }
    };

    fetchRecentIdeas();
  }, []);

  // 일수 계산 함수
  const calculateDaysAgo = (created_at) => {
    const createdDate = new Date(created_at);
    const todayDate = new Date();

    // 날짜만 비교하기 위해 시간 부분 리셋
    createdDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);

    // 두 날짜 간의 차이 계산 (밀리초 단위)
    const diffTime = todayDate - createdDate;
    // 밀리초를 일 단위로 변환
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "오늘";
    return `${diffDays}일전`;
  };

  // 알림 아이콘 클릭 핸들러
  const handleNotiClick = () => {
    setShowNotiDetail(!showNotiDetail);
    setActiveNotiIcon(!activeNotiIcon);
    // 알림 아이콘 클릭 시 사용자 정보 창 닫기
    if (showPersonDetail) setShowPersonDetail(false);
  };

  const handlePersonClick = () => {
    setShowPersonDetail(!showPersonDetail);
    // 사용자 아이콘 클릭 시 알림 창 닫기
    if (showNotiDetail) {
      setShowNotiDetail(false);
      setActiveNotiIcon(false);
    }
  };

  // 아이템 클릭 시 디테일 페이지로 이동
  const handleRowClick = (id) => {
    setShowNotiDetail(false);
    setActiveNotiIcon(false);
    navigate(`/ideaboard/detail/${id}`);
  };

  // 외부 클릭 감지하여 알림 및 사용자 상세 창 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 알림 관련 외부 클릭 처리
      if (
        showNotiDetail &&
        notiDetailRef.current &&
        !notiDetailRef.current.contains(event.target) &&
        notiIconRef.current &&
        !notiIconRef.current.contains(event.target)
      ) {
        setShowNotiDetail(false);
        setActiveNotiIcon(false);
      }

      // 사용자 정보 관련 외부 클릭 처리
      if (
        showPersonDetail &&
        personDetailRef.current &&
        !personDetailRef.current.contains(event.target) &&
        personIconRef.current &&
        !personIconRef.current.contains(event.target)
      ) {
        setShowPersonDetail(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotiDetail, showPersonDetail]);

  return (
    <div className="ideaNavbar">
      <div className="controls">
        <div className="noti" onClick={handleNotiClick} ref={notiIconRef}>
          {activeNotiIcon ? (
            <NotificationsIcon />
          ) : (
            <NotificationsNoneOutlinedIcon />
          )}
          {recentIdeas.length > 0 && (
            <div className="notiNum">{recentIdeas.length}</div>
          )}
        </div>

        {showNotiDetail && (
          <div className="notiDetail" ref={notiDetailRef}>
            <div className="header">
              <div className="title">이번주 신규 과제</div>
            </div>
            <div className="content">
              {recentIdeas.length > 0 ? (
                recentIdeas.map((idea) => (
                  <div
                    className="item"
                    key={idea.id}
                    onClick={() => handleRowClick(idea.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="profile">
                      <div className="name">{idea.name}</div>
                      <div className="team">{idea.dept_name}</div>
                    </div>
                    <div className="subContent">
                      <div className="title">{idea.title}</div>
                      <div className="day">{idea.daysAgo}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-ideas">신규 등록된 과제가 없습니다</div>
              )}
            </div>
          </div>
        )}
        <div className="person" onClick={handlePersonClick} ref={personIconRef}>
          <AccountCircleIcon />
        </div>
        {showPersonDetail && (
          <div className="personDetail" ref={personDetailRef}>
            <div className="personInfo">
              <div className="name">{currentUser.name}</div>
              <div className="nameDetail">
                <div className="dept">{currentUser.prntDeptName}</div>
                <div className="dept">{currentUser.deptName}</div>
              </div>
            </div>

            <div className="logout">
              <button onClick={logout}>
                <LogoutIcon />
                LOGOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaNavbar;
