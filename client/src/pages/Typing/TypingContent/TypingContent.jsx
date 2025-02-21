import React from "react";
import { Box, LinearProgress } from "@mui/material";
import ResultDisplay from "../TypingContent/ResultDisplay";
import TimeDisplay from "../Timedisplay/Timedisplay";
import "./TypingContent.scss";

const TypingContent = ({
  inputText,
  handleChange,
  handleKeyDown,
  targetText,
  getHighlightedText,
  isCompleted,
  spm,
  accuracy,
  averageSPM,
  averageAccuracy,
  resetTest,
  elapsedTime,
  currentTextIndex,
  selectedTexts,
  spmHistory,
  accuracyHistory,
  category,
  n_id,
}) => {
  const progress = Math.min(
    ((currentTextIndex + inputText.length / targetText.length) /
      selectedTexts.length) *
      100,
    100
  );

  return (
    <div className="typingContent">
      <div className="headerWrap">
        <div className="typingTitle">Typing Here !!</div>
        <div className="countWrap">
          {currentTextIndex + 1} / {selectedTexts.length}
        </div>
      </div>

      <div className="typingTextWrapper">
        <div className="targetText">{getHighlightedText()}</div>
        <textarea
          className="typingInput"
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          disabled={isCompleted}
        />
      </div>
      <div className="typingProgress">
        <Box sx={{ width: "100%" }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </div>

      {isCompleted ? (
        <ResultDisplay
          selectedTexts={selectedTexts}
          spmHistory={spmHistory}
          accuracyHistory={accuracyHistory}
          averageSPM={averageSPM}
          averageAccuracy={averageAccuracy}
          resetTest={resetTest}
          category={category}
          n_id={n_id}
        />
      ) : (
        <>
          <div className="typingStats">
            <div className="left">
              <TimeDisplay time={elapsedTime} />
            </div>
            <div className="right">
              <p className="statsFont">타자 속도: {spm} 타</p>
              <p className="statsFont">정확도: {accuracy} %</p>
              <p className="statsFont">평균 속도: {averageSPM} 타</p>
            </div>
          </div>
          <button className="typingButton" onClick={resetTest}>
            Restart
          </button>
        </>
      )}
    </div>
  );
};

export default TypingContent;
