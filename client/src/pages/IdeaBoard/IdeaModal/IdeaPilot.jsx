import React, { useState } from "react";
import "./ideaPilot.scss";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import axios from "axios";

const IdeaPilot = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setSelectedFile(null);
      setFileName("");
    }
  };

  // 등록 버튼 클릭 핸들러 (수정된 부분)
  const handleRegister = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("path", "pilot"); // 저장 경로 지정

        // 서버에 파일 업로드 요청
        await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("파일 업로드 성공:", selectedFile.name);
        alert("파일이 성공적으로 업로드되었습니다.");
      }

      // 여기에 다른 데이터 처리 로직 추가 가능

      // 등록 완료 후 모달 닫기
      onClose();
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="PilotModalOverlay">
      <div className="PilotModalContent">
        <div className="titleBox">
          <h2>현장 Pilot 결과</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />
        <div className="rowContainer">
          {/* 생산성 */}
          <div className="rowContainerSmall">
            <div className="fieldLabel">생산성</div>
            <TextField className="Textfield" variant="outlined" />
            <div className="fieldText">M/M</div>
          </div>
          {/* 비용 */}
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
          {/* 파일명 표시 */}
          <TextField
            className="Textfield"
            variant="outlined"
            value={fileName}
            placeholder="첨부된 파일 없음"
            InputProps={{
              readOnly: true,
            }}
          />
          {/* 파일 선택 */}
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          {/* 첨부파일 업로드 버튼 */}
          <button
            className="uploadButton"
            onClick={() => document.getElementById("fileInput").click()}
          >
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
          {/* 등록 버튼 - 수정된 핸들러 연결 */}
          <button className="registerButton" onClick={handleRegister}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaPilot;
