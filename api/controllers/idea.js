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
      user_id, name, prnt_dept_name, dept_name
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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

  const idea_id = req.params.ideaId; // URL 파라미터에서 아이디어 ID 가져오기

  if (!idea_id) {
    return res.status(400).json({ error: "아이디어 ID가 필요합니다." });
  }

  // // 필드 이름 한글 매핑
  // const fieldNameMap = {
  //   idea_id: "아이디어 ID",
  //   duplication: "과제중복",
  //   scope: "사용범위",
  //   comment: "의견작성",
  //   is_selected: "선정여부",
  // };

  // // 필수 필드 검증
  // const requiredFields = [
  //   "idea_id",
  //   "duplication",
  //   "scope",
  //   "comment",
  //   "is_selected",
  // ];

  // // 누락된 필드 검사
  // const missingFields = requiredFields.filter((field) => {
  //   const value = req.body[field];
  //   return (
  //     value === undefined ||
  //     value === null ||
  //     value === "" ||
  //     (typeof value === "string" && value.replace(/<[^>]*>/g, "").trim() === "")
  //   );
  // });

  // if (missingFields.length > 0) {
  //   // 한글 필드명으로 변환
  //   const missingFieldsKorean = missingFields.map(
  //     (field) => fieldNameMap[field] || field
  //   );

  //   console.log(`누락된 필드 발견: ${missingFieldsKorean.join(", ")}`);

  //   return res.status(400).json({
  //     error: "모든 필드를 입력해주세요",
  //     missingFields: missingFieldsKorean,
  //   });
  // }

  // 데이터 삽입 쿼리
  const insertQuery = `
    INSERT INTO special.ITAsset_ideaSelected (
      idea_id, duplication, scope, comment, is_selected
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    idea_id,
    duplication,
    scope,
    comment,
    is_selected === true || is_selected === "true" || is_selected === 1 ? 1 : 0,
  ];

  db.query(insertQuery, values, (err, data) => {
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
        ? "selected"
        : "dropped";

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
          selectionId: data.insertId,
          ideaId: idea_id,
          status: newStatus,
        });
      }
    );
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

  // 데이터 삽입 쿼리
  const insertQuery = `
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

  const values = [
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

  db.query(insertQuery, values, (err, data) => {
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
    const newStatus =
      verification_status && ai_verification_status ? "verified" : "rejected";

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
          verificationId: data.insertId,
          ideaId: idea_id,
          status: newStatus,
        });
      }
    );
  });
};

// 과제 검증 정보 조회
export const getIdeaVerifyById = (req, res) => {
  const ideaId = req.params.id;
  const q = `SELECT * FROM special.ITAsset_ideaVerify WHERE idea_id = ? ORDER BY created_at DESC LIMIT 1`;

  db.query(q, [ideaId], (err, data) => {
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
      query = `
        UPDATE special.ITAsset_ideaVerify 
        SET development_collaboration = ?, target_user = ?, comment = ?, verification_status = ?, updated_at = NOW()
        WHERE idea_id = ? AND id = ?
      `;
      values = [
        development_collaboration,
        target_user,
        comment,
        verification_status === true || verification_status === "true" ? 1 : 0,
        idea_id,
        selectData[0].id,
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
      query = `
        UPDATE special.ITAsset_ideaVerify 
        SET ai_development_collaboration = ?, feasibility = ?, ai_comment = ?, 
            expected_personnel = ?, expected_schedule = ?, ai_verification_status = ?, updated_at = NOW()
        WHERE idea_id = ? AND id = ?
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
        selectData[0].id,
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
        selectData[0].development_collaboration &&
        selectData[0].target_user &&
        selectData[0].comment
      ) {
        const verificationStatus = selectData[0].verification_status;
        const aiVerificationStatus =
          ai_verification_status === true || ai_verification_status === "true"
            ? true
            : false;

        // 검증 상태에 따라 아이디어 상태 업데이트
        const newStatus =
          verificationStatus && aiVerificationStatus ? "verified" : "rejected";

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
    ideaID, // 아이디어 ID
    productivity, // 생산성
    cost, // 비용
    quantitybasis, // 정량적 기대효과 근거
  } = req.body;

  // 필드 이름 한글 매핑
  const fieldNameMap = {
    ideaID: "아이디어 ID",
    productivity: "생산성",
    cost: "비용",
    quantitybasis: "정량적 기대효과 근거",
  };

  // 필수 필드 검증
  const requiredFields = ["ideaID", "productivity", "cost", "quantitybasis"];

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

  // 데이터 삽입 쿼리
  const insertQuery = `
    INSERT INTO special.ITAsset_pilot (
      ideaID, productivity, cost, quantitybasis
    ) VALUES (?, ?, ?, ?)
  `;

  const values = [
    ideaID,
    parseFloat(productivity) || 0,
    parseFloat(cost) || 0,
    quantitybasis,
  ];

  db.query(insertQuery, values, (err, data) => {
    if (err) {
      console.error("파일럿 데이터 등록 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    // 아이디어 상태 업데이트 (Pilot으로 변경)
    const updateIdeaStatusQuery = `
      UPDATE special.ITAsset_ideas 
      SET status = 'pilot' 
      WHERE id = ?
    `;

    db.query(updateIdeaStatusQuery, [ideaID], (updateErr, updateData) => {
      if (updateErr) {
        console.error("아이디어 상태 업데이트 오류:", updateErr);
        // 상태 업데이트 실패해도 파일럿 데이터는 저장되었으므로 성공 응답
      }

      return res.status(200).json({
        message: "파일럿 데이터가 성공적으로 등록되었습니다.",
        pilotId: data.insertId,
        ideaID: ideaID,
      });
    });
  });
};

// 개발자 목록 조회
export const getIdeaDevelopers = (req, res) => {
  // 스키마 명시 제거하고 테이블 명만 사용
  const q = `SELECT * FROM ITAsset_ideaDevelopers ORDER BY id ASC`;

  db.query(q, (err, data) => {
    if (err) {
      console.error("개발자 목록 조회 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    // 데이터가 없는 경우 빈 배열 반환
    if (!data || data.length === 0) {
      console.log("개발자 목록이 비어 있습니다.");
      return res.status(200).json([]);
    }

    return res.status(200).json(data);
  });
};

// 개발 심의 데이터 등록
export const registerIdeaDevReview = (req, res) => {
  console.log("개발 심의 데이터 등록 요청:", req.body);

  const {
    ideaID, // 아이디어 ID
    developers, // 선택된 개발자 목록 (배열)
    startDate, // 시작일자
    endDate, // 종료일자
    priority, // 우선순위
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

  // 선택한 개발자 정보 조회
  const developerIds = developers.map((id) => parseInt(id));

  if (developerIds.length === 0) {
    return res.status(400).json({
      error: "개발자를 한 명 이상 선택해주세요.",
    });
  }

  const fetchDeveloperQuery = `
    SELECT * FROM special.ITAsset_ideaDevelopers 
    WHERE id IN (${developerIds.join(",")})
  `;

  db.query(fetchDeveloperQuery, (err, developerData) => {
    if (err) {
      console.error("개발자 정보 조회 오류:", err);
      return res.status(500).json({ error: err.message });
    }

    if (developerData.length === 0) {
      return res.status(404).json({
        error: "선택한 개발자 정보를 찾을 수 없습니다.",
      });
    }

    // 모든 개발자를 개발 심의 테이블에 등록
    const insertPromises = developerData.map((developer) => {
      return new Promise((resolve, reject) => {
        const insertReviewQuery = `
          INSERT INTO special.ITAsset_ideaDevReview (
            ideaID, 
            developerId, 
            name, 
            team, 
            projectCount, 
            devScheduleStart, 
            devScheduleEnd, 
            priority,
            ITAsset_ideaDevReviewcol
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const reviewValues = [
          ideaID,
          developer.developerId,
          developer.name,
          developer.team,
          developer.projectCount,
          startDate,
          endDate,
          priority,
          "", // ITAsset_ideaDevReviewcol 필드에 빈 문자열 저장
        ];

        db.query(insertReviewQuery, reviewValues, (err, result) => {
          if (err) {
            console.error(`개발자 ${developer.name} 심의 정보 등록 오류:`, err);
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
        return res.status(200).json({
          message: "개발 심의 정보가 성공적으로 등록되었습니다.",
          ideaID: ideaID,
          developerCount: developerData.length,
        });
      })
      .catch((err) => {
        console.error("개발 심의 정보 등록 중 오류 발생:", err);
        return res.status(500).json({ error: err.message });
      });
  });
};
