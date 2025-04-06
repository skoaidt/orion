import React from "react";
import "./dashBoard.scss";
import TopBox from "./TopBox";
import ConnectCnt from "./ConnectCnt";
import NewIdeaList from "./NewIdeaList";
import DevList from "./DevList";
import IdeaCnt from "./IdeaCnt";
import PieChartBox from "./PieChartBox";
import BarChartBox from "./BarChartBox";

const DashBoard = () => {
  return (
    <div className="dashBoard">
      <div className="boxContainer">
        <div className="box box1">
          <IdeaCnt />
        </div>
        <div className="box box2">
          <PieChartBox />
        </div>
        <div className="box box3">
          <ConnectCnt />
        </div>
        <div className="box box4">
          <TopBox />
        </div>
        <div className="box box5">
          <BarChartBox />
        </div>
        <div className="box box6">
          <NewIdeaList />
        </div>
        <div className="box box7">
          <DevList />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
