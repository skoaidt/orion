import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Ranking.scss";

const RankingTable = ({ typingRank }) => {
  const top10 = typingRank.slice(0, 10);
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
            Typing Ranking
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
              {top10.map((rank, index) => (
                <tr key={index}>
                  <td>{index === 0 ? "👑" : index + 1}</td>
                  <td>{rank.name}</td>
                  <td>{rank.avgSpm}</td>
                  <td>{rank.avgAccuracy}%</td>
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
