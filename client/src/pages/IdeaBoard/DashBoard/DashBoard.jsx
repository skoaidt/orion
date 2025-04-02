import React from "react";
import "./dashBoard.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TopBox from "../../../components/Charts/TopBox";
import PieChartBox from "../../../components/Charts/PieChartBox";
import BarChartBox from "../../../components/Charts/BarChartBox";

const DashBoard = () => {
  return (
    <div className="dashBoard">
      <h1>
        <DashboardIcon />
        DashBoard
      </h1>
      <div className="dashBoardBox">
        <TopBox />
        <PieChartBox />
        <BarChartBox />
      </div>
    </div>
  );
};

export default DashBoard;
