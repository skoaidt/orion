import React from 'react'
import { NavLink } from 'react-router-dom';
import "./main.scss";

export const MiddleNavBar = () => {
  return (
    <nav className="mainMiddleNavBar">
      <div className="navbarContainer">
        <div className="middleIcon">
          <NavLink to="/">
            <img src={process.env.PUBLIC_URL + "/image/icons/menu_icon_50px.png"} alt="menu_icon" />
          </NavLink>
        </div>

        <ul className="navLinks">
          <li><NavLink to="/all" >All</NavLink></li>
          <li><NavLink to="/workfield/?work_field=rm" >RM</NavLink></li>
          <li><NavLink to="/workfield/?work_field=access" >Access</NavLink></li>
          <li><NavLink to="/workfield/?work_field=wire" >전송</NavLink></li>
          <li><NavLink to="/workfield/?work_field=infra" >Infra설비</NavLink></li>
          <li><NavLink to="/workfield/?work_field=asset" >자산</NavLink></li>
          <li><NavLink to="/workfield/?work_field=so" >SO</NavLink></li>
          <li><NavLink to="/workfield/?work_field=mgmt" >경영</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}

export default MiddleNavBar;