import React from "react";
import "./ideaCompleted.scss";

const IdeaCompleted = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>아이디어 완료</h2>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default IdeaCompleted;
