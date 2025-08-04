import React, { useState, useContext, useEffect } from "react";
import "./ideaDevelop.scss";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { AuthContext } from "../../../context/authContext";

const IdeaDevelop = ({ onClose, id }) => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [ideaData, setIdeaData] = useState(null);
  const [checkingProgress, setCheckingProgress] = useState(true);

  // 아이디어 데이터 조회 (개발 시작 여부와 진행율 확인용)
  useEffect(() => {
    const fetchIdeaData = async () => {
      if (!id) return;

      try {
        setCheckingProgress(true);
        const response = await axios.get(`/api/ideas/${id}`);
        setIdeaData(response.data);
        console.log("아이디어 데이터:", response.data);
        console.log("개발 시작 여부 (status):", response.data.status);
        console.log("진행율 (ideaprogress):", response.data.ideaprogress);
      } catch (error) {
        console.error("아이디어 데이터 조회 오류:", error);
      } finally {
        setCheckingProgress(false);
      }
    };

    fetchIdeaData();
  }, [id]);

  // 개발심의에서 선정된 개발자 목록 조회
  useEffect(() => {
    const fetchDevelopers = async () => {
      if (!id) return;

      try {
        setCheckingPermission(true);
        const response = await axios.get(`/api/ideas/devreview/${id}`);

        if (
          response.data &&
          response.data.developers &&
          response.data.developers.length > 0
        ) {
          // 개발자 목록 저장
          setDevelopers(response.data.developers);
          console.log("개발심의 참여 개발자 목록:", response.data.developers);
        } else {
          console.log("개발심의 참여 개발자가 없습니다.");
        }
      } catch (error) {
        console.error("개발심의 정보 조회 오류:", error);
        if (error.response && error.response.status === 404) {
          console.log("개발심의 정보가 없습니다.");
        }
      } finally {
        setCheckingPermission(false);
      }
    };

    fetchDevelopers();
  }, [id]);

  // 편집 권한을 확인하는 함수 (개발심의 단계의 참여 개발자 또는 Admin만 권한 있음)
  const hasEditPermission = () => {
    // 현재 사용자가 없는 경우 권한 없음
    if (!currentUser) {
      console.log("현재 로그인한 사용자가 없습니다. 권한 없음.");
      return false;
    }

    // Admin인 경우 권한 있음
    if (currentUser.isAdmin) {
      console.log("관리자 권한으로 접근: 권한 있음");
      return true;
    }

    // 현재 사용자 ID
    const userId = currentUser.userId;

    console.log("개발 완료 권한 확인 정보:");
    console.log("- 사용자 정보:", currentUser);
    console.log("- 사용자 ID:", userId);
    console.log("- 아이디어 데이터:", ideaData);
    console.log("- 선정된 개발자 목록:", developers);

    // '기 완료' 또는 '자체' 상태인 경우 작성자에게 권한 부여
    if (
      ideaData &&
      (ideaData.project_type === "기 완료" || ideaData.target_user === "자체")
    ) {
      const authorId = ideaData.user_id;
      console.log("- 아이디어 프로젝트 타입:", ideaData.project_type);
      console.log("- 아이디어 대상 사용자:", ideaData.target_user);
      console.log("- 작성자 ID:", authorId);

      if (authorId && authorId === userId) {
        console.log("'기 완료/자체' 상태 작성자로 확인됨: 권한 있음");
        return true;
      }
    }

    // 개발심의 단계에서 선정된 개발자인지 확인
    if (developers && developers.length > 0 && userId) {
      // 개발자 ID 비교 (n_id 또는 no 필드)
      const isDeveloper = developers.some((dev) => {
        const devId = dev.n_id || dev.no; // 데이터 구조에 따라 n_id 또는 no 사용
        return devId === userId || dev.id === userId;
      });

      if (isDeveloper) {
        console.log("선정된 개발자로 확인됨: 권한 있음");
        return true;
      }
    }

    console.log("권한 없음 - 관리자/선정된 개발자/해당 상태의 작성자가 아님");
    return false;
  };

  // 개발 시작 여부 확인 함수
  const isDevStarted = () => {
    if (!ideaData) return false;

    // '기 완료', '자체' 프로젝트이고 작성자인 경우 항상 true
    if (
      ideaData &&
      (ideaData.project_type === "기 완료" || ideaData.target_user === "자체")
    ) {
      const authorId = ideaData.user_id;
      const userId = currentUser?.userId;

      if (authorId && authorId === userId) {
        console.log("'기 완료/자체' 작성자 - 개발 시작 조건 만족");
        return true;
      }
    }

    return ideaData.status === "개발중";
  };

  // 진행율 100% 확인 함수
  const isProgressComplete = () => {
    if (!ideaData) return false;
    const progress = Number(ideaData.ideaprogress) || 0;
    return progress === 100;
  };

  // 개발 완료 조건 확인 함수
  const canCompleteDevelopment = () => {
    const devStarted = isDevStarted();
    const progressComplete = isProgressComplete();

    console.log("개발 완료 조건 확인:");
    console.log("- 개발 시작 여부:", devStarted);
    console.log("- 진행율 100%:", progressComplete);
    console.log("- 전체 조건 만족:", devStarted && progressComplete);

    return devStarted && progressComplete;
  };

  const handleComplete = async () => {
    // 권한 확인
    if (!hasEditPermission()) {
      alert(
        "권한이 없습니다. 개발심의 단계에서 선정된 개발자 또는 관리자만 개발 완료 처리할 수 있습니다."
      );
      return;
    }

    // 개발 시작 및 진행율 조건 확인
    if (!canCompleteDevelopment()) {
      if (!isDevStarted()) {
        alert("개발 시작 버튼을 먼저 눌러주세요. 개발이 시작되지 않았습니다.");
        return;
      }
      if (!isProgressComplete()) {
        const currentProgress = Number(ideaData?.ideaprogress) || 0;
        alert(
          `진행율이 100%가 되어야 개발 완료할 수 있습니다. (현재 진행율: ${currentProgress}%)`
        );
        return;
      }
    }

    // id가 없으면 에러 처리
    if (!id) {
      setError("아이디어 ID가 없습니다.");
      return;
    }

    // 개발 환경 선택 모달 표시
    setShowEnvironmentModal(true);
  };

  const handleEnvironmentComplete = async () => {
    if (!selectedEnvironment) {
      alert("개발 환경을 선택해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 아이디어 상태를 "개발완료"로 업데이트
      const response = await axios.put(`/api/ideas/status/${id}`, {
        status: "개발완료",
        environment: selectedEnvironment, // 선택된 개발 환경도 함께 전송
      });

      console.log("API 응답:", response.data);

      // 성공적으로 업데이트 후 모달 닫기
      setLoading(false);
      alert("개발 상태가 변경되었습니다.");
      setShowEnvironmentModal(false);
      onClose();

      // 필요한 경우 페이지 리로드 또는 상태 업데이트
      window.location.reload();
    } catch (error) {
      console.error("개발 상태 업데이트 오류:", error);
      setLoading(false);
      setError(`개발 상태 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const handleEnvironmentCancel = () => {
    setShowEnvironmentModal(false);
    setSelectedEnvironment("");
    // 취소 시 상태는 '개발중'으로 유지하고 첫 번째 모달도 함께 닫기
    onClose();
  };

  return (
    <>
      <div
        className="developModalOverlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modalContent">
          <div className="titleBox">
            <h2>개발 완료</h2>
            <CloseIcon className="closeIcon" onClick={onClose} />
          </div>

          <div className="containerBox">
            <div className="textBox">
              <p>과제 개발을 완료하시겠습니까?</p>

              {/* 개발 상태 정보 표시 */}
              <div
                className="statusInfo"
                style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}
              >
                <div>
                  진행율: {ideaData?.ideaprogress || 0}%{" "}
                  {isProgressComplete() ? "✓" : "✗"}
                </div>
              </div>

              {!canCompleteDevelopment() && (
                <div
                  className="warningMessage"
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffeaa7",
                    borderRadius: "4px",
                    fontSize: "13px",
                    color: "#856404",
                  }}
                >
                  ⚠️ 개발 완료 조건: 진행율 100% 달성
                </div>
              )}
            </div>
            <div className="idNo">
              <span>ID - </span>
              <span> {id}</span>
            </div>

            {error && <div className="errorMessage">{error}</div>}

            <div className="buttonBox">
              <button
                className="cancelButton"
                onClick={onClose}
                disabled={loading}
              >
                취소
              </button>
              <button
                className="completeButton"
                onClick={handleComplete}
                disabled={
                  loading ||
                  !id ||
                  checkingPermission ||
                  checkingProgress ||
                  !hasEditPermission() ||
                  !canCompleteDevelopment()
                }
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "완료"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 개발 환경 선택 모달 */}
      {showEnvironmentModal && (
        <div
          className="developModalOverlay"
          onClick={(e) =>
            e.target === e.currentTarget && handleEnvironmentCancel()
          }
        >
          <div className="modalContent">
            <div className="titleBox">
              <h2>개발 환경 선택</h2>
              <CloseIcon
                className="closeIcon"
                onClick={handleEnvironmentCancel}
              />
            </div>

            <div className="containerBox">
              <div className="textBox">
                <p>개발 환경을 선택 해 주세요.</p>
                <p className="notice-text">
                  SKO서버, 로컬 환경에서 개발 하신 경우 보안 진단을 필수로 시행
                  해 주셔야합니다.
                  <br />
                  (ID CUBE 환경은 보안진단 단계는 건너뜁니다.) <br />
                  ※ 개발 환경을 선택하지 않으시면 개발 완료 처리가 되지
                  않습니다. <br />
                  <br />○ 보안 진단 문의 : 경영기획팀 김동희님
                </p>
              </div>

              <div className="environmentSelection">
                <FormControl component="fieldset">
                  <RadioGroup
                    value={selectedEnvironment}
                    onChange={(e) => setSelectedEnvironment(e.target.value)}
                  >
                    <FormControlLabel
                      value="ID_CUBE"
                      control={<Radio />}
                      label="ID CUBE"
                    />
                    <FormControlLabel
                      value="SKO_LOCAL"
                      control={<Radio />}
                      label="SKO서버 or 로컬 환경"
                    />
                  </RadioGroup>
                </FormControl>
              </div>

              {error && <div className="errorMessage">{error}</div>}

              <div className="buttonBox">
                <button
                  className="cancelButton"
                  onClick={handleEnvironmentCancel}
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  className="completeButton"
                  onClick={handleEnvironmentComplete}
                  disabled={loading || !selectedEnvironment}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "완료"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IdeaDevelop;
