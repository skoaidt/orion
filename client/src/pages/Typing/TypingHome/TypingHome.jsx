import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import TypingContent from "../TypingContent/TypingContent";
import RankingTable from "../Ranking/Ranking";
import typingRank from "../typingRank.json"; // typingRank.json 파일이 존재한다고 가정
import "./TypingHome.scss";

const ACCURACY_THRESHOLD = 90; // 정확도 기준값 (%)

const TypingHome = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  // 화면 초기화 설정
  useEffect(() => {
    const appElement = document.querySelector(".app");
    const mainElement = document.querySelector(".main");

    if (appElement && mainElement) {
      appElement.classList.add("typing-active");
      mainElement.classList.add("typing-active");
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => {
      if (appElement && mainElement) {
        appElement.classList.remove("typing-active");
        mainElement.classList.remove("typing-active");
      }
    };
  }, []);

  // 타이핑 관련 상태
  const [inputText, setInputText] = useState("");
  const [targetText, setTargetText] = useState("");

  // 성능 측정 관련 상태
  const [spm, setSpm] = useState(0);
  const [spmHistory, setSpmHistory] = useState([]);
  const [accuracyHistory, setAccuracyHistory] = useState([]);
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

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 타이머 ID 상태
  const [timerId, setTimerId] = useState(null);

  // 문장 데이터 가져오기 함수 정의
  const fetchSentences = useCallback(async () => {
    try {
      const response = await axios.get(`/api/typings/typingdata`, {
        params: { category },
      });
      const data = response.data;
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("선택한 카테고리에 해당하는 문장이 없습니다.");
      }
      setSelectedTexts(data.map((item) => item.sentence).slice(0, 5));
      setTargetText(data[0].sentence);
      setCurrentTextIndex(0);
      console.log("Fetched sentences:", data);
    } catch (error) {
      console.error("문장 데이터를 가져오는 데 실패했습니다:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  // 문장 데이터 가져오기
  useEffect(() => {
    fetchSentences();
  }, [fetchSentences]);

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
      // 타이머 시작 로직을 여기에 추가
      const startTime = Date.now();
      const timer = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      // 타이머 ID 저장
      setTimerId(timer);
    }
  };

  // 리셋 테스트 함수
  const resetTest = useCallback(async () => {
    setInputText("");
    setIsStarted(false);
    setElapsedTime(0);
    setSpm(0);
    setAccuracy(0);
    setIsCompleted(false);
    setSpmHistory([]);
    setAccuracyHistory([]);
    setSelectedTexts([]);
    setCurrentTextIndex(0);
    clearInterval(timerId);
    setTimerId(null);

    await fetchSentences(); // 새로운 문장 데이터 가져오기
  }, [fetchSentences, timerId]);

  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

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

  // Hooks 호출 후 조건부 반환
  if (isLoading) {
    return <div>로딩 중입니다...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <div className="typingHome">
      <Navbar />
      {/* 타이핑 테스트 영역 */}
      <TypingContent
        inputText={inputText}
        handleChange={handleChange}
        handleKeyDown={handleKeyDown}
        targetText={targetText}
        getHighlightedText={getHighlightedText}
        isCompleted={isCompleted}
        spm={spm}
        accuracy={accuracy}
        averageSPM={averageSPM}
        averageAccuracy={averageAccuracy}
        resetTest={resetTest}
        elapsedTime={elapsedTime}
        currentTextIndex={currentTextIndex}
        selectedTexts={selectedTexts}
        spmHistory={spmHistory}
        accuracyHistory={accuracyHistory}
      />
      {/* 타자 순위표 영역 */}
      <RankingTable typingRank={typingRank} />
    </div>
  );
};

export default TypingHome;
