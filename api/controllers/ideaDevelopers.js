import { db } from "../db.js";
import { mssql } from "../db.js";

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
and A.UseYN LIKE 'Y';
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

// 개발자 목록 조회
export const getIdeaDevelopers = async (req, res) => {
  try {
    // MySQL에서 개발자 기본 정보 가져오기
    const mysqlQuery = `SELECT * FROM special.ITAsset_ideaDevelopers ORDER BY id ASC`;

    db.query(mysqlQuery, async (err, mysqlData) => {
      if (err) {
        console.error("MySQL 개발자 목록 조회 오류:", err);
        return res.status(500).json({ error: err.message });
      }

      // 데이터가 없는 경우 빈 배열 반환
      if (!mysqlData || mysqlData.length === 0) {
        console.log("개발자 목록이 비어 있습니다.");
        return res.status(200).json([]);
      }

      console.log("MySQL 데이터:", JSON.stringify(mysqlData, null, 2));

      try {
        // n_id 값들을 추출
        const nIds = mysqlData.map((dev) => dev.n_id).filter((id) => id);
        console.log("추출된 n_id 목록:", nIds);

        if (nIds.length === 0) {
          // n_id가 없는 경우, MySQL 데이터만 반환
          console.log("n_id가 없어서 MySQL 데이터만 반환합니다.");
          return res.status(200).json(mysqlData);
        }

        // MSSQL에서 해당 n_id에 맞는 사용자 정보 조회
        const mssqlQuery = `
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
          WHERE A.EmpNo IN (${nIds.map((id) => `'${id}'`).join(",")})
          AND A.UseYN LIKE 'Y'
        `;

        console.log("MSSQL 쿼리:", mssqlQuery);

        // MSSQL 연결 및 쿼리 실행
        const pool = await mssql.connect();
        const result = await pool.request().query(mssqlQuery);
        const mssqlData = result.recordset;

        console.log("MSSQL 데이터:", JSON.stringify(mssqlData, null, 2));

        // 두 데이터 조합
        const combinedData = mysqlData.map((mysqlDev) => {
          // 일치하는 MSSQL 데이터 찾기
          const mssqlDev = mssqlData.find(
            (mssqlItem) => mssqlItem.EmpNo === mysqlDev.n_id
          );

          console.log(
            `MySQL 데이터 ID ${mysqlDev.id}의 n_id: ${mysqlDev.n_id}, MSSQL 매칭 여부:`,
            mssqlDev ? "매칭됨" : "매칭 없음"
          );

          if (mssqlDev) {
            // MSSQL 데이터가 있으면 정보 업데이트
            return {
              ...mysqlDev,
              name: mssqlDev.Name || mysqlDev.name,
              team: mssqlDev.team || mysqlDev.team,
              headqt: mssqlDev.headqt || mysqlDev.headqt || null,
            };
          }

          // MSSQL 데이터가 없으면 원래 데이터 유지
          return mysqlDev;
        });

        console.log("최종 조합 데이터:", JSON.stringify(combinedData, null, 2));
        return res.status(200).json(combinedData);
      } catch (mssqlErr) {
        console.error("MSSQL 연결 또는 조회 오류:", mssqlErr);
        // MSSQL 오류가 발생해도 MySQL 데이터는 반환
        return res.status(200).json(mysqlData);
      }
    });
  } catch (error) {
    console.error("개발자 목록 조회 오류:", error);
    return res.status(500).json({ error: error.message });
  }
};

// 개발 심의 데이터 조회
export const getIdeaDevReviewById = (req, res) => {
  const ideaId = req.params.idea_id;
  // console.log("개발 심의 데이터 조회 요청 (idea_id):", ideaId);

  if (!ideaId) {
    return res.status(400).json({ error: "아이디어 ID가 필요합니다." });
  }

  const q = `SELECT * FROM special.ITAsset_ideaDevReview WHERE idea_id = ?`;
  // console.log("실행 쿼리:", q);
  // console.log("쿼리 파라미터:", ideaId);

  try {
    db.query(q, [ideaId], (err, data) => {
      if (err) {
        // console.error("개발 심의 데이터 조회 오류:", err);
        return res.status(500).json({
          error: err.message,
          sqlMessage: err.sqlMessage,
          code: err.code,
        });
      }

      if (!data || data.length === 0) {
        // console.log("데이터가 없음: idea_id =", ideaId);
        return res
          .status(404)
          .json({ message: "개발 심의 데이터를 찾을 수 없습니다." });
      }

      // 개발자 목록, 일정, 우선순위 정보 구성
      const developers = data.map((dev) => ({
        id: dev.id,
        no: dev.n_id,
        name: dev.name,
        team: dev.team,
        headqt: dev.headqt,
      }));

      // 첫 번째 레코드에서 일정과 우선순위 정보 추출
      const firstRecord = data[0];
      const scheduleInfo = {
        startDate: firstRecord.devScheduleStart,
        endDate: firstRecord.devScheduleEnd,
        priority: firstRecord.priority,
      };

      const result = {
        ideaId: parseInt(ideaId),
        developers: developers,
        schedule: scheduleInfo,
        // 원본 데이터도 포함
        rawData: data,
      };

      // console.log("개발 심의 데이터 조회 성공:", result);
      return res.status(200).json(result);
    });
  } catch (error) {
    // console.error("예상치 못한 에러:", error);
    return res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
  }
};

// 개발 심의 데이터 등록
export const registerIdeaDevReview = (req, res) => {
  console.log("개발 심의 데이터 등록 요청:", req.body);

  const {
    ideaID, // 아이디어 ID
    developers, // 선택된 개발자 목록 (배열) - 이제 개발자 상세 정보가 포함됨
    startDate, // 시작일자
    endDate, // 종료일자
    priority, // 우선순위
    isUpdate, // 업데이트 여부
    deleteBeforeInsert, // 기존 데이터 삭제 후 신규 등록 여부
  } = req.body;

  // 필드 이름 한글 매핑
  const fieldNameMap = {
    ideaID: "아이디어 ID",
    developers: "개발자 목록",
    startDate: "시작일자",
    endDate: "종료일자",
    priority: "우선순위",
  };

  // 필수 필드 검증
  const requiredFields = [
    "ideaID",
    "developers",
    "startDate",
    "endDate",
    "priority",
  ];

  // 누락된 필드 검사
  const missingFields = requiredFields.filter((field) => {
    const value = req.body[field];
    return (
      value === undefined ||
      value === null ||
      (field === "developers" &&
        (!Array.isArray(value) || value.length === 0)) ||
      (field !== "developers" && value === "")
    );
  });

  if (missingFields.length > 0) {
    // 한글 필드명으로 변환
    const missingFieldsKorean = missingFields.map(
      (field) => fieldNameMap[field] || field
    );

    console.log(`누락된 필드 발견: ${missingFieldsKorean.join(", ")}`);

    return res.status(400).json({
      error: "모든 필드를 입력해주세요",
      missingFields: missingFieldsKorean,
    });
  }

  if (developers.length === 0) {
    return res.status(400).json({
      error: "개발자를 한 명 이상 선택해주세요.",
    });
  }

  try {
    // isUpdate와 deleteBeforeInsert가 true이면 기존 데이터 삭제 후 새로 등록
    if (isUpdate && deleteBeforeInsert) {
      console.log(
        `아이디어 ID(${ideaID})에 대한 기존 개발심의 데이터를 삭제 후 새로 등록합니다.`
      );

      // 트랜잭션 시작
      db.beginTransaction((err) => {
        if (err) {
          console.error("트랜잭션 시작 오류:", err);
          return res.status(500).json({ error: err.message });
        }

        // 1. 해당 아이디어 ID에 대한 기존 개발심의 데이터 모두 삭제
        const deleteQuery =
          "DELETE FROM special.ITAsset_ideaDevReview WHERE idea_id = ?";
        db.query(deleteQuery, [ideaID], (deleteErr, deleteResult) => {
          if (deleteErr) {
            // 삭제 중 오류 발생 시 롤백
            return db.rollback(() => {
              console.error("기존 데이터 삭제 오류:", deleteErr);
              res.status(500).json({ error: deleteErr.message });
            });
          }

          console.log(
            `${deleteResult.affectedRows}개의 기존 개발심의 데이터가 삭제되었습니다.`
          );

          // 2. 새로운 개발자 데이터 등록
          const insertPromises = developers.map((developer) => {
            return new Promise((resolve, reject) => {
              const insertReviewQuery = `
                INSERT INTO special.ITAsset_ideaDevReview (
                  idea_id, 
                  n_id, 
                  name, 
                  team, 
                  headqt, 
                  devScheduleStart, 
                  devScheduleEnd, 
                  priority
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `;

              const reviewValues = [
                ideaID,
                developer.no, // 프론트엔드에서 n_id는 'no'로 매핑됨
                developer.name || "",
                developer.team || "",
                developer.headqt || "",
                startDate,
                endDate,
                priority,
              ];

              db.query(
                insertReviewQuery,
                reviewValues,
                (insertErr, insertResult) => {
                  if (insertErr) {
                    reject(insertErr);
                  } else {
                    resolve(insertResult);
                  }
                }
              );
            });
          });

          // 3. 모든 개발자 정보 등록 후
          Promise.all(insertPromises)
            .then((results) => {
              // 아이디어 상태 업데이트 (개발심의 완료 상태로 변경)
              const updateIdeaStatusQuery = `
                UPDATE special.ITAsset_ideas 
                SET status = '개발심의' 
                WHERE id = ?
              `;

              db.query(
                updateIdeaStatusQuery,
                [ideaID],
                (updateErr, updateData) => {
                  if (updateErr) {
                    // 상태 업데이트 실패 시 롤백
                    return db.rollback(() => {
                      console.error("아이디어 상태 업데이트 오류:", updateErr);
                      res.status(500).json({ error: updateErr.message });
                    });
                  }

                  // 모든 작업 성공 시 커밋
                  db.commit((commitErr) => {
                    if (commitErr) {
                      return db.rollback(() => {
                        console.error("커밋 오류:", commitErr);
                        res.status(500).json({ error: commitErr.message });
                      });
                    }

                    console.log("모든 작업이 성공적으로 완료되었습니다.");
                    return res.status(200).json({
                      message:
                        "개발 심의 정보가 성공적으로 업데이트되었습니다.",
                      ideaID: ideaID,
                      developerCount: developers.length,
                      status: "개발심의",
                    });
                  });
                }
              );
            })
            .catch((promiseErr) => {
              // 개발자 정보 등록 중 오류 발생 시 롤백
              return db.rollback(() => {
                console.error("개발자 정보 등록 오류:", promiseErr);
                res.status(500).json({ error: promiseErr.message });
              });
            });
        });
      });
    } else {
      // 기존 로직: 새로운 데이터 등록만 수행
      const insertPromises = developers.map((developer) => {
        return new Promise((resolve, reject) => {
          // DB 구조에 맞게 수정
          const insertReviewQuery = `
            INSERT INTO special.ITAsset_ideaDevReview (
              idea_id, 
              n_id, 
              name, 
              team, 
              headqt, 
              devScheduleStart, 
              devScheduleEnd, 
              priority
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const reviewValues = [
            ideaID, // ideaID를 DB의 idea_id 필드에 매핑
            developer.no, // 프론트엔드에서 n_id는 'no'로 매핑됨
            developer.name || "", // null이면 빈 문자열 사용
            developer.team || "",
            developer.headqt || "",
            startDate,
            endDate,
            priority,
          ];

          db.query(insertReviewQuery, reviewValues, (err, result) => {
            if (err) {
              console.error(`개발자 심의 정보 등록 오류:`, err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      });

      // 모든 개발자 정보 등록 후
      Promise.all(insertPromises)
        .then((results) => {
          // 아이디어 상태 업데이트 (개발심의 완료 상태로 변경)
          const updateIdeaStatusQuery = `
            UPDATE special.ITAsset_ideas 
            SET status = '개발심의' 
            WHERE id = ?
          `;

          db.query(updateIdeaStatusQuery, [ideaID], (updateErr, updateData) => {
            if (updateErr) {
              console.error("아이디어 상태 업데이트 오류:", updateErr);
              // 상태 업데이트 실패해도 개발심의 데이터는 저장되었으므로 성공 응답
            }

            return res.status(200).json({
              message: "개발 심의 정보가 성공적으로 등록되었습니다.",
              ideaID: ideaID,
              developerCount: developers.length,
              status: "개발심의", // 상태도 함께 반환
            });
          });
        })
        .catch((err) => {
          console.error("개발 심의 정보 등록 중 오류 발생:", err);
          return res.status(500).json({ error: err.message });
        });
    }
  } catch (err) {
    console.error("개발자 정보 처리 중 오류:", err);
    return res.status(500).json({ error: err.message });
  }
};

// 디버그용: MSSQL 데이터 확인 엔드포인트
export const debugMssqlConnection = async (req, res) => {
  try {
    // 테스트 쿼리 실행
    const testQuery = `
      SELECT TOP 10
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
      AND A.UseYN LIKE 'Y'
    `;

    console.log("디버그 MSSQL 테스트 쿼리 실행");

    // MSSQL 연결 및 쿼리 실행
    const pool = await mssql.connect();
    const result = await pool.request().query(testQuery);

    console.log(
      "MSSQL 연결 테스트 성공. 데이터 샘플:",
      JSON.stringify(result.recordset.slice(0, 2), null, 2)
    );

    // MySQL에서 개발자 n_id 목록 가져오기
    db.query(
      `SELECT id, n_id FROM special.ITAsset_ideaDevelopers WHERE n_id IS NOT NULL LIMIT 10`,
      async (err, mysqlData) => {
        if (err) {
          console.error("MySQL 개발자 ID 조회 오류:", err);
          return res.status(500).json({
            message: "MySQL 데이터 조회 실패",
            error: err.message,
            mssqlStatus: "OK",
            mssqlData: result.recordset.slice(0, 5),
          });
        }

        console.log(
          "MySQL 개발자 ID 목록:",
          JSON.stringify(mysqlData, null, 2)
        );

        // n_id 값이 있으면 해당 ID로 MSSQL 조회 테스트
        if (mysqlData && mysqlData.length > 0) {
          const nIds = mysqlData.map((dev) => dev.n_id).filter((id) => id);

          if (nIds.length > 0) {
            try {
              const specificQuery = `
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
              WHERE A.EmpNo IN (${nIds.map((id) => `'${id}'`).join(",")})
            `;

              const specificResult = await pool.request().query(specificQuery);
              console.log(
                "특정 n_id로 조회한 MSSQL 결과:",
                JSON.stringify(specificResult.recordset, null, 2)
              );

              return res.status(200).json({
                message: "데이터베이스 연결 테스트 성공",
                mssqlStatus: "OK",
                mysqlStatus: "OK",
                mssqlGeneralData: result.recordset.slice(0, 3),
                mysqlData: mysqlData,
                specificMssqlQuery: specificQuery,
                specificMssqlData: specificResult.recordset,
                joinSuccess: specificResult.recordset.length > 0,
              });
            } catch (specificErr) {
              console.error("특정 n_id 조회 오류:", specificErr);
              return res.status(200).json({
                message: "일반 MSSQL 조회 성공, 특정 n_id 조회 실패",
                mssqlStatus: "OK",
                mysqlStatus: "OK",
                mssqlData: result.recordset.slice(0, 5),
                mysqlData: mysqlData,
                specificError: specificErr.message,
              });
            }
          }
        }

        return res.status(200).json({
          message: "데이터베이스 연결 테스트 성공",
          mssqlStatus: "OK",
          mysqlStatus: "OK",
          mssqlData: result.recordset.slice(0, 5),
          mysqlData: mysqlData,
        });
      }
    );
  } catch (err) {
    console.error("MSSQL 연결 테스트 오류:", err);
    return res.status(500).json({
      message: "MSSQL 연결 실패",
      error: err.message,
    });
  }
};
