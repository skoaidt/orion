import React from "react";
import "./ideaDeveloping.scss";

const IdeaDeveloping = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>아이디어 개발중</h2>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default IdeaDeveloping;
