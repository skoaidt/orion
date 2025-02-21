import { db } from "../db.js";

// 타이핑 데이터 조회
export const getTypingData = (req, res) => {
  const category = req.query.category;
  // const category = "01"; // 카테고리 값을 설정
  console.log("요청된 카테고리:", category);
  const q = `
    SELECT sentence
    FROM special.ITAsset_TypingList
    WHERE category = ?
    ORDER BY RAND()
    LIMIT 5;
  `;

  db.query(q, [category], (err, data) => {
    if (err) {
      console.error("쿼리 에러:", err);
      return res.status(500).json(err);
    }
    console.log("쿼리 결과:", data);
    return res.status(200).json(data);
  });
};

// 타이핑 결과 저장
export const saveTypingResult = (req, res) => {
  const { category, n_id, averageSPM, averageAccuracy, date, nickName } =
    req.body;
  const q = `
    INSERT INTO special.ITAsset_TypingResults
    (category, n_id, averageSPM, averageAccuracy, date, nickName)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  const values = [category, n_id, averageSPM, averageAccuracy, date, nickName];
  db.query(q, values, (err, data) => {
    if (err) {
      console.error("타이핑 결과 저장 오류:", err);
      return res.status(500).json(err);
    }
    console.log("타이핑 결과 저장 성공:", data);
    return res.status(200).json(data);
  });
};
