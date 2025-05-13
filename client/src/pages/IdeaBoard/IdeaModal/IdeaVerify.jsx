import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../../context/authContext";

const IdeaVerify = ({ onClose, ideaId, ideaData, isViewMode }) => {
  const { currentUser } = useContext(AuthContext);

  const [leftAuthor, setLeftAuthor] = useState("");
  const [rightAuthor, setRightAuthor] = useState("");

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
  const [leftEditMode, setLeftEditMode] = useState(
    !leftSubmitted && !isViewMode
  );
  const [rightEditMode, setRightEditMode] = useState(
    !rightSubmitted && !isViewMode
  );
  const [viewData, setViewData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // 기존 데이터 불러오기
  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        console.log("검증 데이터 불러오기 시작 - ideaId:", ideaId);
        const response = await axios.get(`/api/ideas/verify/${ideaId}`);

        if (response.data) {
          console.log("검증 데이터 로드 성공:", response.data);

          // 보존해야 할 데이터를 확실히 넣어주기
          const initialData = {
            // 기본값 설정
            verification_status: true,
            ai_verification_status: true,
            ...response.data, // API 응답으로 덮어쓰기
          };

          setFormData(initialData);
          setViewData(initialData);

          // 왼쪽/오른쪽 제출 상태 확인 (더 명확한 조건으로 수정)
          const hasLeftData =
            initialData.development_collaboration &&
            initialData.target_user &&
            initialData.comment &&
            initialData.comment.trim() !== "";

          const hasRightData =
            initialData.ai_development_collaboration &&
            initialData.feasibility &&
            initialData.ai_comment &&
            initialData.ai_comment.trim() !== "";

          console.log(
            "왼쪽 제출 상태 확인:",
            hasLeftData,
            initialData.development_collaboration,
            initialData.target_user,
            initialData.comment
          );
          console.log(
            "오른쪽 제출 상태 확인:",
            hasRightData,
            initialData.ai_development_collaboration,
            initialData.feasibility,
            initialData.ai_comment
          );

          if (hasLeftData) {
            setLeftSubmitted(true);
            console.log("왼쪽(선임부서) 제출 상태 설정: true");
          } else {
            setLeftSubmitted(false);
            console.log("왼쪽(선임부서) 제출 상태 설정: false");
          }

          if (hasRightData) {
            setRightSubmitted(true);
            console.log("오른쪽(AI/DT) 제출 상태 설정: true");
          } else {
            setRightSubmitted(false);
            console.log("오른쪽(AI/DT) 제출 상태 설정: false");
          }

          // 편집 모드 상태 설정 추가
          if (!isViewMode) {
            setLeftEditMode(!hasLeftData);
            setRightEditMode(!hasRightData);
            console.log(
              "편집 모드 상태 설정 - 왼쪽:",
              !hasLeftData,
              "오른쪽:",
              !hasRightData
            );
          } else {
            setLeftEditMode(false);
            setRightEditMode(false);
            console.log("뷰 모드로 설정되어 편집 모드 비활성화");
          }

          // 작성자 정보 저장
          if (response.data.left_author_id) {
            setLeftAuthor(response.data.left_author_id);
          }

          if (response.data.right_author_id) {
            setRightAuthor(response.data.right_author_id);
          }

          // 데이터 로드 완료 표시
          setDataLoaded(true);
        } else {
          console.log("검증 데이터 없음");
          setDataLoaded(true);
        }
      } catch (error) {
        console.error("검증 데이터 불러오기 실패:", error);
        setDataLoaded(true); // 에러 발생해도 데이터 로드 시도는 완료
      }
    };

    if (ideaId) {
      fetchVerificationData();
    }
  }, [ideaId]);

  // 읽기모드 변경 시 상태 설정
  useEffect(() => {
    console.log(
      "읽기 모드 변경 감지 - isViewMode:",
      isViewMode,
      "leftSubmitted:",
      leftSubmitted,
      "rightSubmitted:",
      rightSubmitted
    );

    setViewMode(isViewMode);

    if (isViewMode) {
      // 뷰 모드일 때는 항상 편집 모드 비활성화
      setLeftEditMode(false);
      setRightEditMode(false);
      console.log("뷰 모드로 설정되어 모든 편집 모드 비활성화");
    } else {
      // 편집 모드 설정 - 이미 제출된 섹션은 편집 모드 비활성화, 미제출 섹션은 활성화
      if (dataLoaded) {
        // 데이터 로딩이 완료된 경우에만 처리
        if (!leftSubmitted) {
          setLeftEditMode(true);
          console.log("왼쪽(선임부서) 미제출 상태로 편집 모드 활성화");
        } else {
          setLeftEditMode(false);
          console.log("왼쪽(선임부서) 제출 상태로 편집 모드 비활성화");
        }

        if (!rightSubmitted) {
          setRightEditMode(true);
          console.log("오른쪽(AI/DT) 미제출 상태로 편집 모드 활성화");
        } else {
          setRightEditMode(false);
          console.log("오른쪽(AI/DT) 제출 상태로 편집 모드 비활성화");
        }
      }
    }
  }, [isViewMode, leftSubmitted, rightSubmitted, dataLoaded]);

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

  // 편집 권한을 확인하는 함수 (선임부서 - 작성자 또는 Admin인 경우에만 수정 가능)
  const hasLeftEditPermission = () => {
    // 현재 사용자가 없는 경우 권한 없음
    if (!currentUser) return false;

    // Admin이거나 작성자인 경우 권한 있음
    return currentUser.isAdmin || currentUser.userId === leftAuthor;
  };

  // 편집 권한을 확인하는 함수 (AI/DT - 작성자 또는 Admin인 경우에만 수정 가능)
  const hasRightEditPermission = () => {
    // 현재 사용자가 없는 경우 권한 없음
    if (!currentUser) return false;

    // Admin이거나 작성자인 경우 권한 있음
    return currentUser.isAdmin || currentUser.userId === rightAuthor;
  };

  // 선임부서 편집 모드로 전환하는 함수
  const handleLeftEdit = () => {
    // 수정 권한이 있는지 확인
    if (hasLeftEditPermission()) {
      setLeftEditMode(true);
    } else {
      alert("수정 권한이 없습니다. 작성자 또는 관리자만 수정할 수 있습니다.");
    }
  };

  // AI/DT 편집 모드로 전환하는 함수
  const handleRightEdit = () => {
    // 수정 권한이 있는지 확인
    if (hasRightEditPermission()) {
      setRightEditMode(true);
    } else {
      alert("수정 권한이 없습니다. 작성자 또는 관리자만 수정할 수 있습니다.");
    }
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

      // console.log("등록할 선임부서 검증 데이터:", verifyData);

      // API 호출
      const response = await axios.post(
        "/api/ideas/verify/department",
        verifyData
      );

      // console.log("선임부서 검증 등록 성공:", response.data);

      // 응답 데이터로 폼 업데이트 - 기존 데이터 유지하면서 업데이트
      if (response.data) {
        // 새로운 데이터에서 받은 값만 업데이트하되 verification_status는 폼 데이터 값 유지
        const updatedData = {
          ...formData, // 기존 폼 데이터 유지
          ...response.data, // 새로운 응답 데이터로 업데이트
          // 검증 상태 확실히 명시 - 현재 폼의 상태 유지
          verification_status: formData.verification_status,
        };

        setFormData(updatedData);
        setViewData(updatedData);
      }

      setLeftSubmitted(true);
      setLeftEditMode(false);

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
          `선임부서 검증 정보가 성공적으로 등록되었습니다.\n양쪽 모두 검증 완료 결과 ${finalStatus}되었습니다. ${statusMessage}`
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
      setLeftEditMode(false);
    } catch (error) {
      // console.error("선임부서 검증 등록 오류:", error);
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

      // console.log("등록할 AI/DT 검증 데이터:", verifyData);

      // API 호출
      const response = await axios.post("/api/ideas/verify/ai", verifyData);

      // console.log("AI/DT 검증 등록 성공:", response.data);

      // 응답 데이터로 폼 업데이트 - 기존 데이터 유지하면서 업데이트
      if (response.data) {
        // 새로운 데이터에서 받은 값만 업데이트하되 ai_verification_status는 폼 데이터 값 유지
        const updatedData = {
          ...formData, // 기존 폼 데이터 유지
          ...response.data, // 새로운 응답 데이터로 업데이트
          // 검증 상태 확실히 명시 - 현재 폼의 상태 유지
          ai_verification_status: formData.ai_verification_status,
        };

        setFormData(updatedData);
        setViewData(updatedData);
      }

      setRightSubmitted(true);
      setRightEditMode(false);

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
          `AI/DT 검증 정보가 성공적으로 등록되었습니다.\n양쪽 모두 검증 완료 결과 ${finalStatus}되었습니다. ${statusMessage}`
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
      setRightEditMode(false);
    } catch (error) {
      // console.error("AI/DT 검증 등록 오류:", error);
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
    // console.error("API Error:", error);

    // 필요한 경우 추가적인 에러 처리 로직을 여기에 작성할 수 있습니다.
  };

  // 렌더링 직전에 상태 확인
  useEffect(() => {
    // console.log("현재 상태:", {
    //   viewMode,
    //   leftSubmitted,
    //   rightSubmitted,
    //   leftEditMode,
    //   rightEditMode,
    //   isViewMode,
    //   formData,
    //   ideaId,
    // });
  }, [
    viewMode,
    leftSubmitted,
    rightSubmitted,
    leftEditMode,
    rightEditMode,
    isViewMode,
    formData,
    ideaId,
  ]);

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
                disabled={!leftEditMode && (leftSubmitted || viewMode)}
              >
                <FormControlLabel
                  value="전사"
                  control={
                    <Radio
                      disabled={!leftEditMode && (leftSubmitted || viewMode)}
                    />
                  }
                  label="전사"
                />
                <FormControlLabel
                  value="협업"
                  control={
                    <Radio
                      disabled={!leftEditMode && (leftSubmitted || viewMode)}
                    />
                  }
                  label="협업"
                />
                <FormControlLabel
                  value="자체"
                  control={
                    <Radio
                      disabled={!leftEditMode && (leftSubmitted || viewMode)}
                    />
                  }
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
                disabled={!leftEditMode && (leftSubmitted || viewMode)}
              >
                <FormControlLabel
                  value="본부"
                  control={
                    <Radio
                      disabled={!leftEditMode && (leftSubmitted || viewMode)}
                    />
                  }
                  label="본부"
                />
                <FormControlLabel
                  value="팀"
                  control={
                    <Radio
                      disabled={!leftEditMode && (leftSubmitted || viewMode)}
                    />
                  }
                  label="팀"
                />
                <FormControlLabel
                  value="담당자"
                  control={
                    <Radio
                      disabled={!leftEditMode && (leftSubmitted || viewMode)}
                    />
                  }
                  label="담당자"
                />
                <FormControlLabel
                  value="Vendor"
                  control={
                    <Radio
                      disabled={!leftEditMode && (leftSubmitted || viewMode)}
                    />
                  }
                  label="Vendor"
                />
                <FormControlLabel
                  value="대외기관"
                  control={
                    <Radio
                      disabled={!leftEditMode && (leftSubmitted || viewMode)}
                    />
                  }
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
                disabled={!leftEditMode && (leftSubmitted || viewMode)}
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
                  disabled={!leftEditMode && (leftSubmitted || viewMode)}
                />
                <Typography>검증</Typography>
              </Stack>
            </FormGroup>
          </div>

          {/* 왼쪽 버튼 컨테이너 */}
          <div className="buttonContainer leftButtonContainer">
            {leftEditMode ? (
              // 편집 모드: 취소/등록 버튼
              <>
                <button
                  className="cancelButton"
                  onClick={() => {
                    setLeftEditMode(false);
                  }}
                  disabled={leftLoading}
                >
                  취소
                </button>
                <button
                  className="registerButton"
                  onClick={handleLeftSubmit}
                  disabled={leftLoading}
                >
                  {leftLoading ? "등록 중..." : "선임부서 의견 등록"}
                </button>
              </>
            ) : leftSubmitted ? (
              // 제출됨: 수정/닫기 버튼 표시
              <>
                <button
                  className="cancelButton"
                  onClick={handleLeftEdit}
                  disabled={leftLoading}
                >
                  수정
                </button>
                <button className="registerButton" onClick={onClose}>
                  닫기
                </button>
              </>
            ) : (
              // 미제출: 등록 버튼 표시
              <button
                className="registerButton"
                onClick={handleLeftEdit}
                disabled={leftLoading}
              >
                등록
              </button>
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
                disabled={!rightEditMode && (rightSubmitted || viewMode)}
              >
                <FormControlLabel
                  value="전사"
                  control={
                    <Radio
                      disabled={!rightEditMode && (rightSubmitted || viewMode)}
                    />
                  }
                  label="전사"
                />
                <FormControlLabel
                  value="협업"
                  control={
                    <Radio
                      disabled={!rightEditMode && (rightSubmitted || viewMode)}
                    />
                  }
                  label="협업"
                />
                <FormControlLabel
                  value="자체"
                  control={
                    <Radio
                      disabled={!rightEditMode && (rightSubmitted || viewMode)}
                    />
                  }
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
                disabled={!rightEditMode && (rightSubmitted || viewMode)}
              >
                <FormControlLabel
                  value="가능"
                  control={
                    <Radio
                      disabled={!rightEditMode && (rightSubmitted || viewMode)}
                    />
                  }
                  label="가능"
                />
                <FormControlLabel
                  value="불가능"
                  control={
                    <Radio
                      disabled={!rightEditMode && (rightSubmitted || viewMode)}
                    />
                  }
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
                disabled={!rightEditMode && (rightSubmitted || viewMode)}
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
                  disabled={!rightEditMode && (rightSubmitted || viewMode)}
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
                  disabled={!rightEditMode && (rightSubmitted || viewMode)}
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
                  disabled={!rightEditMode && (rightSubmitted || viewMode)}
                />
                <Typography>검증</Typography>
              </Stack>
            </FormGroup>
          </div>

          {/* 오른쪽 버튼 컨테이너 */}
          <div className="buttonContainer rightButtonContainer">
            {rightEditMode ? (
              // 편집 모드: 취소/등록 버튼
              <>
                <button
                  className="cancelButton"
                  onClick={() => {
                    setRightEditMode(false);
                  }}
                  disabled={rightLoading}
                >
                  취소
                </button>
                <button
                  className="registerButton"
                  onClick={handleRightSubmit}
                  disabled={rightLoading}
                >
                  {rightLoading ? "등록 중..." : "AI/DT 의견 등록"}
                </button>
              </>
            ) : rightSubmitted ? (
              // 제출됨: 수정/닫기 버튼 표시
              <>
                <button
                  className="cancelButton"
                  onClick={handleRightEdit}
                  disabled={rightLoading}
                >
                  수정
                </button>
                <button className="registerButton" onClick={onClose}>
                  닫기
                </button>
              </>
            ) : (
              // 미제출: 등록 버튼 표시
              <button
                className="registerButton"
                onClick={handleRightEdit}
                disabled={rightLoading}
              >
                등록
              </button>
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
