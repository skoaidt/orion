import { db } from "../db.js";

//Solution 등록하기
export const register = (req, res) => {
  const {
    sol_name,
    sol_full_name,
    kor_name,
    n_id,
    url,
    github_url,
    work_field,
    date,
    reg_date,
    imgUrl,
    usedYN,
  } = req.body;
  const q = "SELECT * FROM special.ITAsset_solutiondata WHERE sol_name = ?";


  db.query(q, [sol_name], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length)
      return res.status(409).json("Solution 과제가 이미 있습니다!");

    const insertQuery = `
    INSERT INTO special.ITAsset_solutiondata
    (
      sol_name, 
      sol_full_name, 
      kor_name, 
      n_id, 
      url, 
      github_url, 
      work_field, 
      date, 
      reg_date, 
      img,
      usedYN
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const values = [
      sol_name,
      sol_full_name,
      kor_name,
      n_id,
      url,
      github_url,
      work_field,
      date,
      reg_date,
      imgUrl.filePath, //imgUrl.filePath 단독으로 저장할때는 이걸로 써야함
      usedYN,
    ];

    db.query(insertQuery, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Solution이 등록되었습니다.");
    });
  });
};

// //Solution 불러오기
export const getsolution = (req, res) => {
  const q = `
    SELECT 
      s.id AS id, 
      s.sol_name, 
      s.sol_full_name, 
      s.kor_name, 
      s.n_id, 
      u.name,
      u.team, 
      u.headquarters, 
      s.url, 
      s.github_url, 
      s.work_field, 
      s.reg_date, 
      CONCAT('/', SUBSTRING_INDEX(img, '/', -3)) AS img,
      s.version,
      s.reupdate,
      s.wgroup
    FROM 
      special.ITAsset_solutiondata s 
      LEFT JOIN special.ITAsset_users u ON s.n_id = u.n_id
    WHERE
      s.usedYN = 'Y'
  `;

  db.query(q, req.query, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// // 수정용 Solution 불러오기
export const getmodifysol = (req, res) => {
  const q = `
    SELECT 
      s.id AS id, 
      s.sol_name, 
      s.sol_full_name, 
      s.kor_name, 
      s.n_id, 
      u.name,
      u.team, 
      u.headquarters, 
      s.url, 
      s.github_url, 
      s.work_field, 
      s.reg_date, 
      CONCAT('/', SUBSTRING_INDEX(img, '/', -3)) AS img,
      s.version,
      s.reupdate,
      s.wgroup,
      s.usedYN
    FROM 
      special.ITAsset_solutiondata s 
      LEFT JOIN special.ITAsset_users u ON s.n_id = u.n_id
  `;

  db.query(q, req.query, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//WorkFld 기준으로 불러오기
export const getWorkfld = (req, res) => {
  let q = `
    SELECT 
      s.id, 
      s.sol_name, 
      s.sol_full_name, 
      s.kor_name, 
      s.n_id, 
      u.name,
      u.team, 
      u.headquarters, 
      s.url, 
      s.github_url, 
      s.work_field,
      CONCAT('/', SUBSTRING_INDEX(img, '/', -3)) AS img 
    FROM 
      special.ITAsset_solutiondata s 
      LEFT JOIN special.ITAsset_users u ON s.n_id = u.n_id
    WHERE
      s.usedYN = 'Y'
  `;
  let queryParams = [];

  if (req.query.work_field) {
    q += ` AND s.work_field = ?`;
    queryParams.push(req.query.work_field);
  }
  db.query(q, queryParams, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//Product 불러오기
export const getproduct = (req, res) => {
  // console.log("getproduct : ", req.params.id)
  const q = `
    SELECT 
      s.id AS id, 
      s.sol_name, 
      s.sol_full_name, 
      s.kor_name, 
      s.n_id, 
      u.name,
      u.team, 
      u.headquarters, 
      s.url, 
      s.github_url, 
      s.work_field, 
      s.reg_date, 
      s.direc,
      s.target,
      s.effect,
      CONCAT('/', SUBSTRING_INDEX(img, '/', -3)) AS img,
      s.version,
      s.reupdate
    FROM 
      special.ITAsset_solutiondata s 
      LEFT JOIN special.ITAsset_users u ON s.n_id = u.n_id 
    WHERE 
      s.id = ? AND s.usedYN = 'Y'
    `;
  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }

    // console.log("getproduct data : ", data);
    return res.status(200).json(data);
  });
};

// Solutions - Update 세부내역 입력하기
export const updateSolDesc = (req, res) => {
  const postId = req.params.id;
  const q = `
    UPDATE special.ITAsset_solutiondata
    SET 
      direc = ?,
      target = ?,
      effect = ?
    WHERE 
      id = ?`;
  const values = [req.body.direc, req.body.target, req.body.effect, postId];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Solution을 업데이트 하였습니다.");
  });
};

// Solutions - 부가 내용 수정하기
export const updateSoletc = (req, res) => {
  console.log("solution 부가내용수정 req.body : ", req.body);
  const postId = req.params.id;
  const q = `
  UPDATE special.ITAsset_solutiondata
  SET 
    sol_name = ?,
    sol_full_name = ?,
    kor_name = ?,
    work_field = ?,
    url = ? ,
    github_url = ?,
    version = ?,
    reupdate = ?,
    reg_date = ?,
    img = COALESCE(?, img),
    usedYN = ? 
  WHERE 
    id = ?
  `;
  const values = [
    req.body.sol_name,
    req.body.sol_full_name,
    req.body.kor_name,
    req.body.work_field,
    req.body.url,
    req.body.github_url,
    req.body.version,
    req.body.reupdate,
    req.body.reg_date,
    req.body.imgUrl?.filePath || null,
    req.body.usedYN,
    postId,
  ];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Solution 부가내용을 업데이트 하였습니다.");
  });
};

// 좋아요 수 가져오기
export const getLikes = (req, res) => {
  const id = req.params.id;
  const q = "SELECT likeCnt FROM special.ITAsset_solutiondata WHERE id = ?";
  db.query(q, [id], (err, result) => {
    if (err) {
      console.error("좋아요 수 조회 중 오류 발생: ", err);
      return res.status(500).json({ error: "서버 오류" });
    }
    // 조회 성공
    if (result.length > 0) {
      res.json({ likeCnt: result[0].likeCnt });
    } else {
      res.status(404).json({ message: "Solution을 찾을 수 없습니다." });
    }
  });
};

// 좋아요 업데이트 하기 : put 설정 했던 값
// export const likes = (req, res) => {
//   // console.log("likes 들어온 req.params", req.params);
//   // console.log("likes 들어온 req.body", req.body);
//   const id = req.params.id;
//   const likeCnt = req.body.likeCnt;
//   // console.log("likeCnt 값은? ", likeCnt);
//   const q = "UPDATE special.ITAsset_solutiondata SET  likeCnt = ? WHERE  id =? ";
//   db.query(q, [likeCnt, id], (err, result) => {
//     if (err) {
//       console.error("쿼리 실행 에러:", err);
//       return res.status(500).json({ error: err.message });
//     }
//     return res.json({ message: "좋아요 수 업데이트 성공", likeCnt });
//   });
// }
export const likes = (req, res) => {
  const id = req.params.id;
  const updateQuery =
    "UPDATE special.ITAsset_solutiondata SET likeCnt = likeCnt + 1 WHERE id = ?";
  db.query(updateQuery, [id], (updateErr, updateResult) => {
    if (updateErr) {
      console.error("쿼리 실행 에러:", updateErr);
      return res.status(500).json({ error: updateErr.message });
    }

    // 업데이트 성공 후 좋아요 수 조회
    const selectQuery =
      "SELECT likeCnt FROM special.ITAsset_solutiondata WHERE id = ?";
    db.query(selectQuery, [id], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("좋아요 수 조회 중 오류 발생: ", selectErr);
        return res.status(500).json({ error: "서버 오류" });
      }
      if (selectResult.length > 0) {
        res.json({ likeCnt: selectResult[0].likeCnt });
      } else {
        res.status(404).json({ message: "Solution을 찾을 수 없습니다." });
      }
    });
  });
};

// 솔루션 접속건수 저장
export const solutionLike = (req, res) => {
  const { sol_id, n_id, n_name, team, headqt, date, category } = req.body;
  // console.log("solutionLike API로 들어온 req : ", req.body);

  // 좋아요(category가 'like'인 경우)만 중복 체크
  if (category === "like") {
    const checkQuery = `SELECT * FROM special.ITAsset_like WHERE sol_id = ? AND n_id = ? AND category = ?`;
    const values = [sol_id, n_id, n_name, team, headqt, date, category];

    db.query(checkQuery, [sol_id, n_id, category], (checkErr, checkResult) => {
      if (checkErr) return res.status(500).json(checkErr);
      if (checkResult.length > 0) {
        return res.status(400).json({ message: "이미 좋아요를 누르셨습니다." });
      }
      const insertQuery = `
        INSERT INTO special.ITAsset_like (sol_id, n_id, n_name, team, headqt, date, category)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertQuery, values, (insertErr, insertResult) => {
        if (insertErr) return res.status(500).json(insertErr);
        return res.status(200).json({ message: "좋아요가 저장되었습니다." });
      });
    });
  } else {
    const insertQuery = `
      INSERT INTO special.ITAsset_like (sol_id, n_id, n_name, team, headqt, date, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [sol_id, n_id, n_name, team, headqt, date, category];

    db.query(insertQuery, values, (insertErr, insertResult) => {
      if (insertErr) return res.status(500).json(insertErr);
      return res.status(200).json({ message: "접속 로그가 저장되었습니다." });
    });
  }
};

// 좋아요수 Count 하기
export const getSolutionLikes = (req, res) => {
  const { sol_id } = req.query;

  // console.log("API로 들어온 req : ", req.query);
  const q = `SELECT COUNT(*) AS likeCnt FROM special.ITAsset_like WHERE sol_id = ? AND category = 'like';`;
  db.query(q, [sol_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ likeCnt: data[0].likeCnt });
  });
};

// 좋아요 + 접속건수 Count 하기
export const getTopLikedSolutions = (req, res) => {
  const { sol_id } = req.query;

  // console.log("API로 들어온 req : ", req.query);
  const q = `
    SELECT s.id AS id, 
      s.sol_name, 
      s.sol_full_name, 
      s.kor_name, 
      s.n_id, 
      s.url, 
      s.github_url, 
      s.work_field, 
      s.reg_date, 
      CONCAT('/', SUBSTRING_INDEX(img, '/', -3)) AS img ,
      (SELECT COUNT(*) FROM special.ITAsset_like WHERE sol_id = s.id) AS likeCnt
    FROM special.ITAsset_solutiondata s
    ORDER BY likeCnt DESC
    LIMIT 4;
  `;
  db.query(q, [sol_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// 좋아요 check
export const checkSolutionLike = (req, res) => {
  const { sol_id, n_id } = req.query;

  const q = `SELECT * FROM special.ITAsset_like WHERE sol_id = ? AND n_id = ? AND category = 'like'`;
  db.query(q, [sol_id, n_id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) {
      return res.status(200).json({ liked: true });
    }
    return res.status(200).json({ liked: false });
  });
};

// FileUpload.jsx 파일 업로드 로직  [req.body.imgUrl, req.body.date]
export const fileupload = (req, res) => {
  // const sql = 'INSERT INTO special.ITAsset_filetest (`file`,`date`) VALUES (?,?)';
  const { filePath, date } = req.body;
  console.log("DB로 응답받은 내용: ", req.body);
  const sql =
    "INSERT INTO special.ITAsset_filetest (`file`,`date`) VALUES (?,?)";
  db.query(sql, [filePath, date], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving file path to database");
    }
    res.send("File uploaded and path saved to database");
  });
};
