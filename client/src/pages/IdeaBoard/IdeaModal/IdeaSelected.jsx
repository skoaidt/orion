import React from "react";
import "./ideaSelected.scss";

const IdeaSelected = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>아이디어 선정</h2>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default IdeaSelected;
