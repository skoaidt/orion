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
  console.log("요청 본문:", req.body);
  // console.log("저장된 결과:", data);
  // 필수 필드 검증
  if (
    !category ||
    !n_id ||
    !averageSPM ||
    !averageAccuracy ||
    !date ||
    !nickName
  ) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  const q = `
    INSERT INTO special.ITAsset_TypingResults 
    (category, n_id, averageSPM, averageAccuracy, date, nickName)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [category, n_id, averageSPM, averageAccuracy, date, nickName];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("타이핑 결과 저장 오류:", err);
      return res.status(500).json({ message: "결과 저장에 실패했습니다." });
    }
    console.log("저장된 결과:", data);
    return res
      .status(200)
      .json({ message: "결과가 성공적으로 저장되었습니다." });
  });
};
