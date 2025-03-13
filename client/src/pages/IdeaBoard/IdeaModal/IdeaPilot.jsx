import React from "react";
import "./ideaPilot.scss";

const IdeaPilot = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>아이디어 Pilot</h2>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default IdeaPilot;
