import React, { useState, useEffect } from "react";
import "./ideaVerify.scss";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import axios from "axios";

const IdeaVerify = ({ onClose, ideaId, ideaData, isViewMode }) => {
  const [formData, setFormData] = useState({
    // 본사 선임부서 섹션
    development_collaboration: "",
    target_user: "",
    comment: "",
    verification_status: true,
    // 본사 AI/DT 섹션
    ai_development_collaboration: "",
    feasibility: "",
    ai_comment: "",
    expected_personnel: "",
    expected_schedule: "",
    ai_verification_status: true,
  });

  const [error, setError] = useState("");
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [leftSubmitted, setLeftSubmitted] = useState(false);
  const [rightSubmitted, setRightSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState(isViewMode);
  const [viewData, setViewData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // 기존 데이터 불러오기
  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        const response = await axios.get(`/api/ideas/verify/${ideaId}`);
        if (response.data) {
          setFormData(response.data);
          setViewData(response.data);

          // 왼쪽/오른쪽 제출 상태 확인
          if (
            response.data.development_collaboration &&
            response.data.target_user &&
            response.data.comment
          ) {
            setLeftSubmitted(true);
          }

          if (
            response.data.ai_development_collaboration &&
            response.data.feasibility &&
            response.data.ai_comment
          ) {
            setRightSubmitted(true);
          }
        }
      } catch (error) {
        console.error("검증 데이터 불러오기 실패:", error);
      }
    };

    if (ideaId) {
      fetchVerificationData();
    }
  }, [ideaId]);

  // 읽기모드 변경 시 상태 설정
  useEffect(() => {
    setViewMode(isViewMode);
  }, [isViewMode]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  // 편집 모드로 전환하는 함수 - 왼쪽(선임부서)
  const handleLeftEdit = () => {
    setViewMode(false);
  };

  // 편집 모드로 전환하는 함수 - 오른쪽(AI/DT)
  const handleRightEdit = () => {
    setViewMode(false);
  };

  // 왼쪽(선임부서) 제출 핸들러
  const handleLeftSubmit = async () => {
    // 필수 입력 필드 확인
    const requiredFields = [
      "development_collaboration",
      "target_user",
      "comment",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      alert("선임부서 필수 항목을 모두 입력해주세요.");
      return;
    }

    // ideaId 확인
    if (!ideaId) {
      alert("아이디어 ID가 필요합니다. 다시 시도해주세요.");
      setError("아이디어 ID가 필요합니다");
      return;
    }

    try {
      setLeftLoading(true);
      setError("");

      // 데이터 준비 (왼쪽 부분만)
      const verifyData = {
        idea_id: ideaId,
        development_collaboration: formData.development_collaboration,
        target_user: formData.target_user,
        comment: formData.comment,
        verification_status: formData.verification_status,
      };

      console.log("등록할 선임부서 검증 데이터:", verifyData);

      // API 호출
      const response = await axios.post(
        "/api/ideas/verify/department",
        verifyData
      );

      console.log("선임부서 검증 등록 성공:", response.data);

      // 응답 데이터로 폼 업데이트
      if (response.data) {
        setFormData((prev) => ({
          ...prev,
          ...response.data,
        }));
        setViewData(response.data);
      }

      setLeftSubmitted(true);

      // 선임부서와 AI/DT 모두 등록되었는지 확인
      const bothSubmitted = true && rightSubmitted; // 현재 함수는 왼쪽(선임부서) 제출 핸들러이므로 성공 시 leftSubmitted는 true

      // 결과 메시지
      let statusMessage = "";
      if (response.data.status) {
        statusMessage = `상태가 '${response.data.status}'(으)로 변경되었습니다.`;
      }

      if (bothSubmitted) {
        // 두 부서 모두 검증 완료
        let finalStatus = "";

        // 두 부서의 검증 상태를 확인하여 최종 상태 결정
        if (formData.verification_status && formData.ai_verification_status) {
          finalStatus = "검증 완료";
        } else if (
          !formData.verification_status &&
          !formData.ai_verification_status
        ) {
          finalStatus = "양쪽 모두 Drop 처리";
        } else if (!formData.verification_status) {
          finalStatus = "선임부서에서 Drop 처리";
        } else {
          finalStatus = "AI/DT 부서에서 Drop 처리";
        }

        alert(
          `선임부서 검증 정보가 성공적으로 등록되었습니다.\n양쪽 모두 검증이 완료되어 ${finalStatus}되었습니다. ${statusMessage}`
        );

        // 잠시 대기 후 모달 닫기
        setTimeout(() => onClose(), 500);
      } else {
        // 선임부서만 검증 완료
        const selectionStatus = formData.verification_status ? "검증" : "Drop";
        alert(
          `선임부서 검증 정보가 성공적으로 등록되었습니다.\n선임부서에서 "${selectionStatus}" 상태로 처리되었습니다.\n아직 AI/DT 검증이 완료되지 않았습니다. ${statusMessage}`
        );
      }

      // 성공 후 읽기 모드로 전환
      setViewMode(true);
    } catch (error) {
      console.error("선임부서 검증 등록 오류:", error);
      handleApiError(error);
    } finally {
      setLeftLoading(false);
    }
  };

  // 오른쪽(AI/DT) 제출 핸들러
  const handleRightSubmit = async () => {
    // 필수 입력 필드 확인
    const requiredFields = [
      "ai_development_collaboration",
      "feasibility",
      "ai_comment",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      alert("AI/DT 필수 항목을 모두 입력해주세요.");
      return;
    }

    // ideaId 확인
    if (!ideaId) {
      alert("아이디어 ID가 필요합니다. 다시 시도해주세요.");
      setError("아이디어 ID가 필요합니다");
      return;
    }

    try {
      setRightLoading(true);
      setError("");

      // 데이터 준비 (오른쪽 부분만)
      const verifyData = {
        idea_id: ideaId,
        ai_development_collaboration: formData.ai_development_collaboration,
        feasibility: formData.feasibility,
        ai_comment: formData.ai_comment,
        expected_personnel: formData.expected_personnel,
        expected_schedule: formData.expected_schedule,
        ai_verification_status: formData.ai_verification_status,
      };

      console.log("등록할 AI/DT 검증 데이터:", verifyData);

      // API 호출
      const response = await axios.post("/api/ideas/verify/ai", verifyData);

      console.log("AI/DT 검증 등록 성공:", response.data);

      // 응답 데이터로 폼 업데이트
      if (response.data) {
        setFormData((prev) => ({
          ...prev,
          ...response.data,
        }));
        setViewData(response.data);
      }

      setRightSubmitted(true);

      // 선임부서와 AI/DT 모두 등록되었는지 확인
      const bothSubmitted = leftSubmitted && true; // 현재 함수는 오른쪽(AI/DT) 제출 핸들러이므로 성공 시 rightSubmitted는 true

      // 결과 메시지
      let statusMessage = "";
      if (response.data.status) {
        statusMessage = `상태가 '${response.data.status}'(으)로 변경되었습니다.`;
      }

      if (bothSubmitted) {
        // 두 부서 모두 검증 완료
        let finalStatus = "";

        // 두 부서의 검증 상태를 확인하여 최종 상태 결정
        if (formData.verification_status && formData.ai_verification_status) {
          finalStatus = "검증 완료";
        } else if (
          !formData.verification_status &&
          !formData.ai_verification_status
        ) {
          finalStatus = "양쪽 모두 Drop 처리";
        } else if (!formData.verification_status) {
          finalStatus = "선임부서에서 Drop 처리";
        } else {
          finalStatus = "AI/DT 부서에서 Drop 처리";
        }

        alert(
          `AI/DT 검증 정보가 성공적으로 등록되었습니다.\n양쪽 모두 검증이 완료되어 ${finalStatus}되었습니다. ${statusMessage}`
        );

        // 잠시 대기 후 모달 닫기
        setTimeout(() => onClose(), 500);
      } else {
        // AI/DT만 검증 완료
        const selectionStatus = formData.ai_verification_status
          ? "검증"
          : "Drop";
        alert(
          `AI/DT 검증 정보가 성공적으로 등록되었습니다.\nAI/DT 부서에서 "${selectionStatus}" 상태로 처리되었습니다.\n아직 선임부서 검증이 완료되지 않았습니다. ${statusMessage}`
        );
      }

      // 성공 후 읽기 모드로 전환
      setViewMode(true);
    } catch (error) {
      console.error("AI/DT 검증 등록 오류:", error);
      handleApiError(error);
    } finally {
      setRightLoading(false);
    }
  };

  // 에러 처리 함수
  const handleApiError = (error) => {
    let errorMessage = "알 수 없는 오류가 발생했습니다.";

    if (error.response) {
      if (error.response.status === 400 && error.response.data.missingFields) {
        // 필수 필드 누락 오류
        const missingFields = error.response.data.missingFields.join(", ");
        errorMessage = `필수 항목이 누락되었습니다: ${missingFields}`;
      } else {
        // 다른 종류의 서버 오류
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          errorMessage;
      }
    } else {
      errorMessage = "서버 연결에 실패했습니다.";
    }

    // 팝업으로만 에러 메시지 표시
    alert(errorMessage);

    // 콘솔에 에러 로깅 (선택사항)
    console.error("API Error:", error);

    // 필요한 경우 추가적인 에러 처리 로직을 여기에 작성할 수 있습니다.
  };

  return (
    <div className="verifyModalOverlay">
      <div className="verifyModalContent">
        <div className="titleBox">
          <h2>{viewMode ? "아이디어 검증" : "아이디어 검증"}</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />
        {error && <div className="error-message">{error}</div>}

        <div className="left">
          <div className="titleWrap">
            <div className="subTitle">
              본사 선임부서
              <span className="subTitleDesc">*선임부서 의견란</span>
              {leftSubmitted && <span className="submittedTag">제출완료</span>}
            </div>
            <hr className="subTitleUnderline" />
          </div>
          {/* 개발 협업 */}
          <div className="rowContainer">
            <div className="fieldLabel">개발 협업</div>
            <FormControl className="fromControl">
              <RadioGroup
                row
                name="development_collaboration"
                className="radioGroup"
                value={formData.development_collaboration}
                onChange={handleChange("development_collaboration")}
                disabled={leftSubmitted || viewMode}
              >
                <FormControlLabel
                  value="전사"
                  control={<Radio disabled={leftSubmitted || viewMode} />}
                  label="전사"
                />
                <FormControlLabel
                  value="협업"
                  control={<Radio disabled={leftSubmitted || viewMode} />}
                  label="협업"
                />
                <FormControlLabel
                  value="자체"
                  control={<Radio disabled={leftSubmitted || viewMode} />}
                  label="자체"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* 대상 */}
          <div className="rowContainer">
            <div className="fieldLabel">사용대상</div>
            <FormControl className="fromControl">
              <RadioGroup
                row
                name="target_user"
                className="radioGroup"
                value={formData.target_user}
                onChange={handleChange("target_user")}
                disabled={leftSubmitted || viewMode}
              >
                <FormControlLabel
                  value="본부"
                  control={<Radio disabled={leftSubmitted || viewMode} />}
                  label="본부"
                />
                <FormControlLabel
                  value="팀"
                  control={<Radio disabled={leftSubmitted || viewMode} />}
                  label="팀"
                />
                <FormControlLabel
                  value="담당자"
                  control={<Radio disabled={leftSubmitted || viewMode} />}
                  label="담당자"
                />
                <FormControlLabel
                  value="Vendor"
                  control={<Radio disabled={leftSubmitted || viewMode} />}
                  label="Vendor"
                />
                <FormControlLabel
                  value="대외기관"
                  control={<Radio disabled={leftSubmitted || viewMode} />}
                  label="대외기관"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* 의견 작성 (comment) */}
          <div className="rowContainerComment">
            <div className="fieldLabel">의견작성</div>
            <FormControl className="fromControl" fullWidth>
              <TextField
                className="commentTextfield"
                variant="outlined"
                placeholder="의견을 작성해주세요"
                multiline
                rows={6}
                fullWidth
                value={formData.comment}
                onChange={handleChange("comment")}
                disabled={leftSubmitted || viewMode}
              />
            </FormControl>
          </div>

          {/* 검증 여부 (selection) */}
          <div className="rowContainer">
            <div className="fieldLabel">검증여부</div>
            <FormGroup className="fromControl">
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography>Drop</Typography>
                <Switch
                  checked={formData.verification_status}
                  onChange={handleSwitchChange("verification_status")}
                  inputProps={{ "aria-label": "verification status switch" }}
                  disabled={leftSubmitted || viewMode}
                />
                <Typography>검증</Typography>
              </Stack>
            </FormGroup>
          </div>

          {/* 왼쪽 버튼 컨테이너 */}
          <div className="buttonContainer leftButtonContainer">
            {viewMode && leftSubmitted ? (
              // 읽기 모드: 왼쪽 버튼 = 수정, 오른쪽 버튼 = 닫기
              <>
                <button
                  className="cancelButton"
                  onClick={handleLeftEdit}
                  disabled={leftLoading}
                >
                  수정
                </button>
                <button
                  className="registerButton"
                  onClick={onClose}
                  disabled={leftLoading}
                >
                  닫기
                </button>
              </>
            ) : (
              // 편집 모드: 선임부서 의견 등록 버튼
              !leftSubmitted &&
              !viewMode && (
                <button
                  className="registerButton"
                  onClick={handleLeftSubmit}
                  disabled={leftLoading}
                >
                  {leftLoading ? "등록 중..." : "선임부서 의견 등록"}
                </button>
              )
            )}
          </div>
        </div>

        <div className="right">
          <div className="titleWrap">
            <div className="subTitle">
              본사 AI/DT
              <span className="subTitleDesc">*AI/DT 의견란</span>
              {rightSubmitted && <span className="submittedTag">제출완료</span>}
            </div>
            <hr className="subTitleUnderline" />
          </div>

          {/* 검증 협업 */}
          <div className="rowContainer">
            <div className="fieldLabel">개발 협업</div>
            <FormControl className="fromControl">
              <RadioGroup
                row
                name="ai_development_collaboration"
                className="radioGroup"
                value={formData.ai_development_collaboration}
                onChange={handleChange("ai_development_collaboration")}
                disabled={rightSubmitted || viewMode}
              >
                <FormControlLabel
                  value="전사"
                  control={<Radio disabled={rightSubmitted || viewMode} />}
                  label="전사"
                />
                <FormControlLabel
                  value="협업"
                  control={<Radio disabled={rightSubmitted || viewMode} />}
                  label="협업"
                />
                <FormControlLabel
                  value="자체"
                  control={<Radio disabled={rightSubmitted || viewMode} />}
                  label="자체"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* 가능여부 */}
          <div className="rowContainer">
            <div className="fieldLabel">가능여부</div>
            <FormControl className="fromControl">
              <RadioGroup
                row
                name="feasibility"
                className="radioGroup"
                value={formData.feasibility}
                onChange={handleChange("feasibility")}
                disabled={rightSubmitted || viewMode}
              >
                <FormControlLabel
                  value="가능"
                  control={<Radio disabled={rightSubmitted || viewMode} />}
                  label="가능"
                />
                <FormControlLabel
                  value="불가능"
                  control={<Radio disabled={rightSubmitted || viewMode} />}
                  label="불가능"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* 의견 작성 (comment) */}
          <div className="rowContainerComment">
            <div className="fieldLabel">의견작성</div>
            <FormControl className="fromControl" fullWidth>
              <TextField
                className="commentTextfield"
                variant="outlined"
                placeholder="의견을 작성해주세요"
                multiline
                rows={6}
                fullWidth
                value={formData.ai_comment}
                onChange={handleChange("ai_comment")}
                disabled={rightSubmitted || viewMode}
              />
            </FormControl>
          </div>

          {/* 예상 투입인력 */}
          <div className="rowContainer">
            <div className="fieldLabel">예상 투입인력</div>
            <FormControl className="fromControl" fullWidth>
              <div className="inputWithUnit">
                <TextField
                  className="shortTextField"
                  variant="outlined"
                  placeholder="0"
                  rows={1}
                  value={formData.expected_personnel}
                  onChange={handleChange("expected_personnel")}
                  disabled={rightSubmitted || viewMode}
                />
                <span className="inputUnit">명</span>
              </div>
            </FormControl>
          </div>

          {/* 예상 일정 */}
          <div className="rowContainer">
            <div className="fieldLabel">예상 일정</div>
            <FormControl className="fromControl" fullWidth>
              <div className="inputWithUnit">
                <TextField
                  className="shortTextField"
                  variant="outlined"
                  placeholder="0"
                  rows={1}
                  value={formData.expected_schedule}
                  onChange={handleChange("expected_schedule")}
                  disabled={rightSubmitted || viewMode}
                />
                <span className="inputUnit">개월</span>
              </div>
            </FormControl>
          </div>

          {/* 선정 여부 (selection) */}
          <div className="rowContainer">
            <div className="fieldLabel">검증여부</div>
            <FormGroup className="fromControl">
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography>Drop</Typography>
                <Switch
                  checked={formData.ai_verification_status}
                  onChange={handleSwitchChange("ai_verification_status")}
                  inputProps={{ "aria-label": "ai verification status switch" }}
                  disabled={rightSubmitted || viewMode}
                />
                <Typography>검증</Typography>
              </Stack>
            </FormGroup>
          </div>

          {/* 오른쪽 버튼 컨테이너 */}
          <div className="buttonContainer rightButtonContainer">
            {viewMode && rightSubmitted ? (
              // 읽기 모드: 왼쪽 버튼 = 수정, 오른쪽 버튼 = 닫기
              <>
                <button
                  className="cancelButton"
                  onClick={handleRightEdit}
                  disabled={rightLoading}
                >
                  수정
                </button>
                <button
                  className="registerButton"
                  onClick={onClose}
                  disabled={rightLoading}
                >
                  닫기
                </button>
              </>
            ) : (
              // 편집 모드: AI/DT 의견 등록 버튼
              !rightSubmitted &&
              !viewMode && (
                <button
                  className="registerButton"
                  onClick={handleRightSubmit}
                  disabled={rightLoading}
                >
                  {rightLoading ? "등록 중..." : "AI/DT 의견 등록"}
                </button>
              )
            )}
          </div>
        </div>

        {/* 하단 버튼 컨테이너 (일반 닫기 버튼) */}
        <div className="buttonContainer">
          <button className="cancelButton" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaVerify;
