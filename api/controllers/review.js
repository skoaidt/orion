import { db } from "../db.js";

//댓글 등록하기
export const reviewReg = (req, res) => {
  const { uuid, sol_id, content, date, n_id, n_name, team, headqt } = req.body;
  console.log("date 타입:", typeof req.body.date);
  console.log("DB로 받은 req.body", req.body);
  const insertQuery = `
  INSERT INTO special.ITAsset_reviews
  (
    uuid,
    sol_id,
    content,
    date,
    n_id,
    n_name,
    team,
    headqt
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const fetchNewCommentQuery = `SELECT * FROM special.ITAsset_reviews WHERE id = LAST_INSERT_ID();`;

  const values = [uuid, sol_id, content, date, n_id, n_name, team, headqt];
  db.query(insertQuery, values, (err, data) => {
    if (err) return res.status(500).json(err);
    // return res.status(200).json("댓글이 등록되었습니다.");
    // 삽입된 댓글 정보 조회
    db.query(fetchNewCommentQuery, (fetchErr, fetchResult) => {
      if (fetchErr) {
        console.error(fetchErr);
        return res.status(500).json(fetchErr);
      }

      // 조회된 댓글 정보를 클라이언트에 반환
      return res.status(200).json(fetchResult[0]);
    });
  });
};

// 댓글 가져오기 
export const getReview = (req, res) => {
  const sol_id = req.query.sol_id;
  const q = `
    SELECT * 
    FROM 
      special.ITAsset_reviews 
    WHERE 
      sol_id = ?;
  `;

  db.query(q, [sol_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  })
};

export const deleteReview = (req, res) => {
  console.log("deleteReview 받은 req.params", req.params);
  const uuid = req.params.uuid
  const q = `DELETE FROM special.ITAsset_reviews WHERE uuid = ?`;
  db.query(q, [uuid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '리뷰 삭제 중 오류가 발생했습니다.' });
    }
    // 삭제된 행의 수를 확인합니다.
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: '리뷰가 성공적으로 삭제되었습니다.' });
    } else {
      return res.status(404).json({ message: '삭제할 리뷰를 찾을 수 없습니다.' });
    }
  });
};