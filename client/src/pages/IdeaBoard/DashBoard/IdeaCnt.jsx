import React from "react";
import "./ideaCnt.scss";
import { ideaCnt } from "./data";
import CreateIcon from "@mui/icons-material/Create";
import WebhookIcon from "@mui/icons-material/Webhook";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

const IdeaCnt = () => {
  return (
    <div className="ideaCnt">
      <div className="header">
        <span>IDEA 등록건수</span>
        <span>기준 : {new Date().getFullYear() + 2}년 누적</span>
      </div>
      <div className="totalCnt">
        <p>
          {ideaCnt.totalCnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
      </div>
      <div className="ideaCntBox">
        <div className="regBox">
          <div className="boxHeader">
            <div className="icon"></div>
            <p>등록</p>
          </div>
          <div className="boxContent">
            <p>
              {ideaCnt.registerCnt
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              건
            </p>
          </div>
        </div>
        <div className="devBox"></div>
        <div className="compBox"></div>
      </div>
    </div>
  );
};

export default IdeaCnt;
