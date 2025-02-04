import { db } from "../db.js";

// PNCR 게시글 불러오기
export const getPNCR = (req, res) => {
  const sol_id = req.query.sol_id;
  const q = `
    SELECT 
      id,
      sol_id,
      category,
      title,
      descrip,
      CONCAT(
        SUBSTRING_INDEX(SUBSTRING_INDEX(date, '.', 1), ' ', 1), '-', 
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(date, '.', 2), '.', -1)), '-', 
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(date, '.', 3), '.', -1))
      ) AS date,
      n_id,
      n_name,
      team,
      headqt,
      complete 
    FROM 
      special.ITAsset_PNCR
    WHERE 
      sol_id = ?
    ORDER BY date DESC;
  `;
  db.query(q, [sol_id], (err, data) => {
    if (err) {
      console.error('Error executing query:', err);  // 에러 로그 출력
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });

};

// PNCR 등록하기 
export const pncrReg = (req, res) => {
  const { category, sol_id, title, descrip, date, n_id, n_name, team, headqt, complete } = req.body;
  // console.log("db로 받은 req.body ", req.body);

  const insertQuery = `
  INSERT INTO special.ITAsset_PNCR
  (
    category, 
    sol_id,
    title,
    descrip,
    date,
    n_id,
    n_name,
    team,
    headqt,
    complete
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  const fetchNewContentQuery = 'SELECT * FROM special.ITAsset_PNCR WHERE id = LAST_INSERT_ID()';
  const values = [category, sol_id, title, descrip, date, n_id, n_name, team, headqt, complete];

  db.query(insertQuery, values, (err, data) => {
    if (err) return res.status(500).json(err);

    db.query(fetchNewContentQuery, (fetchErr, fetchResult) => {
      if (fetchErr) {
        console.error(fetchErr);
        return res.status(500).json(fetchErr);
      }

      return res.status(200).json(fetchResult[0]);
    });
  });
};

//PNCR Complete 업데이트 하기 
export const pncrComplete = (req, res) => {
  const id = req.body.id;
  // console.log("db로 넘어온 req.body", req.body);
  const q = `
    UPDATE special.ITAsset_PNCR
    SET 
      complete = ?
    WHERE
      id = ?
  `;
  const values = [req.body.complete, id];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Complete 내역을 업데이트 하였습니다.");
  });
};

//PNCR 내용 수정 하기
export const pncrUpdate = (req, res) => {
  const id = req.body.id;
  // console.log("db로 넘어온 req.body", req.body);
  const q = `
    UPDATE special.ITAsset_PNCR
    SET
      category = ?,
      title = ?,
      descrip = ?
    WHERE
      id = ?
  `;

  const values = [req.body.category, req.body.title, req.body.descrip, id];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("게시글 내용을 수정하였습니다.");
  })
}

// PNCR 게시글 삭제하기
export const pncrDelete = (req, res) => {
  const id = req.params.id;

  const checkQuery = `SELECT * FROM special.ITAsset_PNCR WHERE id = ?`;
  db.query(checkQuery, [id], (checkErr, checkResult) => {
    if (checkErr) return res.status(500).json(checkErr);
    if (checkResult.length === 0) return res.status(404).json("게시글을 찾을 수 없습니다.");

    const deleteQuery = `DELETE FROM special.ITAsset_PNCR WHERE id = ?`;
    db.query(deleteQuery, [id], (deleteErr, deleteResult) => {
      if (deleteErr) return res.status(500).json(deleteErr);
      return res.json("게시글이 삭제되었습니다.");
    });
  });
};

// PNCR 게시글 로그값 저장하기 
export const logPNCRView = (req, res) => {
  const { pncr_id, n_id, n_name, team, headqt, date } = req.body;

  const q = `
    INSERT INTO special.ITAsset_PNCR_ViewLogs (pncr_id, n_id, n_name, team, headqt, date) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(q, [pncr_id, n_id, n_name, team, headqt, date], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json("로그가 저장되었습니다.");
  });
};

// PNCR 조회수 count 
export const pncrCnt = (req, res) => {
  const { pncr_id } = req.query;

  const q = `SELECT COUNT(*) AS pncrCnt FROM special.ITAsset_PNCR_ViewLogs WHERE pncr_id = ? `
  db.query(q, [pncr_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ pncrCnt: data[0].pncrCnt })
  })
}


// PNCR 댓글 달기 
export const getComments = (req, res) => {
  const { pncr_id } = req.params;
  // console.log("PNCR 댓글 달기 req.param: ", pncr_id);
  const q = `SELECT * FROM special.ITAsset_PNCR_Comments WHERE pncr_id = ?`;
  db.query(q, [pncr_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// 댓글 추가
export const addComment = (req, res) => {
  const { pncr_id, n_id, n_name, team, comment, date } = req.body;

  const q = `INSERT INTO special.ITAsset_PNCR_Comments (pncr_id, n_id, n_name, team, comment, date) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(q, [pncr_id, n_id, n_name, team, comment, date], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({ id: data.insertId });
  });
};

// 댓글 삭제
export const deleteComment = (req, res) => {
  const { id } = req.params;

  const q = `DELETE FROM special.ITAsset_PNCR_Comments WHERE id = ?`;
  db.query(q, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json("댓글이 삭제되었습니다.");
  });

};

// 댓글 갯수 카운트
export const countComments = (req, res) => {
  const { pncr_id } = req.params;

  const q = `SELECT COUNT(*) as count FROM special.ITAsset_PNCR_Comments WHERE pncr_id = ?`;
  db.query(q, [pncr_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};