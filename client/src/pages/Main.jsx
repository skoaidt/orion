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
import DashBoard from "./DashBoard/DashBoard";
import Portfolio from "./Portfolio/Portfolio";
// import Typing from "./Typing/Typing";
import TypingMain from "./Typing/TypingMain/TypingMain";
import TypingHome from "./Typing/TypingHome/TypingHome";

export const Main = () => {
  const [getDevelopers, setGetDevelopers] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/controlpanel");
  const isPortfolioPage = location.pathname.startsWith("/portfolio");
  const isTypingPage = location.pathname.startsWith("/typing");
  const isIdeaBoardPage = location.pathname.startsWith("/ideaboard");

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
      if (window.scrollY < 10) {
        window.scrollTo(0, 10);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // console.log("Main에서 보는 getDevelopers : ", getDevelopers);
  return (
    <>
      <div className="main">
        {!isPortfolioPage && !isTypingPage && !isIdeaBoardPage && (
          <MainNavBar />
        )}
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
          <Route path="/solmgmt" element={<SolMgmt />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Routes>
        {!isPortfolioPage && <ScrollToTop />}
      </div>
      {!(isAdminPage || isPortfolioPage || isTypingPage || isIdeaBoardPage) && (
        <Footer />
      )}
    </>
  );
};

export default Main;
