import React from "react";
import "./dashBoard.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TopBox from "./TopBox";
import ConnectCnt from "./ConnectCnt";
import NewIdeaList from "./NewIdeaList";
import DevList from "./DevList";
import IdeaCnt from "./IdeaCnt";

const DashBoard = () => {
  return (
    <div className="dashBoard">
      <h1>
        <DashboardIcon />
        DashBoard
      </h1>
      <div className="boxContainer">
        <div className="box box1">
          <IdeaCnt />
        </div>
        <div className="box box2">box2</div>
        <div className="box box3">
          <ConnectCnt />
        </div>
        <div className="box box4">
          <TopBox />
        </div>
        <div className="box box5">box5</div>
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
