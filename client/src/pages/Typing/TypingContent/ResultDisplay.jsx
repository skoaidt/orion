import React from "react";
import "./ResultDisplay.scss";

const ResultDisplay = ({
  selectedTexts,
  spmHistory,
  accuracyHistory,
  averageSPM,
  averageAccuracy,
  resetTest,
}) => {
  return (
    <div className="resultDisplay">
      <h2>타자 연습 결과</h2>
      <p className="accuracyNote">(정확도 90% 이상인 경우만 기록)</p>
      {selectedTexts.map((text, index) => (
        <div key={index} className="resultRow">
          <div className="resultText">{index + 1}번 문장</div>
          <div className="resultStats">
            <span className="statItem">
              <span className="statLabel">타수:</span>
              <span className="statValue">{spmHistory[index] || 0}타</span>
            </span>
            <span className="statItem">
              <span className="statLabel">정확도:</span>
              <span className="statValue">{accuracyHistory[index] || 0}%</span>
            </span>
          </div>
        </div>
      ))}
      <div className="resultRow average">
        <div className="resultText">전체 평균</div>
        <div className="resultStats">
          <span className="statItem">
            <span className="statLabel">타수:</span>
            <span className="statValue">{averageSPM}타</span>
          </span>
          <span className="statItem">
            <span className="statLabel">정확도:</span>
            <span className="statValue">{averageAccuracy}%</span>
          </span>
        </div>
      </div>
      <button className="typingButton" onClick={resetTest}>
        다시 시작
      </button>
    </div>
  );
};

export default ResultDisplay;
