import React from "react";
import "./Timedisplay.scss";

const TimeDisplay = ({ time }) => {
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="timeDisplay">
      <span className="icon">⏰</span>
      <span className="statsFont">{formatTime(time)}초</span>
    </div>
  );
};

export default TimeDisplay;
