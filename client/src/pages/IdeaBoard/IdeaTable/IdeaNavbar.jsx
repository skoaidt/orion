import React, { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { BsLockFill } from "react-icons/bs";
import "./ideaNavbar.scss"; // SCSS 파일 import

const IdeaNavbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  return (
    <div className="ideaNavbar">
      <div className="controls">
        <div className="menu logout" onClick={logout}>
          <BsLockFill size={24} />
          <span>{currentUser.name}님 Logout</span>
        </div>
      </div>
    </div>
  );
};

export default IdeaNavbar;
