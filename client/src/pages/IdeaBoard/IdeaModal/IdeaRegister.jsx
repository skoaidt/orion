import React from "react";
import "./ideaRegister.scss"; // 스타일 파일을 추가할 수 있습니다.

const IdeaRegModal = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>아이디어 등록</h2>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default IdeaRegModal;
