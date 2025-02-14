import { db } from "../db.js";

// 타이핑 데이터 조회
export const getTypingData = (req, res) => {
  const q = `
    SELECT sentence
    FROM special.ITAsset_TypingList
    WHERE category = '01'
    ORDER BY RAND()
    LIMIT 5;
  `;

  db.query(q, req.query, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
