import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./devStart.scss";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const DevStart = ({ onClose, id, onStartDevelopment }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleComplete = async () => {
    try {
      setLoading(true);
      setError(null);
      // id가 없으면 에러 처리
      if (!id) {
        setLoading(false);
        setError("아이디어 ID가 없습니다.");
        return;
      }

      if (onStartDevelopment) {
        // 부모 컴포넌트에서 전달받은 함수가 있으면 사용
        await onStartDevelopment();
      } else {
        // 기존 방식으로 상태 업데이트
        await axios.put(`/api/ideas/status/${id}`, {
          status: "개발중",
        });

        // 필요한 경우 페이지 리로드
        window.location.reload();
      }

      // 성공적으로 업데이트 후 모달 닫기
      setLoading(false);
      alert("개발 상태가 변경되었습니다.");
      onClose();
    } catch (error) {
      console.error("[개발시작] 오류:", error);
      setLoading(false);
      setError(
        `[개발시작] 상태 업데이트 중 오류가 발생했습니다: ${error.message}`
      );
    }
  };

  return (
    <div
      className="devStartModal"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modalContent">
        <div className="titleBox">
          <h2>개발 시작</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>

        <div className="containerBox">
          <div className="textBox">
            <p>개발과제를 시작하겠습니까?</p>
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
              disabled={loading || !id}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "개발 시작"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevStart;
