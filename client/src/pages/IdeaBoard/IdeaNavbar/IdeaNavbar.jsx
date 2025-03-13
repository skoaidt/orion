import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LuClipboardEdit } from "react-icons/lu";
import { AuthContext } from "../../../context/authContext";
import { FaCode } from "react-icons/fa6";
import { BsLockFill } from "react-icons/bs";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import './ideaNavbar.scss'; // SCSS 파일 import

const IdeaNavbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  return (
    <div className="ideaNavbar">
      <div className="controls">
        {/* <Link to="/ideaboard" className="menu regLink">
          <LuClipboardEdit size={24} />
          <span>Idea 등록</span>
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
        )} */}

        <div className="menu logout" onClick={logout}>
          <BsLockFill size={24} />
          <span>{currentUser.name}님 Logout</span>
        </div>
      </div>
    </div>
  );
};

export default IdeaNavbar;
