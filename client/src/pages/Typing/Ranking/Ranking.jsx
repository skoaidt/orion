import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Ranking.scss";

const RankingTable = ({ rankingData, category }) => {
  // 카테고리에 따른 제목 설정
  const getRankingTitle = () => {
    switch (category) {
      case "01":
        return "[일반문장] Ranking";
      case "02":
        return "[기술문장] Ranking";
      case "03":
        return "[TEST] Ranking";
      default:
        return "Typing Ranking";
    }
  };

  return (
    <div className="rankingTable">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="ranking-content"
          id="ranking-header"
        >
          <Typography
            variant="h6"
            style={{ color: "#484848", fontSize: "20px", fontWeight: "200" }}
          >
            {getRankingTitle()}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <table>
            <thead>
              <tr>
                <th>NO</th>
                <th>Name</th>
                <th>타수</th>
                <th>정확도</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rankingData.map((rank, index) => (
                <tr key={index}>
                  <td>{index === 0 ? "👑" : index + 1}</td>
                  <td>{rank.nickName}</td>
                  <td>{rank.averageSPM}</td>
                  <td>{rank.averageAccuracy}%</td>
                  <td>{rank.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default RankingTable;
