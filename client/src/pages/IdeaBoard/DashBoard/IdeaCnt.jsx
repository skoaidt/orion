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
        <span>IDEA 등록</span>
        <span>기준 : {new Date().getFullYear()}년 누적</span>
      </div>
      <div className="totalCnt">
        <div className="totalCntTitle">총 등록건수</div>
        <p>
          {ideaCnt.totalCnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
      </div>
      <div className="ideaCntBox">
        <div className="box regBox">
          <div className="boxHeader">
            <div className="iconCircle">
              <CreateIcon />
            </div>
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
        <div className="box devBox">
          <div className="boxHeader">
            <div className="iconCircle">
              <WebhookIcon />
            </div>
            <p>개발중</p>
          </div>
          <div className="boxContent">
            <p>
              {ideaCnt.developing
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              건
            </p>
          </div>
        </div>
        <div className="box compBox">
          <div className="boxHeader">
            <div className="iconCircle">
              <MilitaryTechIcon />
            </div>
            <p>완료</p>
          </div>
          <div className="boxContent">
            <p>
              {ideaCnt.completed
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              건
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCnt;
