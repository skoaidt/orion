import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import axios from "axios";

// Componets List
import MainNavBar from "../components/MainNavBar";
import ScrollToTop from "../components/ScrollToTop";
import Footer from "../components/Footer";
import RequireAdmin from "../components/AdminComponents/RequireAdmin";

// Page List
import Home from "./Home";
import Product from "./Product";
import Admin from "./Admin";
import { AuthContext } from "../context/authContext";
import IdeaBorad from "./IdeaBoard/IdeaBorad";
import SolMgmt from "./SolMgmt/SolMgmt";
import Portfolio from "./Portfolio/Portfolio";
import TypingMain from "./Typing/TypingMain/TypingMain";
import TypingHome from "./Typing/TypingHome/TypingHome";
import DevTable from "./IdeaBoard/DevTable/DevTable"; // eslint-disable-line no-unused-vars
import TrendPage from "./IdeaBoard/TrendPage/TrendPage";
import TrendDetail from "./IdeaBoard/TrendPage/TrendDetail";

export const Main = () => {
  const [getDevelopers, setGetDevelopers] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/controlpanel");
  const isPortfolioPage = location.pathname.startsWith("/portfolio");
  const isTypingPage = location.pathname.startsWith("/typing");
  const isIdeaBoardPage = location.pathname.startsWith("/ideaboard");
  const isDashboardPage = location.pathname.startsWith("/dashboard");
  const isDevTablePage = location.pathname.startsWith("/devtable");
  const isTrendPage = location.pathname.startsWith("/ideaboard/trend");

  ////////////////////////
  // 개발자 목록 가져오기
  const fetchDevelopers = async () => {
    try {
      const response = await axios.get("/api/developers/getdeveloper");
      setGetDevelopers(response.data);
    } catch (error) {
      console.log("개발자 가져올때 오류가 발생했습니다.", error);
    }
  };
  useEffect(() => {
    fetchDevelopers();
  }, []);

  useEffect(() => {
    const handleScroll = (event) => {
      // if (window.scrollY < 10) {
      //   window.scrollTo(0, 10);
      // }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // MAU 로직: Dashboard 또는 IdeaBoard 접속 시 유저 활동 기록
  useEffect(() => {
    const trackUserActivity = async () => {
      // 사용자가 로그인되어 있는 경우 추적 (N10 제한 제거)
      if (
        currentUser &&
        currentUser.userId &&
        (isIdeaBoardPage || isDashboardPage)
      ) {
        try {
          await axios.post("/api/analytics/track-activity", {
            userId: currentUser.userId,
            page: location.pathname,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error("활동 추적 오류:", error);
        }
      }
    };

    trackUserActivity();
  }, [location.pathname, currentUser, isIdeaBoardPage, isDashboardPage]);

  // console.log("Main에서 보는 getDevelopers : ", getDevelopers);
  return (
    <>
      <div className="main">
        {!isPortfolioPage &&
          !isTypingPage &&
          !isIdeaBoardPage &&
          !isDashboardPage &&
          !isDevTablePage &&
          !isTrendPage && <MainNavBar />}
        <Routes>
          <Route path="/typingMain" element={<TypingMain />}></Route>
          <Route path="/typingHome" element={<TypingHome />}></Route>
          <Route path="*" element={<Home getDevelopers={getDevelopers} />} />
          <Route
            path="/product/:productId/*"
            element={<Product getDevelopers={getDevelopers} />}
          />
          <Route path="/portfolio" element={<Portfolio />}></Route>
          {currentUser && currentUser.isAdmin && (
            <Route
              path="/controlpanel/*"
              element={
                <RequireAdmin>
                  <Admin />
                </RequireAdmin>
              }
            />
          )}
          {/* <Route path="/fileupload" element={<FileUpload />} /> */}
          <Route path="/ideaboard" element={<IdeaBorad />} />
          <Route path="/ideaboard/detail/:id" element={<IdeaBorad />} />
          <Route path="/ideaboard/kanban/:id" element={<IdeaBorad />} />
          <Route path="/ideaboard/devtable" element={<IdeaBorad />} />
          <Route path="/ideaboard/trend" element={<IdeaBorad />} />
          <Route path="/ideaboard/trend/:id" element={<IdeaBorad />} />
          <Route
            path="/ideaboard/solmgmt"
            element={
              <RequireAdmin>
                <IdeaBorad />
              </RequireAdmin>
            }
          />
          <Route path="/dashboard" element={<IdeaBorad />} />
          <Route path="/solmgmt" element={<SolMgmt />} />
        </Routes>
        {!isPortfolioPage && <ScrollToTop />}
      </div>
      {!(
        isAdminPage ||
        isPortfolioPage ||
        isTypingPage ||
        isIdeaBoardPage ||
        isDashboardPage ||
        isDevTablePage ||
        isTrendPage
      ) && <Footer />}
    </>
  );
};

export default Main;
