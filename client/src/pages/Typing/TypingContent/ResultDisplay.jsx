import React, { useState } from "react";
import { TextField } from "@mui/material";
import axios from "axios";
import "./ResultDisplay.scss";

const ResultDisplay = ({
  selectedTexts,
  spmHistory,
  accuracyHistory,
  averageSPM,
  averageAccuracy,
  resetTest,
  category,
  n_id,
}) => {
  const [nickName, setNickName] = useState("");

  // useEffect(() => {
  //   console.log("ResultDisplay props 확인:", { category, n_id });
  // }, [category, n_id]);

  const handleSaveResult = async () => {
    if (!nickName) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    try {
      const requestData = {
        category,
        n_id,
        averageSPM,
        averageAccuracy,
        date: formattedDate,
        nickName,
      };
      console.log("전송할 데이터:", requestData);
      const response = await axios.post("/api/typings/saveresult", requestData);

      if (response.status === 200) {
        alert("결과가 저장되었습니다.");
        resetTest();
      }
    } catch (error) {
      console.error("결과 저장 실패:", error);
      alert("결과 저장에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="overlay" />
      <div className="resultDisplay">
        <h2>타자 연습 결과</h2>
        <p className="accuracyNote">(정확도 90% 이상인 경우만 기록)</p>

        <div className="nicknameInput">
          <p className="nicknameText">결과 저장</p>
          <TextField
            variant="outlined"
            placeholder="닉네임을 입력하세요"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            fullWidth
          />
          <button className="saveButton" onClick={handleSaveResult}>
            결과 저장
          </button>
        </div>

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
    </>
  );
};

export default ResultDisplay;
