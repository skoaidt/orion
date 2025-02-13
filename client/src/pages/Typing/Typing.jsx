import React, { useCallback, useEffect, useState, useMemo } from "react";
import "./typing.scss";
import typingList from "./typingList.json";
import typingRank from "./typingRank.json";
import {
  LinearProgress,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
// 상수 정의
const ACCURACY_THRESHOLD = 90; // 정확도 기준값 (%)

const Typing = () => {
  useEffect(() => {
    const appElement = document.querySelector(".app");
    const mainElement = document.querySelector(".main");

    appElement.classList.add("typing-active");
    mainElement.classList.add("typing-active");

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => {
      appElement.classList.remove("typing-active");
      mainElement.classList.remove("typing-active");
    };
  }, []);
  // 타이핑 관련
  const [inputText, setInputText] = useState("");
  const [targetText, setTargetText] = useState("");

  // 성능 측정 관련
  const [spm, setSpm] = useState(0);
  const [spmHistory, setSpmHistory] = useState([]); // 각 문장별 타수 기록
  const [accuracyHistory, setAccuracyHistory] = useState([]); // 각 문장별 정확도 기록
  const [accuracy, setAccuracy] = useState(0);

  // 상태관리
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 문장관리
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // 평균 타수 계산
  const averageSPM = useMemo(() => {
    if (spmHistory.length === 0) return 0;
    return Math.round(
      spmHistory.reduce((a, b) => a + b, 0) / spmHistory.length
    );
  }, [spmHistory]);

  // 평균 정확도 계산
  const averageAccuracy = useMemo(() => {
    if (accuracyHistory.length === 0) return 0;
    return Math.round(
      accuracyHistory.reduce((a, b) => a + b, 0) / accuracyHistory.length
    );
  }, [accuracyHistory]);

  // 결과 표시 컴포넌트
  const ResultDisplay = () => {
    if (!isCompleted) return null;

    return (
      <div className="resultDisplay">
        <h2>타자 연습 결과</h2>
        <p className="accuracyNote">
          (정확도 {ACCURACY_THRESHOLD}% 이상인 경우만 기록)
        </p>
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
                <span className="statValue">
                  {accuracyHistory[index] || 0}%
                </span>
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

  // 순위표 컴포넌트 수정
  const RankingTable = () => {
    const top10 = typingRank.slice(0, 10);
    return (
      <div className="rankingTable">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="ranking-content"
            id="ranking-header"
          >
            <Typography
              variant="h6"
              style={{ color: "#484848", fontSize: "20px", fontWeight: "200" }}
            >
              Typing Ranking
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <table>
              <thead>
                <tr>
                  <th>NO</th>
                  <th>Name</th>
                  <th>타수</th>
                  <th>정확도</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {top10.map((rank, index) => (
                  <tr key={index}>
                    <td>{index === 0 ? "👑" : index + 1}</td>
                    <td>{rank.name}</td>
                    <td>{rank.avgSpm}</td>
                    <td>{rank.avgAccuracy}%</td>
                    <td>{rank.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  };

  // 초기 랜덤 5개 문장 선택
  useEffect(() => {
    console.log("=== 초기화 시작 ===");
    // 이미 초기화되었는지 확인
    if (selectedTexts.length > 0) {
      console.log("이미 초기화됨, 건너뜀");
      return;
    }

    const shuffled = [...typingList.sentences].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    console.log("선택된 5개 문장:", selected);
    setSelectedTexts(selected);
    setTargetText(selected[0]);
    setCurrentTextIndex(0);
    console.log("=== 초기화 완료 ===");
  }, [selectedTexts.length]);

  // 타수 계산 로직
  const calculateSPM = useCallback(() => {
    if (elapsedTime > 0 && !isCompleted) {
      // 정확도가 기준값 이상일 때만 타수 계산
      if (accuracy >= ACCURACY_THRESHOLD) {
        const totalStrokes = inputText.split("").reduce((acc, char) => {
          if (/[가-힣]/.test(char)) {
            const charCode = char.charCodeAt(0) - 0xac00;
            const hasChoseong = Math.floor(charCode / 28 / 21) > 0;
            const hasJungseong = Math.floor((charCode / 28) % 21) > 0;
            const hasJongseong = charCode % 28 > 0;
            return (
              acc +
              (hasChoseong ? 1 : 0) +
              (hasJungseong ? 1 : 0) +
              (hasJongseong ? 1 : 0)
            );
          }
          return acc + 1;
        }, 0);

        const minutesElapsed = elapsedTime / (1000 * 60);
        const strokesPerMinute = totalStrokes / minutesElapsed;
        setSpm(Math.round(strokesPerMinute));
      } else {
        // 정확도가 기준값 미만이면 타수를 0으로 설정
        setSpm(0);
      }
    }
  }, [inputText, elapsedTime, isCompleted, accuracy]);

  // 정확도 계산 함수 수정
  const calculateAccuracy = useCallback(() => {
    if (inputText.length === 0) return 0;

    let correctChars = 0;
    const inputChars = inputText.split("");
    const targetChars = targetText.slice(0, inputText.length).split("");

    inputChars.forEach((char, index) => {
      if (char === targetChars[index]) {
        correctChars++;
      }
    });

    return Math.round((correctChars / inputText.length) * 100);
  }, [inputText, targetText]);

  // 타이머 효과 수정
  useEffect(() => {
    let startTime;
    let animationFrameId;

    const updateTimer = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      setElapsedTime(elapsed);

      if (!isCompleted) {
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    if (isStarted && !isCompleted) {
      animationFrameId = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isStarted, isCompleted]);

  // 타수 계산 효과
  useEffect(() => {
    calculateSPM();
  }, [calculateSPM, inputText]);

  // 정확도 계산을 위한 useEffect 추가
  useEffect(() => {
    setAccuracy(calculateAccuracy());
  }, [calculateAccuracy, inputText]);

  // 타이핑 완료 처리
  const handleComplete = useCallback(() => {
    console.log("=== handleComplete 시작 ===");

    if (currentTextIndex < selectedTexts.length - 1) {
      // 현재 타수와 정확도를 히스토리에 추가
      setSpmHistory((prev) => [...prev, spm]);
      setAccuracyHistory((prev) => [...prev, accuracy]);

      const nextIndex = currentTextIndex + 1;
      const nextText = selectedTexts[nextIndex];

      React.startTransition(() => {
        setTargetText(nextText);
        setCurrentTextIndex(nextIndex);
        setInputText("");
        setIsStarted(false);
        setElapsedTime(0);
        setSpm(0);
        setAccuracy(0);
      });
    } else {
      // 마지막 문장의 타수와 정확도도 기록
      setSpmHistory((prev) => [...prev, spm]);
      setAccuracyHistory((prev) => [...prev, accuracy]);
      setIsCompleted(true);
    }
  }, [currentTextIndex, selectedTexts, spm, accuracy]);

  // 상태 변화 모니터링 (디버깅용)
  useEffect(() => {
    if (targetText && currentTextIndex >= 0) {
      console.log("=== 상태 변경 감지 ===");
      console.log("- currentTextIndex:", currentTextIndex);
      console.log("- targetText:", targetText);
      console.log("- selectedTexts 길이:", selectedTexts.length);
      console.log(
        "- 현재 문장 인덱스의 실제 텍스트:",
        selectedTexts[currentTextIndex]
      );
    }
  }, [currentTextIndex, targetText, selectedTexts]);

  // Enter 키 처리
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        // 입력된 텍스트 길이 확인
        if (inputText.length < targetText.length) {
          console.log("문장을 끝까지 입력해주세요.");
          console.log(
            `현재 입력: ${inputText.length}자 / 목표: ${targetText.length}자`
          );
          return;
        }

        // 정확도 확인
        if (accuracy < ACCURACY_THRESHOLD) {
          console.log(
            `정확도가 ${ACCURACY_THRESHOLD}% 미만입니다. 다시 시도해주세요.`
          );
          console.log(`현재 정확도: ${accuracy}%`);
          return;
        }

        console.log("=== Enter 키 입력 ===");
        console.log("Enter 키 누르기 전 currentTextIndex:", currentTextIndex);
        handleComplete();
      }
    },
    [
      currentTextIndex,
      handleComplete,
      inputText.length,
      targetText.length,
      accuracy,
    ]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputText(newValue);
    if (!isStarted && newValue.length > 0) {
      setIsStarted(true);
    }
  };

  const resetTest = () => {
    setInputText("");
    setIsStarted(false);
    setElapsedTime(0);
    setSpm(0);
    setAccuracy(0);
    setIsCompleted(false);
    const shuffled = [...typingList.sentences].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setSelectedTexts(selected);
    setTargetText(selected[0]);
    setCurrentTextIndex(0);
    setSpmHistory([]);
    setAccuracyHistory([]);
  };

  const getHighlightedText = () => {
    return targetText.split("").map((char, index) => {
      if (index < inputText.length) {
        const isCorrect = char === inputText[index];
        return (
          <span key={index} className={isCorrect ? "correct" : "incorrect"}>
            {isCorrect ? (
              char
            ) : (
              <span className="wrong-text">
                <span className="input-char">{inputText[index]}</span>
                <span className="target-char">{char}</span>
              </span>
            )}
          </span>
        );
      } else if (index === inputText.length) {
        return (
          <span key={index} className="current">
            {char}
          </span>
        );
      } else {
        return (
          <span key={index} className="upcoming">
            {char}
          </span>
        );
      }
    });
  };

  // formatTime 함수 (타이머 표시)
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(1, "0")}`;
  };

  // 시계 아이콘과 시간을 표시하는 컴포넌트
  const TimeDisplay = ({ time }) => {
    return (
      <div className="timeDisplay">
        <span className="icon">⏰</span>
        <span className="statsFont">{formatTime(time)}초</span>
      </div>
    );
  };

  // 진행률 계산
  const progress = Math.min(
    ((currentTextIndex + inputText.length / targetText.length) /
      selectedTexts.length) *
      100,
    100
  );
  return (
    <div className="typing">
      <div className="navbar">
        <Link to="/" className="homeBox">
          <div className="icon">
            <HomeIcon />
          </div>
          <p>Home : Orion으로 이동</p>
        </Link>
      </div>
      {/* 좌측: 타자 테스트 영역 */}
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
          <ResultDisplay />
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

      {/* 우측: 타자 순위표 영역 */}
      <div className="typingRanking">
        <RankingTable />
      </div>
    </div>
  );
};

export default Typing;
