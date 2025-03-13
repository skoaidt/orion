import React from "react";
import "./ideaDevReview.scss";

const IdeaDevReview = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>아이디어 개발 심의</h2>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default IdeaDevReview