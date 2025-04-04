import React, { useState } from "react";
import "./ideaPilot.scss";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import axios from "axios";

const IdeaPilot = ({ onClose, ideaId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [productivity, setProductivity] = useState("");
  const [cost, setCost] = useState("");
  const [quantitybasis, setQuantitybasis] = useState("○ 생산성\n○ 비용");
  const [loading, setLoading] = useState(false);

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

  // 입력 필드 핸들러
  const handleProductivityChange = (event) => {
    setProductivity(event.target.value);
  };

  const handleCostChange = (event) => {
    setCost(event.target.value);
  };

  const handleQuantitybasisChange = (event) => {
    setQuantitybasis(event.target.value);
  };

  // 등록 버튼 클릭 핸들러
  const handleRegister = async () => {
    try {
      setLoading(true);

      // 필수 필드 검증
      if (!productivity.trim()) {
        alert("생산성을 입력해주세요.");
        setLoading(false);
        return;
      }

      if (!cost.trim()) {
        alert("비용을 입력해주세요.");
        setLoading(false);
        return;
      }

      if (!quantitybasis.trim()) {
        alert("정량적 기대효과 근거를 입력해주세요.");
        setLoading(false);
        return;
      }

      // 파일 업로드
      let filePath = "";
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("path", "pilot");

        // 서버에 파일 업로드 요청
        const fileUploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("파일 업로드 성공:", fileUploadResponse.data);
        filePath = fileUploadResponse.data.filePath;
      }

      // 파일럿 데이터 등록
      const pilotData = {
        ideaID: ideaId || 1, // ideaId가 전달되지 않은 경우 테스트용으로 1 사용
        productivity: productivity,
        cost: cost,
        quantitybasis: quantitybasis,
        filePath: filePath, // 파일 경로 포함
      };

      console.log("등록할 파일럿 데이터:", pilotData);

      // API 호출
      const response = await axios.post("/api/ideas/pilot", pilotData);

      console.log("파일럿 데이터 등록 성공:", response.data);
      alert("파일럿 결과가 성공적으로 등록되었습니다.");

      // 등록 완료 후 모달 닫기
      onClose();
    } catch (error) {
      console.error("파일럿 데이터 등록 오류:", error);
      alert(
        "데이터 등록 중 오류가 발생했습니다: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
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
            <TextField
              className="Textfield"
              variant="outlined"
              value={productivity}
              onChange={handleProductivityChange}
            />
            <div className="fieldText">M/M</div>
          </div>
          {/* 비용 */}
          <div className="rowContainerSmall">
            <div className="fieldLabel">비용</div>
            <TextField
              className="Textfield"
              variant="outlined"
              value={cost}
              onChange={handleCostChange}
            />
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
            value={quantitybasis}
            onChange={handleQuantitybasisChange}
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
          <button className="cancelButton" onClick={onClose} disabled={loading}>
            취소
          </button>
          <button
            className="registerButton"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaPilot;
