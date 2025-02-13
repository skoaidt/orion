import { db } from "../db.js";

// 타이핑 데이터 조회
export const getTypingData = (req, res) => {
  const q = "SELECT * FROM special.ITAsset_TypingList;";
  db.query(q, req.query, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
