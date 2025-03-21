import React from "react";
import "./ideaPilot.scss";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";

const IdeaPilot = ({ onClose }) => {
  return (
    <div className="PilotModalOverlay">
      <div className="PilotModalContent">
        <div className="titleBox">
          <h2>현장 Pilot 결과</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />
        <div className="rowContainer">
          {/*생산성*/}
          <div className="rowContainerSmall">
            <div className="fieldLabel">생산성</div>
            <TextField className="Textfield" variant="outlined" />
            <div className="fieldText">M/M</div>
          </div>
          {/*비용*/}
          <div className="rowContainerSmall">
            <div className="fieldLabel">비용</div>
            <TextField className="Textfield" variant="outlined" />
            <div className="fieldText">억 원</div>
          </div>
        </div>
        <div className="rowContainerBasis">
          <div className="fieldLabel">
            정량적
            <br />
            기대효과
            <br />
            근거
          </div>
          <TextField
            className="Textfield"
            variant="outlined"
            multiline
            rows={12}
            fullWidth
            defaultValue={`○ 생산성\n○ 비용`}
          />
        </div>
        <div className="rowContainerResult">
          <div className="fieldLabel">결과</div>
          <TextField
            className="Textfield"
            variant="outlined"
            //placeholder="결과를 업로드하세요"
          />
          <button className="uploadButton">
            <img
              src={`${process.env.PUBLIC_URL}/image/icons/upload-white.png`}
              alt="업로드 아이콘"
              className="uploadIcon"
            />
            첨부파일 upload
          </button>
        </div>
        {/* 버튼 컨테이너 */}
        <div className="buttonContainer">
          <button className="cancelButton" onClick={onClose}>
            취소
          </button>
          <button className="registerButton" onClick={onClose}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaPilot;
