import React, { useState } from "react";
import "./ideaDevelop.scss";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const IdeaDevelop = ({ onClose, id }) => {
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

      // 아이디어 상태를 "개발중"으로 업데이트
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
              disabled={loading || !id}
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
