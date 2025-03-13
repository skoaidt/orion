import React from "react";
import "./ideaVerify.scss";

const IdeaVerify = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>아이디어 검증</h2>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default IdeaVerify;
