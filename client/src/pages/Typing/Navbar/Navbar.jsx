import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/" className="homeBox">
        <div className="icon">
          <HomeIcon />
        </div>
        <p>Home : Orion으로 이동</p>
      </Link>
      <Link to="/typingMain" className="homeBox categoryBox">
        <p>Category Select</p>
      </Link>
    </div>
  );
};

export default Navbar;
