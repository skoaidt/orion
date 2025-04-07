import { db } from "../db.js";
import { mssql } from "../db.js";

// 개발자 등록하기
export const registerDev = (req, res) => {
  console.log("백엔드 req.body 받은 내용: ", req.body);
  const { n_id, dev_img, introduction } = req.body;
  const q = "SELECT * FROM special.ITAsset_developer WHERE n_id = ?";

  db.query(q, [n_id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length)
      return res.status(409).json("개발자가 이미 등록 있습니다!");

    const insertQuery = `
      INSERT INTO special.ITAsset_developer
      (
        n_id,
        dev_img,
        introduction
      )
      VALUES (?,?,?)
    `;
    const values = [n_id, dev_img, introduction];
    db.query(insertQuery, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("개발자를 등록하였습니다.");
    });
  });
};

// 개발자 이미지 바꾸기
export const updateDevImg = (req, res) => {
  console.log("개발자 이미지 req.body : ", req.body);
  const q = `
  UPDATE special.ITAsset_developer
  SET dev_img = ?
  WHERE n_id = ?
  `;
  const values = [req.body.dev_img, req.body.n_id];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("개발자 이미지을 업데이트 하였습니다.");
  });
};

// 개발자 소개글 바꾸기
export const updateDevIntro = (req, res) => {
  console.log("개발자 소개글 req.body : ", req.body);
  const q = `
  UPDATE special.ITAsset_developer
  SET introduction = ?
  WHERE n_id = ?;
  `;
  const values = [req.body.introduction, req.body.n_id];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("개발자 소개글을 업데이트 하였습니다.");
  });
};

// 개발자 목록 가져오기
export const getDeveloper = (req, res) => {
  const q = `
    SELECT 
      s.id AS id, s.n_id, u.name, 
      u.team, u.headquarters, s.introduction, 
      CONCAT('/', SUBSTRING_INDEX(s.dev_img, '/', -3)) AS dev_img
    FROM special.ITAsset_developer s
    LEFT JOIN special.ITAsset_users u
    ON s.n_id = u.n_id;
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// // 구성원 목록 가져오기
// export const getUser = (req, res) => {
//   const q = `SELECT * FROM special.ITAsset_users`;
//   db.query(q, (err, data) => {
//     if (err) return res.status(500).json(err);
//     return res.status(200).json(data);
//   })
// };

// 구성원 목록 가져오기
export const getUser = async (req, res) => {
  const q = `
SELECT
	A.EmpNo,
	A.Name,
	B1.DeptName AS headqt,
	B2.DeptName AS team,
	A.UseYN
FROM Common.dbo.TB_ZZ_User AS A
LEFT JOIN Common.dbo.TB_FM_DeptCode AS B1
ON A.PrntDeptCode = B1.DeptCode AND B1.DeptLevel = 1
LEFT JOIN Common.dbo.TB_FM_DeptCode AS B2
ON A.DeptCode = B2.DeptCode AND B2.DeptLevel = 2
WHERE A.DeptCode IS NOT NULL and A.EmpNo LIKE 'N11%'
and A.UseYN LIKE 'Y'
  `;

  try {
    const pool = await mssql.connect(); // MSSQL 연결
    const result = await pool.request().query(q); // 쿼리 실행

    return res.status(200).json(result.recordset); // 결과 반환
  } catch (err) {
    console.error("구성원 목록 가져오기 실패:", err);
    return res.status(500).json({
      message: "구성원 목록을 가져오는 중 오류가 발생했습니다.",
      error: err.message,
    });
  }
};

// Admin 계정 등록하기
export const AdminReg = (req, res) => {
  console.log("백엔드 req.body 받은 내용: ", req.body);
  const { n_id } = req.body;
  const q = "SELECT * FROM special.ITAsset_admin WHERE n_id = ?";

  db.query(q, [n_id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length)
      return res.status(409).json("개발자가 이미 등록 있습니다!");

    const insertQuery = `INSERT INTO special.ITAsset_admin (n_id) VALUES (?)`;
    const values = [n_id];

    db.query(insertQuery, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Admin 계정 등록 완료");
    });
  });
};

// Admin 계정 가져오기
export const getAdmin = (req, res) => {
  const q = `
    SELECT 
      s.n_id,
      u.name,
      u.headquarters,
      u.team
    FROM special.ITAsset_admin s 
    LEFT JOIN special.ITAsset_users u
    ON s.n_id = u.n_id;
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
