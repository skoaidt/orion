import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsLockFill } from "react-icons/bs";
// import { LuClipboardEdit } from "react-icons/lu";
// import { BsClipboardData } from "react-icons/bs";
// import { AiOutlineDashboard } from "react-icons/ai";
import { FaCode } from "react-icons/fa6";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { AuthContext } from "../context/authContext";

export const MainNavBar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  const [logoImage, setLogoImage] = useState(
    `${process.env.PUBLIC_URL}/image/logo/OrionLogoWhite.png`
  );

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
      if (isScrolled) {
        setLogoImage(`${process.env.PUBLIC_URL}/image/logo/OroinLogoColor.png`);
      } else {
        setLogoImage(`${process.env.PUBLIC_URL}/image/logo/OrionLogoWhite.png`);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`mainNavbar ${scrolled ? "scrolled" : ""}`}>
      <div className="inner">
        <div className="logo">
          <Link to="/" className="link">
            <img src={logoImage} alt="mainLogo" />
          </Link>
        </div>
        <div className="controls">
          {/* <Link to="/idearegister" className="menu regLink">
            <LuClipboardEdit size={24} />
            <span>Idea 등록</span>
          </Link> */}
          {/* <Link to="/solmgmt" className="menu regLink">
            <BsClipboardData size={24} />
            <span>Sol Mgmt</span>
          </Link>
          <Link to="/dashboard" className="menu regLink">
            <AiOutlineDashboard size={24} />
            <span>DashBoard</span>
          </Link> */}
          <Link to="/typing" className="menu regLink">
            <KeyboardIcon size={24} />
            <span>타자 연습</span>
          </Link>
          <Link to="/portfolio" className="menu regLink">
            <FaCode size={24} />
            <span>Working Group</span>
          </Link>
          {currentUser.isAdmin && ( // currentUser.isAdmin을 사용하여 조건부 렌더링
            <Link to="/controlpanel" className="menu regLink">
              <AppRegistrationIcon size={24} />
              <span>Admin 관리</span>
            </Link>
          )}

          <div className="menu" onClick={logout}>
            <BsLockFill size={24} />
            <span>{currentUser.name}님 Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavBar;
