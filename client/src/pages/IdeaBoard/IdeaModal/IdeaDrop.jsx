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
  const [dropStage, setDropStage] = useState(null); // Drop이 발생한 단계 (1: 선정, 2: 선임부서, 3: AI/DT)

  // ideaId 디버깅
  console.log("IdeaDrop 컴포넌트 - 현재 참조 중인 ideaId:", ideaId);

  useEffect(() => {
    const fetchData = async () => {
      if (!ideaId) {
        console.log("IdeaDrop - ideaId가 없음");
        setLoading(false);
        setError("아이디어 ID가 필요합니다. 다시 시도해주세요.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`IdeaDrop - API 호출 시작 (ideaId: ${ideaId})`);

        // 아이디어 기본 정보 가져오기
        const ideaResponse = await axios.get(`/api/ideas/${ideaId}`);
        setIdeaData(ideaResponse.data);
        console.log("IdeaDrop - 아이디어 기본 정보 가져오기 성공");

        // 선정 정보 가져오기
        try {
          const selectionResponse = await axios.get(
            `/api/ideas/selection/${ideaId}`
          );
          setSelectionData(selectionResponse.data);
          console.log("IdeaDrop - 선정 정보 가져오기 성공");

          // 선정 단계에서 Drop 확인
          if (
            selectionResponse.data &&
            selectionResponse.data.is_selected === false
          ) {
            setDropStage(1);
          }
        } catch (selectionError) {
          console.error("선정 정보 가져오기 오류:", selectionError);
          // 선정 정보가 없더라도 계속 진행
        }

        // 선정 단계에서 Drop된 경우 검증 정보는 조회하지 않음
        if (dropStage !== 1) {
          // 검증 정보 가져오기
          try {
            const verifyResponse = await axios.get(
              `/api/ideas/verify/${ideaId}`
            );
            setVerifyData(verifyResponse.data);
            console.log("IdeaDrop - 검증 정보 가져오기 성공");

            // 검증 단계에서 Drop 확인
            if (verifyResponse.data) {
              if (verifyResponse.data.verification_status === false) {
                setDropStage(2); // 선임부서에서 Drop
              } else if (verifyResponse.data.ai_verification_status === false) {
                setDropStage(3); // AI/DT 부서에서 Drop
              }
            }
          } catch (verifyError) {
            console.error("검증 정보 가져오기 오류:", verifyError);
            // 검증 정보가 없더라도 계속 진행
          }
        }
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
    comment: "현재 등록된 의견이 없습니다.",
    is_selected: false,
  };

  const mockVerifyData = {
    comment: "현재 등록된 의견이 없습니다.",
    verification_status: false,
    department: "등록된 선임부서가 없습니다.",
    ai_comment: "현재 등록된 의견이 없습니다.",
    ai_verification_status: false,
  };

  // 각 데이터의 null 여부를 콘솔에 출력
  console.log("ideaData:", ideaData);
  console.log("ideaData가 null인가?", ideaData === null);

  console.log("selectionData:", selectionData);
  console.log("selectionData가 null인가?", selectionData === null);

  console.log("verifyData:", verifyData);
  console.log("verifyData가 null인가?", verifyData === null);

  console.log("현재 참조 중인 ideaId:", ideaId);
  console.log("Drop 단계:", dropStage);

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
                    {selectionData
                      ? formatTextWithLineBreaks(selectionData.comment)
                      : "-"}
                  </span>
                </p>
                <p>
                  <strong>선정여부:</strong>
                  <span
                    className={
                      selectionData && !selectionData.is_selected
                        ? "dropStatus"
                        : ""
                    }
                  >
                    {selectionData
                      ? selectionData.is_selected
                        ? "선정"
                        : "Drop"
                      : "-"}
                  </span>
                </p>
              </div>
            </div>

            {/* 2. 본사 선임부서 검증 섹션 */}
            <div className="sectionContainer">
              <h3 className="sectionTitle">2. 본사 선임부서 검증</h3>
              <div className="contentBox">
                {dropStage === 1 ? (
                  // 선정 단계에서 Drop된 경우 "-" 표시
                  <>
                    <p>
                      <strong>의견:</strong>
                      <span className="commentText">-</span>
                    </p>
                    <p>
                      <strong>검증여부:</strong>
                      <span>-</span>
                    </p>
                    <p>
                      <strong>검증부서:</strong>
                      <span className="departmentText">-</span>
                    </p>
                  </>
                ) : (
                  // 그 외 정상 표시
                  <>
                    <p>
                      <strong>의견:</strong>
                      <span className="commentText">
                        {verifyData
                          ? formatTextWithLineBreaks(verifyData.comment)
                          : "-"}
                      </span>
                    </p>
                    <p>
                      <strong>검증여부:</strong>
                      <span
                        className={
                          verifyData && !verifyData.verification_status
                            ? "dropStatus"
                            : ""
                        }
                      >
                        {verifyData
                          ? verifyData.verification_status
                            ? "검증완료"
                            : "Drop"
                          : "-"}
                      </span>
                    </p>
                    <p>
                      <strong>검증부서:</strong>
                      <span className="departmentText">
                        {verifyData && verifyData.department
                          ? verifyData.department
                          : "-"}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* 3. AI/DT부서 검증 섹션 */}
            <div className="sectionContainer">
              <h3 className="sectionTitle">3. AI/DT부서 검증</h3>
              <div className="contentBox">
                {dropStage === 1 || dropStage === 2 ? (
                  // 선정 또는 선임부서 단계에서 Drop된 경우 "-" 표시
                  <>
                    <p>
                      <strong>의견:</strong>
                      <span className="commentText">-</span>
                    </p>
                    <p>
                      <strong>검증여부:</strong>
                      <span>-</span>
                    </p>
                  </>
                ) : (
                  // 그 외 정상 표시
                  <>
                    <p>
                      <strong>의견:</strong>
                      <span className="commentText">
                        {verifyData
                          ? formatTextWithLineBreaks(verifyData.ai_comment)
                          : "-"}
                      </span>
                    </p>
                    <p>
                      <strong>검증여부:</strong>
                      <span
                        className={
                          verifyData && !verifyData.ai_verification_status
                            ? "dropStatus"
                            : ""
                        }
                      >
                        {verifyData
                          ? verifyData.ai_verification_status
                            ? "검증완료"
                            : "Drop"
                          : "-"}
                      </span>
                    </p>
                  </>
                )}
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
