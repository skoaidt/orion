import { db } from "../db.js";

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
  const q = `SELECT * FROM special.ITAsset_ideas ORDER BY created_at DESC`;

  db.query(q, (err, data) => {
    if (err) {
      console.error("아이디어 목록 조회 오류:", err);
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(data);
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

    return res.status(200).json(data[0]);
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
          : "drop";

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

      // 아이디어 상태 업데이트
      const updateIdeaStatusQuery = `
        UPDATE special.ITAsset_ideas 
        SET status = ? 
        WHERE id = ?
      `;

      // 검증 상태에 따라 아이디어 상태 업데이트
      // 검증 상태가 두 부서 모두 true일 때만 verified, 하나라도 false이면 rejected
      let newStatus = "verified";

      // verification_status가 false이거나 ai_verification_status가 false일 때만 rejected로 설정
      if (
        verification_status === false ||
        verification_status === "false" ||
        ai_verification_status === false ||
        ai_verification_status === "false"
      ) {
        newStatus = "rejected";
        console.log("검증 단계에서 Drop 처리됨:", {
          선임부서_검증상태: verification_status,
          AI부서_검증상태: ai_verification_status,
        });
      } else {
        console.log("검증 단계 완료:", {
          선임부서_검증상태: verification_status,
          AI부서_검증상태: ai_verification_status,
        });
      }

      db.query(
        updateIdeaStatusQuery,
        [newStatus, idea_id],
        (updateErr, updateData) => {
          if (updateErr) {
            console.error("아이디어 상태 업데이트 오류:", updateErr);
            // 상태 업데이트 실패해도 검증 데이터는 저장되었으므로 성공 응답
          }

          return res.status(200).json({
            message: "과제 검증 정보가 성공적으로 등록되었습니다.",
            idea_id: idea_id,
            status: newStatus,
          });
        }
      );
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
        // 두 부서 중 하나라도 false면 rejected, 둘 다 true면 verified
        let newStatus = "verified";

        // 선임부서 또는 AI/DT 부서 중 하나라도 명시적으로 false인 경우에만 rejected
        if (verificationStatus === false || aiVerificationStatus === false) {
          newStatus = "rejected";
          console.log("AI/DT 검증 단계에서 Drop 처리됨:", {
            선임부서_검증상태: verificationStatus,
            AI부서_검증상태: aiVerificationStatus,
          });
        } else {
          console.log("AI/DT 검증 단계 완료:", {
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

  // 데이터 삽입 쿼리
  const insertQuery = `
    INSERT INTO special.ITAsset_ideaPilot (
      idea_id, productivity, cost, quantitybasis
    ) VALUES (?, ?, ?, ?)
  `;

  const values = [
    idea_id,
    parseFloat(productivity) || 0,
    parseFloat(cost) || 0,
    quantitybasis,
  ];

  db.query(insertQuery, values, (err, data) => {
    if (err) {
      console.error("Pilot 데이터 등록 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    // 아이디어 상태 업데이트 (Pilot으로 변경)
    const updateIdeaStatusQuery = `
      UPDATE special.ITAsset_ideas 
      SET status = 'piloted' 
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
        status: "piloted", // 상태도 함께 반환
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
