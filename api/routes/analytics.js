import express from "express";
import { db } from "../db.js";
import { mssql } from "../db.js";

const router = express.Router();

// 사용자가 직접 생성한 테이블을 사용하므로 테이블 생성 코드 제거

// 사용자 활동 기록 API
router.post("/track-activity", (req, res) => {
  const { userId, page, timestamp } = req.body;

  console.log("활동 추적 요청:", { userId, page, timestamp });

  // /dashboard 또는 /ideaboard로 시작하는 페이지만 추적
  if (
    !page ||
    !(page.startsWith("/dashboard") || page.startsWith("/ideaboard"))
  ) {
    return res.status(400).json({ message: "추적 대상이 아닌 페이지" });
  }

  // 활동 기록 저장 - 모든 페이지 접속 로그 저장
  const query =
    "INSERT INTO special.ITAsset_ideaLogs (n_id, page, timestamp) VALUES (?, ?, ?)";
  const timestampValue = timestamp ? new Date(timestamp) : new Date();

  console.log("실행할 쿼리:", query);
  console.log("쿼리 파라미터:", [userId, page, timestampValue]);

  db.query(query, [userId, page, timestampValue], (err, result) => {
    if (err) {
      console.error("사용자 활동 저장 오류:", err);
      return res.status(500).json({ message: "서버 오류", error: err.message });
    }

    console.log("활동 기록 저장 성공:", result);
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// MAU 통계 데이터 API
router.get("/mau-stats", (req, res) => {
  console.log("MAU 통계 요청 받음");

  // 현재 날짜 기준 계산
  const now = new Date();

  // 30일 전 날짜 계산 (롤링 30일)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  // 이번 주 시작일 계산 (일요일 기준)
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay()); // 이번 주 일요일로 설정
  thisWeekStart.setHours(0, 0, 0, 0);

  // 지난 주 시작일과 종료일 계산
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setMilliseconds(lastWeekEnd.getMilliseconds() - 1);

  // timestamp 필드가 TIMESTAMP 타입이므로 Date 객체 직접 사용
  console.log("계산된 날짜:", {
    now: now.toISOString(),
    thirtyDaysAgo: thirtyDaysAgo.toISOString(),
    thisWeekStart: thisWeekStart.toISOString(),
    lastWeekStart: lastWeekStart.toISOString(),
  });

  // 롤링 30일 동안의 고유 사용자 수 집계 쿼리 - n_id 컬럼 사용
  const totalMauQuery = `
    SELECT COUNT(DISTINCT n_id) as count 
    FROM special.ITAsset_ideaLogs 
    WHERE timestamp >= ?
  `;

  // 이번 주 고유 사용자 수 집계 쿼리
  const thisWeekQuery = `
    SELECT COUNT(DISTINCT n_id) as count 
    FROM special.ITAsset_ideaLogs 
    WHERE timestamp >= ?
  `;

  // 지난 주 고유 사용자 수 집계 쿼리
  const lastWeekQuery = `
    SELECT COUNT(DISTINCT n_id) as count 
    FROM special.ITAsset_ideaLogs
    WHERE timestamp >= ? AND timestamp < ?
  `;

  // 디버깅을 위한 데이터 조회 쿼리
  const debugQuery =
    "SELECT * FROM special.ITAsset_ideaLogs ORDER BY timestamp DESC LIMIT 10";
  db.query(debugQuery, [], (err, debugResult) => {
    if (err) {
      console.error("디버깅 데이터 조회 오류:", err);
    } else {
      console.log("최근 10개 기록:", debugResult);
    }
  });

  // 병렬로 모든 쿼리 실행
  const promises = [
    new Promise((resolve, reject) => {
      db.query(totalMauQuery, [thirtyDaysAgo], (err, result) => {
        if (err) {
          console.error("totalMauQuery 오류:", err);
          reject(err);
        } else {
          console.log("totalMauQuery 결과:", result);
          resolve(result[0]?.count || 0);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(thisWeekQuery, [thisWeekStart], (err, result) => {
        if (err) {
          console.error("thisWeekQuery 오류:", err);
          reject(err);
        } else {
          console.log("thisWeekQuery 결과:", result);
          resolve(result[0]?.count || 0);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(lastWeekQuery, [lastWeekStart, thisWeekStart], (err, result) => {
        if (err) {
          console.error("lastWeekQuery 오류:", err);
          reject(err);
        } else {
          console.log("lastWeekQuery 결과:", result);
          resolve(result[0]?.count || 0);
        }
      });
    }),
  ];

  Promise.all(promises)
    .then(([totalCnt, thisWeek, lastWeek]) => {
      const responseData = {
        totalCnt,
        thisWeek,
        lastWeek,
      };
      console.log("응답 데이터:", responseData);
      res.json(responseData);
    })
    .catch((error) => {
      console.error("MAU 통계 조회 오류:", error);
      res.status(500).json({ message: "서버 오류", error: error.message });
    });
});

// 접속 횟수 상위 5명의 사용자 조회 API
router.get("/top-users", async (req, res) => {
  console.log("상위 접속자 통계 요청 받음");

  // 일주일 전 날짜 계산
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  console.log("조회 기간:", {
    oneWeekAgo: oneWeekAgo.toISOString(),
    now: new Date().toISOString(),
  });

  // 일주일간 접속 횟수가 가장 많은 상위 5명의 사용자 조회
  const topUsersQuery = `
    SELECT n_id, COUNT(*) as connectCnt
    FROM special.ITAsset_ideaLogs
    WHERE timestamp >= ?
    GROUP BY n_id
    ORDER BY connectCnt DESC
    LIMIT 5
  `;

  try {
    // MySQL에서 접속 횟수 TOP 5 사용자 조회
    db.query(topUsersQuery, [oneWeekAgo], async (err, results) => {
      if (err) {
        console.error("상위 사용자 조회 오류:", err);
        return res
          .status(500)
          .json({ message: "서버 오류", error: err.message });
      }

      console.log("상위 접속자 조회 결과:", results);

      // 사용자 ID 출력
      const userIds = results.map((user) => user.n_id);
      console.log("조회할 사용자 ID 목록:", userIds);

      if (userIds.length === 0) {
        return res.json([]);
      }

      try {
        // ideaDevelopers.js에서 사용하는 방식으로 MSSQL 연결 및 쿼리
        const pool = await mssql.connect();

        // 작은따옴표로 ID를 감싸는 것이 중요함
        const userIdsQuoted = userIds.map((id) => `'${id.toString().trim()}'`);

        // ideaDevelopers.js에서 사용하는 IN 쿼리 형식 적용
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
          WHERE A.DeptCode IS NOT NULL 
            AND A.UseYN LIKE 'Y'
            AND A.EmpNo IN (${userIdsQuoted.join(",")})
        `;

        console.log("MSSQL 쿼리:", mssqlQuery);

        // 쿼리 실행
        const result = await pool.request().query(mssqlQuery);
        console.log("MSSQL 쿼리 결과:", result.recordset);

        // 결과 데이터 구조 확인
        if (result.recordset.length > 0) {
          const sampleRecord = result.recordset[0];
          console.log("MSSQL 결과 샘플 구조:", Object.keys(sampleRecord));
          console.log("MSSQL 결과 샘플 데이터:", sampleRecord);
        }

        // 쿼리 결과 확인
        if (result.recordset.length === 0) {
          console.log(
            "MSSQL에서 사용자 정보를 찾을 수 없음. 기본 정보만 반환합니다."
          );
          const topUsers = results.map((user) => ({
            n_id: user.n_id,
            name: `사용자 ${user.n_id}`,
            team: "소속 미확인",
            connectCnt: user.connectCnt,
          }));

          return res.json(topUsers);
        }

        // ideaDevelopers.js와 동일한 방식으로 사용자 정보 매핑
        const topUsers = results.map((user) => {
          // 각 사용자 ID에 대해 매핑 시도
          const mysqlId = user.n_id.toString().trim();

          // ideaDevelopers.js에서는 EmpNo 필드와 비교함 (필드명 주의)
          const mssqlUser = result.recordset.find(
            (record) =>
              record.EmpNo && record.EmpNo.toString().trim() === mysqlId
          );

          console.log(
            `사용자 ${user.n_id} 매핑 결과:`,
            mssqlUser ? "성공" : "실패"
          );
          if (mssqlUser) {
            console.log(
              `  - MSSQL ID: ${mssqlUser.EmpNo}, 이름: ${mssqlUser.Name}, 팀: ${mssqlUser.team}`
            );
          }

          // ideaDevelopers.js와 동일하게 Name, team 필드를 매핑
          return {
            n_id: user.n_id,
            name: mssqlUser ? mssqlUser.Name : `${user.n_id}`, // MSSQL에서는 Name 필드임
            team: mssqlUser ? mssqlUser.team : "소속 미확인",
            connectCnt: user.connectCnt,
          };
        });

        return res.json(topUsers);
      } catch (mssqlErr) {
        console.error("MSSQL 연결 또는 쿼리 오류:", mssqlErr);

        // MSSQL 연결 실패 시 MySQL 데이터만 반환
        const topUsers = results.map((user) => ({
          n_id: user.n_id,
          name: `사용자 ${user.n_id}`,
          team: "소속 미확인",
          connectCnt: user.connectCnt,
        }));

        return res.json(topUsers);
      }
    });
  } catch (error) {
    console.error("예상치 못한 오류:", error);
    return res.status(500).json({ message: "서버 오류", error: error.message });
  }
});

export default router;
