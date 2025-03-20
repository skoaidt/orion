import React from "react";
import "./ideaPilot.scss";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";

const IdeaPilot = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="titleBox">
          <h2>현장 Pilot 결과</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />

        <div className="rowContainerComment">
          {/*생산성*/}
          <div className="rowContainerSmall">
            <div className="fieldLabel">생산성</div>
            <TextField
              className="commentTextfield"
              variant="outlined"
              //placeholder="의견을 작성해주세요"
              //fullWidth
            />
            <div className="fieldText">M/M</div>
          </div>
          {/*비용*/}
          <div className="rowContainerSmall">
            <div className="fieldLabel">비용</div>
            <TextField
              className="commentTextfield"
              variant="outlined"
              //placeholder="의견을 작성해주세요"
              //fullWidth
            />
            <div className="fieldText">억원</div>
          </div>
        </div>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default IdeaPilot;
