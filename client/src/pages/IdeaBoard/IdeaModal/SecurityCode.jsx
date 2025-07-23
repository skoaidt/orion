import React, { useState, useEffect, useContext } from "react";
import "./securityCode.scss";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";

const SecurityCode = ({ onClose, ideaId, isViewMode }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewData, setViewData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [viewMode, setViewMode] = useState(isViewMode);

  const { currentUser } = useContext(AuthContext);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      if (!ideaId) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/ideas/security/${ideaId}`);

        if (response.data && response.data.sourceCode_URL) {
          setViewData(response.data);
          setUploadedImage(response.data.sourceCode_URL);
          // 파일 정보를 위한 가짜 파일 객체 생성 (URL에서 파일명 추출)
          const fileName =
            response.data.sourceCode_URL.split("/").pop() || "uploaded_file";
          setUploadedFile({ name: fileName });

          // 데이터가 있는 경우에만 강제로 viewMode를 true로 설정
          if (!viewMode) {
            setViewMode(true);
          }
        } else {
          // 데이터가 없는 경우 초기 isViewMode 값 사용
          setViewMode(isViewMode);
        }
      } catch (error) {
        console.error("코드보안진단 데이터 조회 오류:", error);
        if (error.response && error.response.status === 404) {
          // 데이터가 없는 경우는 에러가 아님
          setViewData(null);
        } else if (viewMode) {
          setError("저장된 코드보안진단 데이터를 불러올 수 없습니다.");
        }
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    };

    fetchData();
  }, [ideaId, isViewMode]);

  // 파일 업로드 핸들러
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);

      // 이미지 파일인 경우 미리보기 생성
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedImage(null);
      }
    }
  };

  // 등록/수정 버튼 핸들러
  const handleSubmit = async () => {
    if (!uploadedFile) {
      alert("보안진단 결과 파일을 업로드해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let sourceCode_URL;

      // 새로 업로드된 파일인 경우
      if (uploadedFile && uploadedFile.size) {
        // FormData로 파일 업로드
        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("path", "SecurityCode"); // 폴더 구분용
        formData.append("ideaId", ideaId); // 파일명 생성용

        // 이미지 업로드 API 호출
        const uploadRes = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        sourceCode_URL = uploadRes.data.url; // 업로드 결과로 이미지 url을 받음
      } else if (viewData && viewData.sourceCode_URL) {
        // 기존 이미지를 그대로 사용하는 경우
        sourceCode_URL = viewData.sourceCode_URL;
      } else {
        alert("업로드할 파일이 없습니다.");
        return;
      }

      // DB에 URL만 저장
      const response = await axios.post(`/api/ideas/security-code/${ideaId}`, {
        sourceCode_URL: sourceCode_URL,
      });

      alert("소스코드보안진단 결과가 성공적으로 등록되었습니다.");
      setViewMode(true);
      onClose(true);
    } catch (error) {
      console.error("소스코드보안진단 등록 오류:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("등록 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 편집 모드로 전환
  const handleEdit = () => {
    setViewMode(false);
  };

  return (
    <div className="securityModalOverlay">
      <div className="securityModalContent">
        <div className="titleBox">
          <h2>소스코드 보안진단 결과 등록</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />

        {/* 설명 텍스트 */}
        <div className="descriptionBox">
          <p>자체 개발 프로그램은 소스코드 보안진단을 진행해야 합니다.</p>
          <p>보안 취약점을 점검하고 결과 보고서를 제출해주세요.</p>
        </div>

        {/* 오류 메시지 표시 */}
        {error && <div className="errorMessage">{error}</div>}

        {/* 파일 업로드 섹션 */}
        <div className="uploadSection">
          <div className="uploadContainer">
            <div className="uploadBox">
              <input
                type="file"
                id="fileUpload"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                disabled={viewMode}
              />
              <label
                htmlFor="fileUpload"
                className={`uploadButton ${viewMode ? "disabled" : ""}`}
              >
                <FileUploadIcon />
                보안진단결과 업로드
              </label>
              {uploadedFile && (
                <span className="fileName">{uploadedFile.name}</span>
              )}
            </div>
          </div>
        </div>

        {/* 미리보기 섹션 */}
        {uploadedImage && (
          <div className="previewSection">
            <div className="previewContainer">
              <div className="previewBox">
                <img src={uploadedImage} alt="업로드된 이미지 미리보기" />
              </div>
            </div>
          </div>
        )}

        {/* 버튼 컨테이너 */}
        <div className="buttonContainer">
          {viewMode ? (
            // 읽기 모드: 수정, 닫기
            <>
              <button
                className="cancelButton"
                onClick={handleEdit}
                disabled={loading}
              >
                수정
              </button>
              <button
                className="registerButton"
                onClick={() => onClose(true)}
                disabled={loading}
              >
                닫기
              </button>
            </>
          ) : (
            // 편집 모드: 취소, 등록
            <>
              <button
                className="cancelButton"
                onClick={() => onClose(false)}
                disabled={loading}
              >
                닫기
              </button>
              <button
                className="registerButton"
                onClick={handleSubmit}
                disabled={loading}
              >
                등록
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityCode;
