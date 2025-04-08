import React from "react";
import "./connectCnt.scss";
import { connectCnt } from "./data";

const ConnectCnt = () => {
  return (
    <div className="connectCnt">
      <div className="header">
        <span>접속자수</span>
        <span>(명)</span>
      </div>
      <div className="connectCntBox">
        <p>MAU</p>
        <div className="totalCnt">
          <p>
            {connectCnt.totalCnt
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
        <div className="connectCntBoxItem">
          <div className="Week">
            <span>이번주</span>
            <span className="line"></span>
            <span>{connectCnt.thiskWeek}</span>
          </div>
          <div className="Week">
            <span>저번주</span>
            <span className="line"></span>
            <span>{connectCnt.lastWeek}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectCnt;
