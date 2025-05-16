import React, { useState, useContext, useEffect } from "react";
import "./ideaDevelop.scss";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../../../context/authContext";

const IdeaDevelop = ({ onClose, id }) => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [checkingPermission, setCheckingPermission] = useState(true);

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
    console.log("- 선정된 개발자 목록:", developers);

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

    console.log("권한 없음 - 관리자/선정된 개발자가 아님");
    return false;
  };

  const handleComplete = async () => {
    // 권한 확인
    if (!hasEditPermission()) {
      alert(
        "권한이 없습니다. 개발심의 단계에서 선정된 개발자 또는 관리자만 개발 완료 처리할 수 있습니다."
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // id가 없으면 에러 처리
      if (!id) {
        setLoading(false);
        setError("아이디어 ID가 없습니다.");
        return;
      }

      // 아이디어 상태를 "개발완료"로 업데이트
      const response = await axios.put(`/api/ideas/status/${id}`, {
        status: "개발완료",
      });

      console.log("API 응답:", response.data);

      // 성공적으로 업데이트 후 모달 닫기
      setLoading(false);
      alert("개발 상태가 변경되었습니다.");
      onClose();

      // 필요한 경우 페이지 리로드 또는 상태 업데이트
      window.location.reload();
    } catch (error) {
      console.error("개발 상태 업데이트 오류:", error);
      setLoading(false);
      setError(`개발 상태 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
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
                loading || !id || checkingPermission || !hasEditPermission()
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
  );
};

export default IdeaDevelop;
