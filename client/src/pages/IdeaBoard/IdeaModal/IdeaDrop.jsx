import React, { useState, useEffect } from "react";
import "./ideaDrop.scss";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const IdeaDrop = ({ onClose, ideaId }) => {
  const [ideaData, setIdeaData] = useState(null);
  const [selectionData, setSelectionData] = useState(null);
  const [verifyData, setVerifyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!ideaId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 아이디어 기본 정보 가져오기
        const ideaResponse = await axios.get(`/api/ideas/${ideaId}`);
        setIdeaData(ideaResponse.data);

        // 선정 정보 가져오기
        const selectionResponse = await axios.get(
          `/api/ideas/selection/${ideaId}`
        );
        setSelectionData(selectionResponse.data);

        // 검증 정보 가져오기
        const verifyResponse = await axios.get(`/api/ideas/verify/${ideaId}`);
        setVerifyData(verifyResponse.data);
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ideaId]);

  // 목업 데이터 (API가 실패하거나 데이터가 없을 때 대체용)
  const mockSelectionData = {
    comment:
      "현재 요구사항과 맞지 않는 기능으로 판단되어 Drop 처리합니다. 추후 니즈 분석 후 재검토 가능합니다.",
    is_selected: false,
  };

  const mockVerifyData = {
    comment:
      "타부서 협의 필요성은 없으나, 개발 리소스가 부족하여 현재 진행이 어렵습니다.",
    verification_status: false,
    department: "Access계획팀",
    ai_comment:
      "현재 기술로는 구현이 어렵습니다. 요구사항 재정의가 필요합니다.",
    ai_verification_status: false,
    ai_department: "AI/DT기획 PL",
  };

  // 각 데이터의 null 여부를 콘솔에 출력
  console.log("ideaData:", ideaData);
  console.log("ideaData가 null인가?", ideaData === null);

  console.log("selectionData:", selectionData);
  console.log("selectionData가 null인가?", selectionData === null);

  console.log("verifyData:", verifyData);
  console.log("verifyData가 null인가?", verifyData === null);

  // 온점(.) 기준으로 텍스트 줄바꿈 처리 함수
  const formatTextWithLineBreaks = (text) => {
    if (!text) return "";

    // 온점(.) 뒤에 공백이 있는 경우에만 줄바꿈 처리
    const formattedText = text.replace(/\.\s+/g, ".\n");
    return formattedText;
  };

  return (
    <div className="DropModalOverlay">
      <div className="DropModalContent">
        <div className="titleBox">
          <h2>Drop 사유</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />

        {loading ? (
          <div className="loadingContainer">
            <CircularProgress />
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        ) : error ? (
          <div className="errorContainer">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* 1. 선정 섹션 */}
            <div className="sectionContainer">
              <h3 className="sectionTitle">1. 선정</h3>
              <div className="contentBox">
                <p>
                  <strong>의견:</strong>
                  <span className="commentText">
                    {formatTextWithLineBreaks(
                      selectionData?.comment || mockSelectionData.comment
                    )}
                  </span>
                </p>
                <p>
                  <strong>선정여부:</strong>
                  <span
                    className={!selectionData?.is_selected ? "dropStatus" : ""}
                  >
                    {selectionData?.is_selected ? "선정" : "Drop"}
                  </span>
                </p>
              </div>
            </div>

            {/* 2. 본사 선임부서 검증 섹션 */}
            <div className="sectionContainer">
              <h3 className="sectionTitle">2. 본사 선임부서 검증</h3>
              <div className="contentBox">
                <p>
                  <strong>의견:</strong>
                  <span className="commentText">
                    {formatTextWithLineBreaks(
                      verifyData?.comment || mockVerifyData.comment
                    )}
                  </span>
                </p>
                <p>
                  <strong>검증여부:</strong>
                  <span
                    className={
                      !verifyData?.verification_status ? "dropStatus" : ""
                    }
                  >
                    {verifyData?.verification_status ? "검증완료" : "Drop"}
                  </span>
                </p>
                <p>
                  <strong>검증부서:</strong>
                  <span className="departmentText">
                    {verifyData?.department || mockVerifyData.department}
                  </span>
                </p>
              </div>
            </div>

            {/* 3. AI/DT부서 검증 섹션 */}
            <div className="sectionContainer">
              <h3 className="sectionTitle">3. AI/DT부서 검증</h3>
              <div className="contentBox">
                <p>
                  <strong>의견:</strong>
                  <span className="commentText">
                    {formatTextWithLineBreaks(
                      verifyData?.ai_comment || mockVerifyData.ai_comment
                    )}
                  </span>
                </p>
                <p>
                  <strong>검증여부:</strong>
                  <span
                    className={
                      !verifyData?.ai_verification_status ? "dropStatus" : ""
                    }
                  >
                    {verifyData?.ai_verification_status ? "검증완료" : "Drop"}
                  </span>
                </p>
                <p>
                  <strong>검증부서:</strong>
                  <span className="departmentText">
                    {verifyData?.ai_department || mockVerifyData.ai_department}
                  </span>
                </p>
              </div>
            </div>
          </>
        )}

        {/* 확인 버튼 */}
        <div className="buttonContainer">
          <button className="confirmButton" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaDrop;
