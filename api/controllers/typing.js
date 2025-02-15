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
