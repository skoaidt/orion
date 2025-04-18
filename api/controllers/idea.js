import { db } from "../db.js";
import { mssql } from "../db.js";

// 아이디어 등록하기
export const registerIdea = (req, res) => {
  console.log("아이디어 등록 요청 데이터:", req.body);

  // 필드 이름 한글 매핑 (사용자에게 더 이해하기 쉬운 이름으로 표시)
  const fieldNameMap = {
    title: "제목",
    background: "추진 배경",
    progress: "추진 내역",
    quantitative_effect: "정량적 효과",
    qualitative_effect: "정성적 효과",
    project_type: "과제 유형",
    target_user: "사용 대상",
    business_field: "사업분야",
    job_field: "업무분야",
    usability: "활용도",
    duplication: "중복여부",
    tboh_status: "TBOH 여부",
    use_period: "활용기간",
    use_scope: "사용범위",
    platform: "플랫폼",
    usability_points: "유용성",
    improvement_points: "개선내역",
    VerifyDepartment: "검증 부서",
  };

  const {
    title,
    background,
    progress,
    quantitative_effect,
    qualitative_effect,
    project_type,
    target_user,
    business_field,
    job_field,
    usability,
    duplication,
    tboh_status,
    use_period,
    use_scope,
    platform,
    usability_points,
    improvement_points,
    user_id,
    name,
    prnt_dept_name,
    dept_name,
    VerifyDepartment,
  } = req.body;

  // 모든 필드가 입력되었는지 확인
  const requiredFields = [
    "title",
    "background",
    "progress",
    "quantitative_effect",
    "qualitative_effect",
    "project_type",
    "target_user",
    "business_field",
    "job_field",
    "usability",
    "duplication",
    "tboh_status",
    "use_period",
    "use_scope",
    "platform",
    "usability_points",
    "improvement_points",
    "user_id",
    "name",
    "prnt_dept_name",
    "dept_name",
    "VerifyDepartment",
  ];

  // 누락된 필드 검사 및 빈 문자열 체크
  const missingFields = requiredFields.filter((field) => {
    const value = req.body[field];
    // undefined, null, 빈 문자열 또는 HTML 태그만 있는 경우("<p></p>" 등) 체크
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "string" && value.replace(/<[^>]*>/g, "").trim() === "")
    );
  });

  if (missingFields.length > 0) {
    // 한글 필드명으로 변환하여 응답
    const missingFieldsKorean = missingFields.map(
      (field) => fieldNameMap[field] || field
    );

    console.log(`누락된 필드 발견: ${missingFieldsKorean.join(", ")}`);

    return res.status(400).json({
      error: "모든 필드를 입력해주세요",
      missingFields: missingFieldsKorean,
    });
  }

  const q = `
    INSERT INTO special.ITAsset_ideas (
      title, background, progress, 
      quantitative_effect, qualitative_effect,
      project_type, target_user, business_field, 
      job_field, usability, duplication, 
      tboh_status, use_period, use_scope, 
      platform, usability_points, improvement_points,
      user_id, name, prnt_dept_name, dept_name,
      VerifyDepartment
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const values = [
    title,
    background,
    progress,
    quantitative_effect,
    qualitative_effect,
    project_type,
    target_user,
    business_field,
    job_field,
    usability,
    duplication,
    tboh_status,
    use_period,
    use_scope,
    platform,
    usability_points,
    improvement_points,
    user_id,
    name,
    prnt_dept_name,
    dept_name,
    VerifyDepartment || "",
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("아이디어 등록 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({
      message: "아이디어가 성공적으로 등록되었습니다.",
      ideaId: data.insertId,
    });
  });
};

// 아이디어 목록 가져오기
export const getIdeas = (req, res) => {
  // 삭제되지 않은 아이디어만 가져오도록 쿼리 수정
  const q = `SELECT * FROM special.ITAsset_ideas WHERE status != '삭제' OR status IS NULL ORDER BY created_at DESC`;

  db.query(q, (err, data) => {
    if (err) {
      console.error("아이디어 목록 조회 오류:", err);
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(data);
  });
};

// 아이디어 조회 로그 기록하기
export const logIdeaView = (req, res) => {
  const { idea_id, n_id, name, team } = req.body;

  // 필수 필드 검증
  if (!idea_id || !n_id || !name || !team) {
    return res.status(400).json({
      error: "모든 필드를 입력해주세요",
      missingFields: !idea_id
        ? "아이디어 ID"
        : !n_id
        ? "사용자 ID"
        : !name
        ? "이름"
        : "팀",
    });
  }

  // 현재 날짜 및 시간 (KST 기준으로 설정)
  const now = new Date();
  // UTC 시간에 9시간(KST)을 더해 서버의 현지 시간으로 설정
  now.setHours(now.getHours() + 9);
  const datetime = now.toISOString().slice(0, 19).replace("T", " "); // YYYY-MM-DD HH:MM:SS 형식

  // 중복 체크 없이 항상 로그 기록 진행
  const insertQuery = `
    INSERT INTO special.ITAsset_ideaviewLogs (
      idea_id, n_id, name, team, datetime
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const values = [idea_id, n_id, name, team, datetime];

  db.query(insertQuery, values, (err, data) => {
    if (err) {
      console.error("아이디어 조회 로그 기록 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({
      message: "아이디어 조회 로그가 성공적으로 기록되었습니다.",
      log_id: data.insertId,
    });
  });
};

// 아이디어 상세 정보 가져오기
export const getIdeaById = (req, res) => {
  const ideaId = req.params.id;
  const q = `SELECT * FROM special.ITAsset_ideas WHERE id = ?`;

  db.query(q, [ideaId], (err, data) => {
    if (err) {
      console.error("아이디어 상세 조회 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "해당 아이디어를 찾을 수 없습니다." });
    }

    // 삭제된 아이디어인 경우 접근 차단
    if (data[0].status === "삭제") {
      return res
        .status(410) // Gone - 리소스가 더 이상 사용 불가능함
        .json({ message: "삭제된 아이디어입니다." });
    }

    // 로그 테이블에서 실제 조회수 가져오기
    const viewCountQuery = `
      SELECT COUNT(id) AS viewcount 
      FROM special.ITAsset_ideaviewLogs 
      WHERE idea_id = ?
    `;

    db.query(viewCountQuery, [ideaId], (viewErr, viewData) => {
      if (viewErr) {
        console.error("조회수 조회 오류:", viewErr);
        // 조회수 조회 실패해도 기본 데이터는 반환
        return res.status(200).json(data[0]);
      }

      const viewCount = viewData[0]?.viewcount || 0;

      // 로그 테이블의 실제 조회수를 데이터에 포함시킴
      const ideaData = {
        ...data[0],
        views: viewCount,
      };

      // 실제 조회수를 포함한 데이터 반환
      return res.status(200).json(ideaData);
    });
  });
};

// 과제 선정 정보 등록
export const registerSelectedIdea = (req, res) => {
  console.log("과제 선정 요청 데이터:", req.body);

  const {
    duplication, // 과제중복
    scope, // 사용범위
    comment, // 의견작성
    is_selected, // 선정여부
  } = req.body;

  const idea_id = req.params.idea_id; // URL 파라미터에서 아이디어 ID 가져오기

  if (!idea_id) {
    return res.status(400).json({ error: "아이디어 ID가 필요합니다." });
  }

  // 먼저 기존 데이터가 있는지 확인
  const checkQuery = `SELECT * FROM special.ITAsset_ideaSelected WHERE idea_id = ? LIMIT 1`;

  db.query(checkQuery, [idea_id], (checkErr, checkData) => {
    if (checkErr) {
      console.error("기존 선정 데이터 확인 오류:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    let query;
    let values;

    if (checkData && checkData.length > 0) {
      // 기존 데이터가 있으면 UPDATE
      query = `
        UPDATE special.ITAsset_ideaSelected 
        SET duplication = ?, 
            scope = ?, 
            comment = ?, 
            is_selected = ?,
            updated_at = NOW()
        WHERE idea_id = ?
      `;
      values = [
        duplication,
        scope,
        comment,
        is_selected === true || is_selected === "true" || is_selected === 1
          ? 1
          : 0,
        idea_id,
      ];
    } else {
      // 기존 데이터가 없으면 INSERT
      query = `
        INSERT INTO special.ITAsset_ideaSelected (
          idea_id, duplication, scope, comment, is_selected
        ) VALUES (?, ?, ?, ?, ?)
      `;
      values = [
        idea_id,
        duplication,
        scope,
        comment,
        is_selected === true || is_selected === "true" || is_selected === 1
          ? 1
          : 0,
      ];
    }

    db.query(query, values, (err, data) => {
      if (err) {
        console.error("과제 선정 정보 등록 오류:", err);
        return res.status(500).json({ error: err.message });
      }

      // 아이디어 상태 업데이트 (선정 여부에 따라)
      const updateIdeaStatusQuery = `
        UPDATE special.ITAsset_ideas 
        SET status = ? 
        WHERE id = ?
      `;

      const newStatus =
        is_selected === true || is_selected === "true" || is_selected === 1
          ? "선정"
          : "Drop";

      db.query(
        updateIdeaStatusQuery,
        [newStatus, idea_id],
        (updateErr, updateData) => {
          if (updateErr) {
            console.error("아이디어 상태 업데이트 오류:", updateErr);
            // 상태 업데이트 실패해도 선정 데이터는 저장되었으므로 성공 응답
          }

          return res.status(200).json({
            message: "과제 선정 정보가 성공적으로 등록되었습니다.",
            idea_id: idea_id,
            status: newStatus,
          });
        }
      );
    });
  });
};

// 과제 선정 정보 가져오기
export const getSelectedIdea = (req, res) => {
  const idea_id = req.params.idea_id;
  console.log("과제 선정 정보 조회 요청 (idea_id):", idea_id);

  if (!idea_id) {
    return res.status(400).json({ error: "아이디어 ID가 필요합니다." });
  }

  const q = `SELECT * FROM special.ITAsset_ideaSelected WHERE idea_id = ? ORDER BY created_at DESC LIMIT 1`;

  db.query(q, [idea_id], (err, data) => {
    if (err) {
      console.error("과제 선정 정보 조회 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "해당 아이디어의 선정 정보를 찾을 수 없습니다." });
    }

    return res.status(200).json(data[0]);
  });
};

// 과제 검증 정보 등록
export const registerIdeaVerify = (req, res) => {
  console.log("과제 검증 요청 데이터:", req.body);

  const {
    idea_id, // 관련 아이디어 ID
    // 본사 선임부서 섹션
    development_collaboration, // 개발 협업
    target_user, // 사용대상
    comment, // 의견작성
    verification_status, // 검증여부
    // 본사 AI/DT 섹션
    ai_development_collaboration, // AI/DT 개발 협업
    feasibility, // 가능여부
    ai_comment, // AI/DT 의견작성
    expected_personnel, // 예상 투입인력
    expected_schedule, // 예상 일정
    ai_verification_status, // AI/DT 검증여부
  } = req.body;

  // 필드 이름 한글 매핑
  const fieldNameMap = {
    idea_id: "아이디어 ID",
    development_collaboration: "개발 협업",
    target_user: "사용대상",
    comment: "의견작성",
    verification_status: "검증여부",
    ai_development_collaboration: "AI/DT 개발 협업",
    feasibility: "가능여부",
    ai_comment: "AI/DT 의견작성",
    expected_personnel: "예상 투입인력",
    expected_schedule: "예상 일정",
    ai_verification_status: "AI/DT 검증여부",
  };

  // 필수 필드 검증
  const requiredFields = [
    "idea_id",
    "development_collaboration",
    "target_user",
    "comment",
    "verification_status",
    "ai_development_collaboration",
    "feasibility",
    "ai_comment",
    "ai_verification_status",
  ];

  // 누락된 필드 검사
  const missingFields = requiredFields.filter((field) => {
    const value = req.body[field];
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "string" && value.replace(/<[^>]*>/g, "").trim() === "")
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

  // 기존 데이터 확인 쿼리
  const checkExistingQuery = `SELECT * FROM special.ITAsset_ideaVerify WHERE idea_id = ? ORDER BY created_at DESC LIMIT 1`;

  db.query(checkExistingQuery, [idea_id], (checkErr, checkData) => {
    if (checkErr) {
      console.error("기존 데이터 확인 오류:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    let query;
    let values;

    if (checkData.length > 0) {
      // 기존 데이터가 있으면 업데이트
      query = `
        UPDATE special.ITAsset_ideaVerify 
        SET development_collaboration = ?, 
            target_user = ?, 
            comment = ?, 
            verification_status = ?,
            ai_development_collaboration = ?, 
            feasibility = ?, 
            ai_comment = ?, 
            expected_personnel = ?, 
            expected_schedule = ?, 
            ai_verification_status = ?, 
            updated_at = NOW()
        WHERE idea_id = ?
      `;
      values = [
        development_collaboration,
        target_user,
        comment,
        verification_status,
        ai_development_collaboration,
        feasibility,
        ai_comment,
        expected_personnel || null,
        expected_schedule || null,
        ai_verification_status,
        idea_id,
      ];
    } else {
      // 데이터 삽입 쿼리
      query = `
        INSERT INTO special.ITAsset_ideaVerify (
          idea_id,
          development_collaboration,
          target_user,
          comment,
          verification_status,
          ai_development_collaboration,
          feasibility,
          ai_comment,
          expected_personnel,
          expected_schedule,
          ai_verification_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      values = [
        idea_id,
        development_collaboration,
        target_user,
        comment,
        verification_status,
        ai_development_collaboration,
        feasibility,
        ai_comment,
        expected_personnel || null,
        expected_schedule || null,
        ai_verification_status,
      ];
    }

    db.query(query, values, (err, data) => {
      if (err) {
        console.error("과제 검증 정보 등록 오류:", err);
        return res.status(500).json({ error: err.message });
      }

      // 두 검증 모두 완료된 경우 아이디어 상태 업데이트
      if (
        checkData.length > 0 &&
        checkData[0].verification_status !== null &&
        checkData[0].target_user &&
        checkData[0].comment
      ) {
        const verificationStatus = checkData[0].verification_status === 1;
        const aiVerificationStatus =
          ai_verification_status === true || ai_verification_status === "true"
            ? true
            : false;

        // 검증 상태에 따라 아이디어 상태 업데이트
        // 두 부서 중 하나라도 false면 "Drop", 둘 다 true면 "검증"
        let newStatus = "검증";

        // 선임부서 또는 AI/DT 부서 중 하나라도 명시적으로 false인 경우에 "Drop"
        if (verificationStatus === false || aiVerificationStatus === false) {
          newStatus = "Drop";
          console.log("두 부서 검증 완료, 결과는 Drop 처리:", {
            선임부서_검증상태: verificationStatus,
            AI부서_검증상태: aiVerificationStatus,
          });
        } else {
          console.log("두 부서 검증 완료, 결과는 검증:", {
            선임부서_검증상태: verificationStatus,
            AI부서_검증상태: aiVerificationStatus,
          });
        }

        const updateIdeaStatusQuery = `
          UPDATE special.ITAsset_ideas 
          SET status = ? 
          WHERE id = ?
        `;

        db.query(
          updateIdeaStatusQuery,
          [newStatus, idea_id],
          (updateErr, updateData) => {
            if (updateErr) {
              console.error("아이디어 상태 업데이트 오류:", updateErr);
              // 상태 업데이트 실패해도 검증 데이터는 저장되었으므로 성공 응답
            }
          }
        );
      } else {
        // 선임부서 검증이 아직 완료되지 않은 경우에도 AI/DT 검증이 false면 바로 Drop으로 처리
        const aiVerificationStatus =
          ai_verification_status === true || ai_verification_status === "true"
            ? true
            : false;

        if (aiVerificationStatus === false) {
          console.log(
            "AI/DT 검증 결과가 Drop, 선임부서 검증 상태와 무관하게 Drop으로 처리"
          );

          const updateIdeaStatusQuery = `
            UPDATE special.ITAsset_ideas 
            SET status = ? 
            WHERE id = ?
          `;

          db.query(
            updateIdeaStatusQuery,
            ["Drop", idea_id],
            (updateErr, updateData) => {
              if (updateErr) {
                console.error("아이디어 상태 업데이트 오류:", updateErr);
              }
            }
          );
        }
      }

      return res.status(200).json({
        message: "과제 검증 정보가 성공적으로 등록되었습니다.",
        idea_id,
        development_collaboration,
        target_user,
        comment,
        verification_status:
          verification_status === true || verification_status === "true"
            ? true
            : false,
      });
    });
  });
};

// 과제 검증 정보 조회
export const getIdeaVerifyById = (req, res) => {
  const idea_id = req.params.id;
  const q = `SELECT * FROM special.ITAsset_ideaVerify WHERE idea_id = ? ORDER BY created_at DESC LIMIT 1`;

  db.query(q, [idea_id], (err, data) => {
    if (err) {
      console.error("과제 검증 정보 조회 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "검증 정보를 찾을 수 없습니다." });
    }

    return res.status(200).json(data[0]);
  });
};

// 선임부서 과제 검증 정보 등록
export const registerDepartmentVerify = (req, res) => {
  console.log("선임부서 과제 검증 요청 데이터:", req.body);

  const {
    idea_id, // 관련 아이디어 ID
    development_collaboration, // 개발 협업
    target_user, // 사용대상
    comment, // 의견작성
    verification_status, // 검증여부
  } = req.body;

  // 필드 이름 한글 매핑
  const fieldNameMap = {
    idea_id: "아이디어 ID",
    development_collaboration: "개발 협업",
    target_user: "사용대상",
    comment: "의견작성",
    verification_status: "검증여부",
  };

  // 필수 필드 검증
  const requiredFields = [
    "idea_id",
    "development_collaboration",
    "target_user",
    "comment",
  ];

  // 누락된 필드 검사
  const missingFields = requiredFields.filter((field) => {
    const value = req.body[field];
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "string" && value.replace(/<[^>]*>/g, "").trim() === "")
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

  // 기존 데이터 조회
  const selectQuery = `SELECT * FROM special.ITAsset_ideaVerify WHERE idea_id = ? ORDER BY created_at DESC LIMIT 1`;

  db.query(selectQuery, [idea_id], (selectErr, selectData) => {
    if (selectErr) {
      console.error("과제 검증 정보 조회 오류:", selectErr);
      return res.status(500).json({ error: selectErr.message });
    }

    let query;
    let values;

    if (selectData.length > 0) {
      // 기존 데이터가 있으면 업데이트
      // idea_id만으로 업데이트하고 id 컬럼은 사용하지 않습니다
      query = `
        UPDATE special.ITAsset_ideaVerify 
        SET development_collaboration = ?, 
            target_user = ?, 
            comment = ?, 
            verification_status = ?, 
            updated_at = NOW()
        WHERE idea_id = ?
      `;
      values = [
        development_collaboration,
        target_user,
        comment,
        verification_status === true || verification_status === "true" ? 1 : 0,
        idea_id,
      ];
    } else {
      // 기존 데이터가 없으면 새로 삽입
      // ai_comment와 같은 필수 필드에 NULL 값 제공
      query = `
        INSERT INTO special.ITAsset_ideaVerify (
          idea_id, development_collaboration, target_user, comment, verification_status
        ) VALUES (?, ?, ?, ?, ?)
      `;
      values = [
        idea_id,
        development_collaboration,
        target_user,
        comment,
        verification_status === true || verification_status === "true" ? 1 : 0,
      ];
    }

    db.query(query, values, (err, data) => {
      if (err) {
        console.error("선임부서 검증 정보 등록 오류:", err);
        return res.status(500).json({ error: err.message });
      }

      // 두 검증 모두 완료된 경우 아이디어 상태 업데이트
      if (
        selectData.length > 0 &&
        selectData[0].ai_verification_status !== null &&
        selectData[0].ai_development_collaboration &&
        selectData[0].ai_comment
      ) {
        const departmentVerificationStatus =
          verification_status === true || verification_status === "true"
            ? true
            : false;
        const aiVerificationStatus = selectData[0].ai_verification_status === 1;

        // 검증 상태에 따라 아이디어 상태 업데이트
        // 두 부서 중 하나라도 false면 "Drop", 둘 다 true면 "검증"
        let newStatus = "검증";

        // 선임부서 또는 AI/DT 부서 중 하나라도 명시적으로 false인 경우에 "Drop"
        if (
          departmentVerificationStatus === false ||
          aiVerificationStatus === false
        ) {
          newStatus = "Drop";
          console.log("두 부서 모두 검증 완료, 결과는 Drop 처리:", {
            선임부서_검증상태: departmentVerificationStatus,
            AI부서_검증상태: aiVerificationStatus,
          });
        } else {
          console.log("두 부서 모두 검증 완료, 결과는 검증:", {
            선임부서_검증상태: departmentVerificationStatus,
            AI부서_검증상태: aiVerificationStatus,
          });
        }

        const updateIdeaStatusQuery = `
          UPDATE special.ITAsset_ideas 
          SET status = ? 
          WHERE id = ?
        `;

        db.query(
          updateIdeaStatusQuery,
          [newStatus, idea_id],
          (updateErr, updateData) => {
            if (updateErr) {
              console.error("아이디어 상태 업데이트 오류:", updateErr);
              // 상태 업데이트 실패해도 검증 데이터는 저장되었으므로 성공 응답
            }
          }
        );
      } else {
        // AI/DT 검증이 아직 완료되지 않은 경우에도 선임부서 검증이 false면 바로 Drop으로 처리
        const departmentVerificationStatus =
          verification_status === true || verification_status === "true"
            ? true
            : false;

        if (departmentVerificationStatus === false) {
          console.log(
            "선임부서 검증 결과가 Drop, AI/DT 검증 상태와 무관하게 Drop으로 처리"
          );

          const updateIdeaStatusQuery = `
            UPDATE special.ITAsset_ideas 
            SET status = ? 
            WHERE id = ?
          `;

          db.query(
            updateIdeaStatusQuery,
            ["Drop", idea_id],
            (updateErr, updateData) => {
              if (updateErr) {
                console.error("아이디어 상태 업데이트 오류:", updateErr);
              }
            }
          );
        }
      }

      return res.status(200).json({
        message: "선임부서 검증 정보가 성공적으로 등록되었습니다.",
        idea_id,
        development_collaboration,
        target_user,
        comment,
        verification_status:
          verification_status === true || verification_status === "true"
            ? true
            : false,
      });
    });
  });
};

// AI/DT 과제 검증 정보 등록
export const registerAIVerify = (req, res) => {
  console.log("AI/DT 과제 검증 요청 데이터:", req.body);

  const {
    idea_id, // 관련 아이디어 ID
    ai_development_collaboration, // AI/DT 개발 협업
    feasibility, // 가능여부
    ai_comment, // AI/DT 의견작성
    expected_personnel, // 예상 투입인력
    expected_schedule, // 예상 일정
    ai_verification_status, // AI/DT 검증여부
  } = req.body;

  // 필드 이름 한글 매핑
  const fieldNameMap = {
    idea_id: "아이디어 ID",
    ai_development_collaboration: "AI/DT 개발 협업",
    feasibility: "가능여부",
    ai_comment: "AI/DT 의견작성",
    expected_personnel: "예상 투입인력",
    expected_schedule: "예상 일정",
    ai_verification_status: "AI/DT 검증여부",
  };

  // 필수 필드 검증
  const requiredFields = [
    "idea_id",
    "ai_development_collaboration",
    "feasibility",
    "ai_comment",
  ];

  // 누락된 필드 검사
  const missingFields = requiredFields.filter((field) => {
    const value = req.body[field];
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "string" && value.replace(/<[^>]*>/g, "").trim() === "")
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

  // 기존 데이터 조회
  const selectQuery = `SELECT * FROM special.ITAsset_ideaVerify WHERE idea_id = ? ORDER BY created_at DESC LIMIT 1`;

  db.query(selectQuery, [idea_id], (selectErr, selectData) => {
    if (selectErr) {
      console.error("과제 검증 정보 조회 오류:", selectErr);
      return res.status(500).json({ error: selectErr.message });
    }

    let query;
    let values;

    if (selectData.length > 0) {
      // 기존 데이터가 있으면 업데이트
      // idea_id만으로 업데이트하고 id 컬럼은 사용하지 않습니다
      query = `
        UPDATE special.ITAsset_ideaVerify 
        SET ai_development_collaboration = ?, 
            feasibility = ?, 
            ai_comment = ?, 
            expected_personnel = ?, 
            expected_schedule = ?, 
            ai_verification_status = ?, 
            updated_at = NOW()
        WHERE idea_id = ?
      `;
      values = [
        ai_development_collaboration,
        feasibility,
        ai_comment,
        expected_personnel || null,
        expected_schedule || null,
        ai_verification_status === true || ai_verification_status === "true"
          ? 1
          : 0,
        idea_id,
      ];

      // 아이디어 상태 업데이트 준비
      const shouldUpdateStatus =
        selectData[0].development_collaboration &&
        selectData[0].target_user &&
        selectData[0].comment;
    } else {
      // 기존 데이터가 없으면 새로 삽입
      query = `
        INSERT INTO special.ITAsset_ideaVerify (
          idea_id, ai_development_collaboration, feasibility, ai_comment, expected_personnel, expected_schedule, ai_verification_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      values = [
        idea_id,
        ai_development_collaboration,
        feasibility,
        ai_comment,
        expected_personnel || null,
        expected_schedule || null,
        ai_verification_status === true || ai_verification_status === "true"
          ? 1
          : 0,
      ];
    }

    db.query(query, values, (err, data) => {
      if (err) {
        console.error("AI/DT 검증 정보 등록 오류:", err);
        return res.status(500).json({ error: err.message });
      }

      // 두 검증 모두 완료된 경우 아이디어 상태 업데이트
      if (
        selectData.length > 0 &&
        selectData[0].verification_status !== null &&
        selectData[0].target_user &&
        selectData[0].comment
      ) {
        const verificationStatus = selectData[0].verification_status === 1;
        const aiVerificationStatus =
          ai_verification_status === true || ai_verification_status === "true"
            ? true
            : false;

        // 검증 상태에 따라 아이디어 상태 업데이트
        // 두 부서 중 하나라도 false면 "Drop", 둘 다 true면 "검증"
        let newStatus = "검증";

        // 선임부서 또는 AI/DT 부서 중 하나라도 명시적으로 false인 경우에 "Drop"
        if (verificationStatus === false || aiVerificationStatus === false) {
          newStatus = "Drop";
          console.log("두 부서 모두 검증 완료, 결과는 Drop 처리:", {
            선임부서_검증상태: verificationStatus,
            AI부서_검증상태: aiVerificationStatus,
          });
        } else {
          console.log("두 부서 모두 검증 완료, 결과는 검증:", {
            선임부서_검증상태: verificationStatus,
            AI부서_검증상태: aiVerificationStatus,
          });
        }

        const updateIdeaStatusQuery = `
          UPDATE special.ITAsset_ideas 
          SET status = ? 
          WHERE id = ?
        `;

        db.query(
          updateIdeaStatusQuery,
          [newStatus, idea_id],
          (updateErr, updateData) => {
            if (updateErr) {
              console.error("아이디어 상태 업데이트 오류:", updateErr);
              // 상태 업데이트 실패해도 검증 데이터는 저장되었으므로 성공 응답
            }
          }
        );
      } else {
        // 선임부서 검증이 아직 완료되지 않은 경우에도 AI/DT 검증이 false면 바로 Drop으로 처리
        const aiVerificationStatus =
          ai_verification_status === true || ai_verification_status === "true"
            ? true
            : false;

        if (aiVerificationStatus === false) {
          console.log(
            "AI/DT 검증 결과가 Drop, 선임부서 검증 상태와 무관하게 Drop으로 처리"
          );

          const updateIdeaStatusQuery = `
            UPDATE special.ITAsset_ideas 
            SET status = ? 
            WHERE id = ?
          `;

          db.query(
            updateIdeaStatusQuery,
            ["Drop", idea_id],
            (updateErr, updateData) => {
              if (updateErr) {
                console.error("아이디어 상태 업데이트 오류:", updateErr);
              }
            }
          );
        }
      }

      return res.status(200).json({
        message: "AI/DT 검증 정보가 성공적으로 등록되었습니다.",
        idea_id,
        ai_development_collaboration,
        feasibility,
        ai_comment,
        expected_personnel: expected_personnel || null,
        expected_schedule: expected_schedule || null,
        ai_verification_status:
          ai_verification_status === true || ai_verification_status === "true"
            ? true
            : false,
      });
    });
  });
};

// 파일럿 데이터 등록
export const registerIdeaPilot = (req, res) => {
  console.log("파일럿 데이터 등록 요청:", req.body);

  const {
    productivity, // 생산성
    cost, // 비용
    quantitybasis, // 정량적 기대효과 근거
    filePath, // 파일 경로 (선택적)
  } = req.body;

  const idea_id = req.params.idea_id; // URL 파라미터에서 아이디어 ID 가져오기

  // 필드 이름 한글 매핑
  const fieldNameMap = {
    productivity: "생산성",
    cost: "비용",
    quantitybasis: "정량적 기대효과 근거",
  };

  // 필수 필드 검증
  const requiredFields = ["productivity", "cost", "quantitybasis"];

  // 누락된 필드 검사
  const missingFields = requiredFields.filter((field) => {
    const value = req.body[field];
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "string" && value.replace(/<[^>]*>/g, "").trim() === "")
    );
  });

  if (!idea_id) {
    return res.status(400).json({ error: "아이디어 ID가 필요합니다." });
  }

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

  // 데이터 삽입 쿼리 - created_at과 filePath 필드 추가
  let insertQuery;
  let values;

  if (filePath) {
    insertQuery = `
      INSERT INTO special.ITAsset_ideaPilot (
        idea_id, productivity, cost, quantitybasis, filePath, created_at
      ) VALUES (?, ?, ?, ?, ?, NOW())
    `;
    values = [
      idea_id,
      parseFloat(productivity) || 0,
      parseFloat(cost) || 0,
      quantitybasis,
      filePath,
    ];
  } else {
    insertQuery = `
      INSERT INTO special.ITAsset_ideaPilot (
        idea_id, productivity, cost, quantitybasis, created_at
      ) VALUES (?, ?, ?, ?, NOW())
    `;
    values = [
      idea_id,
      parseFloat(productivity) || 0,
      parseFloat(cost) || 0,
      quantitybasis,
    ];
  }

  db.query(insertQuery, values, (err, data) => {
    if (err) {
      console.error("Pilot 데이터 등록 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    // 아이디어 상태 업데이트 (Pilot으로 변경)
    const updateIdeaStatusQuery = `
      UPDATE special.ITAsset_ideas 
      SET status = 'pilot' 
      WHERE id = ?
    `;

    db.query(updateIdeaStatusQuery, [idea_id], (updateErr, updateData) => {
      if (updateErr) {
        console.error("아이디어 상태 업데이트 오류:", updateErr);
        // 상태 업데이트 실패해도 파일럿 데이터는 저장되었으므로 성공 응답
      }

      return res.status(200).json({
        message: "Pilot 데이터가 성공적으로 등록되었습니다.",
        idea_id: idea_id, // pilotId 대신 idea_id만 반환
        status: "pilot", // 상태도 함께 반환
      });
    });
  });
};

// 파일럿 데이터 조회
export const getPilotDataById = (req, res) => {
  const idea_id = req.params.id;
  console.log("파일럿 데이터 조회 요청 (idea_id):", idea_id);

  if (!idea_id) {
    return res.status(400).json({ error: "아이디어 ID가 필요합니다." });
  }

  // 쿼리 로깅 추가
  // created_at 컬럼이 없으므로 ORDER BY 절 제거
  const q = `SELECT * FROM special.ITAsset_ideaPilot WHERE idea_id = ? LIMIT 1`;
  console.log("실행 쿼리:", q);
  console.log("쿼리 파라미터:", idea_id);

  try {
    db.query(q, [idea_id], (err, data) => {
      if (err) {
        console.error("파일럿 데이터 조회 오류:", err);
        return res.status(500).json({
          error: err.message,
          sqlMessage: err.sqlMessage,
          code: err.code,
        });
      }

      if (!data || data.length === 0) {
        console.log("데이터가 없음: idea_id =", idea_id);
        return res
          .status(404)
          .json({ message: "파일럿 데이터를 찾을 수 없습니다." });
      }

      console.log("파일럿 데이터 조회 성공:", data[0]);
      return res.status(200).json(data[0]);
    });
  } catch (error) {
    console.error("예상치 못한 에러:", error);
    return res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
  }
};

// 본부와 팀 정보 가져오기
export const getTeam = (req, res) => {
  // special 스키마의 ITAsset_ideaDepartment 테이블에서 부서 정보 조회 (대소문자 구분 없이)
  const query = `
    SELECT 
      headqt COLLATE utf8mb4_general_ci AS headqt, 
      team COLLATE utf8mb4_general_ci AS team 
    FROM special.ITAsset_ideaDepartment 
    ORDER BY headqt, team
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error("부서 정보 조회 오류:", err.message);
      return res.status(500).json({
        message: "부서 정보를 가져오는 중 오류가 발생했습니다.",
        error: err.message,
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        message: "검색 결과가 없습니다.",
      });
    }

    // 본부별로 팀 정보 그룹화 (대소문자 구분 없이)
    const teamsByHeadqt = {};

    data.forEach((item) => {
      // 항상 일관된 케이스 형식 사용
      const headqt = item.headqt ? item.headqt.trim() : "";
      const team = item.team ? item.team.trim() : "";

      if (!headqt) return; // 빈 값 무시

      if (!teamsByHeadqt[headqt]) {
        teamsByHeadqt[headqt] = [];
      }

      if (team && !teamsByHeadqt[headqt].includes(team)) {
        teamsByHeadqt[headqt].push(team);
      }
    });

    return res.status(200).json(teamsByHeadqt);
  });
};

// 아이디어 수정하기
export const updateIdea = (req, res) => {
  console.log("아이디어 수정 요청 데이터:", req.body);
  const ideaId = req.params.id;

  if (!ideaId) {
    return res.status(400).json({ error: "아이디어 ID가 필요합니다." });
  }

  // 필드 이름 한글 매핑 (사용자에게 더 이해하기 쉬운 이름으로 표시)
  const fieldNameMap = {
    title: "제목",
    background: "추진 배경",
    progress: "추진 내역",
    quantitative_effect: "정량적 효과",
    qualitative_effect: "정성적 효과",
    project_type: "과제 유형",
    target_user: "사용 대상",
    business_field: "사업분야",
    job_field: "업무분야",
    usability: "활용도",
    duplication: "중복여부",
    tboh_status: "TBOH 여부",
    use_period: "활용기간",
    use_scope: "사용범위",
    platform: "플랫폼",
    usability_points: "유용성",
    improvement_points: "개선내역",
    VerifyDepartment: "검증 부서",
  };

  const {
    title,
    background,
    progress,
    quantitative_effect,
    qualitative_effect,
    project_type,
    target_user,
    business_field,
    job_field,
    usability,
    duplication,
    tboh_status,
    use_period,
    use_scope,
    platform,
    usability_points,
    improvement_points,
    user_id,
    name,
    prnt_dept_name,
    dept_name,
    VerifyDepartment,
  } = req.body;

  // 모든 필드가 입력되었는지 확인
  const requiredFields = [
    "title",
    "background",
    "progress",
    "quantitative_effect",
    "qualitative_effect",
    "project_type",
    "target_user",
    "business_field",
    "job_field",
    "usability",
    "duplication",
    "tboh_status",
    "use_period",
    "use_scope",
    "platform",
    "usability_points",
    "improvement_points",
    "VerifyDepartment",
  ];

  // 누락된 필드 검사 및 빈 문자열 체크
  const missingFields = requiredFields.filter((field) => {
    const value = req.body[field];
    // undefined, null, 빈 문자열 또는 HTML 태그만 있는 경우("<p></p>" 등) 체크
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "string" && value.replace(/<[^>]*>/g, "").trim() === "")
    );
  });

  if (missingFields.length > 0) {
    // 한글 필드명으로 변환하여 응답
    const missingFieldsKorean = missingFields.map(
      (field) => fieldNameMap[field] || field
    );

    console.log(`누락된 필드 발견: ${missingFieldsKorean.join(", ")}`);

    return res.status(400).json({
      error: "모든 필드를 입력해주세요",
      missingFields: missingFieldsKorean,
    });
  }

  const q = `
    UPDATE special.ITAsset_ideas SET
      title = ?, 
      background = ?, 
      progress = ?, 
      quantitative_effect = ?, 
      qualitative_effect = ?,
      project_type = ?, 
      target_user = ?, 
      business_field = ?, 
      job_field = ?, 
      usability = ?, 
      duplication = ?, 
      tboh_status = ?, 
      use_period = ?, 
      use_scope = ?, 
      platform = ?, 
      usability_points = ?, 
      improvement_points = ?,
      VerifyDepartment = ?,
      updated_at = NOW()
    WHERE id = ?
  `;

  const values = [
    title,
    background,
    progress,
    quantitative_effect,
    qualitative_effect,
    project_type,
    target_user,
    business_field,
    job_field,
    usability,
    duplication,
    tboh_status,
    use_period,
    use_scope,
    platform,
    usability_points,
    improvement_points,
    VerifyDepartment || "",
    ideaId,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("아이디어 수정 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    if (data.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "해당 아이디어를 찾을 수 없습니다." });
    }

    return res.status(200).json({
      message: "아이디어가 성공적으로 수정되었습니다.",
      ideaId: ideaId,
    });
  });
};

// 아이디어 삭제하기 (실제 삭제하지 않고 상태만 변경)
export const deleteIdea = (req, res) => {
  console.log("아이디어 삭제 요청:", req.params);
  const ideaId = req.params.id;

  if (!ideaId) {
    return res.status(400).json({ error: "아이디어 ID가 필요합니다." });
  }

  // 상태를 '삭제'로 변경하는 쿼리
  const q = `
    UPDATE special.ITAsset_ideas 
    SET status = '삭제', updated_at = NOW() 
    WHERE id = ?
  `;

  db.query(q, [ideaId], (err, data) => {
    if (err) {
      console.error("아이디어 삭제 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    if (data.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "해당 아이디어를 찾을 수 없습니다." });
    }

    return res.status(200).json({
      message: "아이디어가 성공적으로 삭제되었습니다.",
      ideaId: ideaId,
    });
  });
};

// 댓글 등록 기능
export const addComment = (req, res) => {
  console.log("댓글 등록 요청 데이터:", req.body);

  const { idea_id, n_id, name, team, comment } = req.body;

  // 필수 필드 검증
  if (!idea_id || !n_id || !name || !team || !comment) {
    return res.status(400).json({
      error: "모든 필드를 입력해주세요",
      missingFields: !idea_id
        ? "아이디어 ID"
        : !n_id
        ? "사용자 ID"
        : !name
        ? "이름"
        : !team
        ? "팀"
        : "댓글 내용",
    });
  }

  // 현재 날짜 설정 (로컬 시간 기준으로 정확한 날짜 반환)
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const query = `
    INSERT INTO special.ITAsset_ideaComment (
      idea_id, n_id, name, team, comment, date
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [idea_id, n_id, name, team, comment, currentDate];

  db.query(query, values, (err, data) => {
    if (err) {
      console.error("댓글 등록 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({
      message: "댓글이 성공적으로 등록되었습니다.",
      comment_id: data.insertId,
      idea_id: idea_id,
      name: name,
      team: team,
      comment: comment,
      date: currentDate,
    });
  });
};

// 댓글 목록 조회 기능
export const getComments = (req, res) => {
  const ideaId = req.params.ideaId;

  if (!ideaId) {
    return res.status(400).json({ error: "아이디어 ID가 필요합니다." });
  }

  const query = `
    SELECT * FROM special.ITAsset_ideaComment 
    WHERE idea_id = ? 
    ORDER BY date DESC, comment_id DESC
  `;

  db.query(query, [ideaId], (err, data) => {
    if (err) {
      console.error("댓글 조회 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json(data);
  });
};

// 댓글 삭제 기능
export const deleteComment = (req, res) => {
  const commentId = req.params.commentId;

  if (!commentId) {
    return res.status(400).json({ error: "댓글 ID가 필요합니다." });
  }

  const query = `DELETE FROM special.ITAsset_ideaComment WHERE comment_id = ?`;

  db.query(query, [commentId], (err, data) => {
    if (err) {
      console.error("댓글 삭제 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
    }

    return res.status(200).json({
      message: "댓글이 성공적으로 삭제되었습니다.",
      commentId: commentId,
    });
  });
};

// 아이디어 조회수 가져오기
export const getIdeaViewCount = (req, res) => {
  const ideaId = req.params.ideaId;

  if (!ideaId) {
    return res.status(400).json({ error: "아이디어 ID가 필요합니다." });
  }

  // 특정 아이디어의 조회수를 로그 테이블에서 계산하는 쿼리
  const query = `
    SELECT COUNT(id) AS viewcount 
    FROM special.ITAsset_ideaviewLogs 
    WHERE idea_id = ?
  `;

  db.query(query, [ideaId], (err, data) => {
    if (err) {
      console.error("조회수 조회 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({
      viewcount: data[0]?.viewcount || 0,
    });
  });
};

// 전체 아이디어 조회수 목록 가져오기
export const getAllIdeaViewCounts = (req, res) => {
  // 모든 아이디어의 조회수를 로그 테이블에서 계산하는 쿼리
  const query = `
    SELECT idea_id, COUNT(id) AS viewcount 
    FROM special.ITAsset_ideaviewLogs 
    GROUP BY idea_id
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error("전체 조회수 조회 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json(data);
  });
};

export const updateIdeaStatus = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  console.log("백엔드 아이디어 상태 업데이트 요청:", id, status);
  console.log("백엔드 id:", id);
  console.log("백엔드 req.body:", req.body);

  if (!id || !status) {
    return res.status(400).json({ error: "아이디어 ID와 상태가 필요합니다." });
  }

  const query = `
    UPDATE special.ITAsset_ideas 
    SET status = ? 
    WHERE id = ?
  `;
  const values = [status, id];
  db.query(query, values, (err, data) => {
    if (err) {
      console.error("아이디어 상태 업데이트 오류:", err);
      return res.status(500).json({ error: err.message });
    }
    return res
      .status(200)
      .json({ message: "아이디어 상태가 성공적으로 업데이트되었습니다." });
  });
};
