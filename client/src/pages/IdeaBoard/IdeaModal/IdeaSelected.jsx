import React, { useState, useEffect } from "react";
import "./ideaSelected.scss";
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

const IdeaSelected = ({ onClose, ideaId, ideaData, isViewMode }) => {
  // 상태 변수 정의
  const [duplication, setDuplication] = useState("");
  const [scope, setScope] = useState("");
  const [comment, setComment] = useState("");
  const [isSelected, setIsSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewData, setViewData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [viewMode, setViewMode] = useState(isViewMode); // 읽기모드 상태 추가

  // 이미 완료된 단계인 경우 데이터 조회
  useEffect(() => {
    const fetchSelectionData = async () => {
      if (!ideaId) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/ideas/selection/${ideaId}`);
        console.log("선정 데이터 조회 결과:", response.data);

        // 데이터가 있으면 상태 업데이트
        if (response.data) {
          setViewData(response.data);
          // 폼에도 데이터 설정
          setDuplication(response.data.duplication || "");
          setScope(response.data.scope || "");
          setComment(response.data.comment || "");
          setIsSelected(
            response.data.is_selected !== undefined
              ? response.data.is_selected
              : true
          );
        }
      } catch (error) {
        console.error("선정 데이터 조회 오류:", error);
        if (viewMode) {
          setError("저장된 선정 데이터를 불러올 수 없습니다.");
        }
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    };

    fetchSelectionData();
  }, [ideaId, viewMode]);

  // 읽기모드 변경 시 상태 설정
  useEffect(() => {
    setViewMode(isViewMode);
  }, [isViewMode]);

  // 과제중복 라디오 버튼 변경 핸들러
  const handleDuplicationChange = (event) => {
    setDuplication(event.target.value);
  };

  // 사용범위 라디오 버튼 변경 핸들러
  const handleScopeChange = (event) => {
    setScope(event.target.value);
  };

  // 의견작성 텍스트필드 변경 핸들러
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  // 선정여부 스위치 변경 핸들러
  const handleSelectionChange = (event) => {
    setIsSelected(event.target.checked);
  };

  // 편집 모드로 전환하는 함수
  const handleEdit = () => {
    setViewMode(false);
  };

  // 등록 버튼 클릭 핸들러
  const handleSubmit = async () => {
    // 필수 입력 필드 확인
    if (!duplication) {
      alert("과제중복 항목을 선택해주세요.");
      return;
    }

    if (!scope) {
      alert("사용범위 항목을 선택해주세요.");
      return;
    }

    if (!comment.trim()) {
      alert("의견을 작성해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 데이터 준비
      const selectionData = {
        duplication,
        scope,
        comment,
        is_selected: isSelected,
      };

      // ideaId 디버깅
      console.log("아이디어 ID:", ideaId);
      console.log("등록할 과제 선정 데이터:", selectionData);

      // API 호출 - ideaId가 있으면 URL 파라미터로 전달, 없으면 기존 방식 사용
      let response;
      if (ideaId && ideaId !== "undefined" && ideaId !== "null") {
        // URL 파라미터로 아이디어 ID 전달
        response = await axios.post(
          `/api/ideas/selection/${ideaId}`,
          selectionData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // 에러 처리 - 아이디어 ID가 필요함
        alert("아이디어 ID가 필요합니다. 다시 시도해주세요.");
        setError("아이디어 ID가 필요합니다");
        setLoading(false);
        return;
      }

      console.log("과제 선정 등록 성공:", response.data);
      // 결과에서 idea_id 확인 (기존에는 selectionId를 확인했을 수 있음)
      console.log("결과 - 아이디어 ID:", response.data.idea_id);

      alert("과제 선정 정보가 성공적으로 등록되었습니다.");

      // 등록 성공 후 데이터 업데이트 및 읽기 모드로 전환
      setViewData(response.data);
      setViewMode(true);
    } catch (error) {
      console.error("과제 선정 등록 오류:", error);

      // 서버에서 반환된 오류 메시지 표시
      if (error.response) {
        if (
          error.response.status === 400 &&
          error.response.data.missingFields
        ) {
          // 필수 필드 누락 오류
          const missingFields = error.response.data.missingFields.join(", ");
          setError(`필수 항목이 누락되었습니다: ${missingFields}`);
          alert(`필수 항목이 누락되었습니다: ${missingFields}`);
        } else {
          // 다른 종류의 서버 오류
          setError(
            error.response.data.error ||
              error.response.data.message ||
              "알 수 없는 오류가 발생했습니다."
          );
          alert(
            `오류: ${
              error.response.data.error ||
              error.response.data.message ||
              "알 수 없는 오류가 발생했습니다."
            }`
          );
        }
      } else {
        setError("서버 연결에 실패했습니다.");
        alert("서버 연결에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="selectedModalOverlay">
      <div className="selectedModalContent">
        <div className="titleBox">
          <h2>{viewMode ? "과제 선정" : "과제 선정"}</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />

        {/* 로딩 메시지 표시 */}
        {/* {loading && (
          <div className="loadingMessage">데이터를 불러오는 중입니다...</div>
        )} */}

        {/* 오류 메시지 표시 */}
        {error && <div className="errorMessage">{error}</div>}

        {/* 데이터가 없는 경우 메시지 표시 (읽기 모드일 때만) */}
        {viewMode && dataLoaded && !viewData && !loading && (
          <div className="noDataMessage">저장된 선정 데이터가 없습니다.</div>
        )}

        {(!viewMode || (viewMode && dataLoaded && viewData)) && (
          <>
            {/* 중복 (duplication) */}
            <div className="rowContainer">
              <div className="fieldLabel">과제중복</div>
              <FormControl className="fromControl">
                <RadioGroup
                  row
                  name="duplication-group"
                  className="radioGroup"
                  value={duplication}
                  onChange={handleDuplicationChange}
                  disabled={viewMode}
                >
                  <FormControlLabel
                    value="신규"
                    control={<Radio disabled={viewMode} />}
                    label="신규"
                  />
                  <FormControlLabel
                    value="기존 시스템 고도화"
                    control={<Radio disabled={viewMode} />}
                    label="기존 시스템 고도화"
                  />
                  <FormControlLabel
                    value="기존 시스템 기능추가"
                    control={<Radio disabled={viewMode} />}
                    label="기존 시스템 기능추가"
                  />
                  <FormControlLabel
                    value="타 시스템 중복"
                    control={<Radio disabled={viewMode} />}
                    label="타 시스템 중복"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {/* 사용 범위 (scope) */}
            <div className="rowContainer">
              <div className="fieldLabel">사용범위</div>
              <FormControl className="fromControl">
                <RadioGroup
                  row
                  name="scope-group"
                  className="radioGroup"
                  value={scope}
                  onChange={handleScopeChange}
                  disabled={viewMode}
                >
                  <FormControlLabel
                    value="TBOH"
                    control={<Radio disabled={viewMode} />}
                    label="TBOH"
                  />
                  <FormControlLabel
                    value="TO"
                    control={<Radio disabled={viewMode} />}
                    label="TO"
                  />
                  <FormControlLabel
                    value="OBH"
                    control={<Radio disabled={viewMode} />}
                    label="OBH"
                  />
                  <FormControlLabel
                    value="자체사용"
                    control={<Radio disabled={viewMode} />}
                    label="자체사용"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {/* 의견 작성 (comment) */}
            <div className="rowContainerComment">
              <div className="fieldLabel">의견작성</div>
              <TextField
                className="commentTextfield"
                variant="outlined"
                placeholder="의견을 작성해주세요"
                multiline
                rows={6}
                fullWidth
                value={comment}
                onChange={handleCommentChange}
                disabled={viewMode}
                InputProps={{
                  readOnly: viewMode,
                }}
              />
            </div>

            {/* 선정 여부 (selection) */}
            <div className="rowContainer">
              <div className="fieldLabel">선정여부</div>
              <FormGroup className="fromControl">
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Typography>Drop</Typography>
                  <Switch
                    checked={isSelected}
                    onChange={handleSelectionChange}
                    inputProps={{ "aria-label": "selection switch" }}
                    disabled={viewMode}
                  />
                  <Typography>선정</Typography>
                </Stack>
              </FormGroup>
            </div>

            {/* 버튼 컨테이너 */}
            <div className="buttonContainer">
              {viewMode ? (
                // 읽기 모드: 왼쪽 버튼 = 수정, 오른쪽 버튼 = 닫기
                <>
                  {viewData && (
                    <button
                      className="cancelButton"
                      onClick={handleEdit}
                      disabled={loading}
                    >
                      수정
                    </button>
                  )}
                  <button
                    className="registerButton"
                    onClick={onClose}
                    disabled={loading}
                  >
                    닫기
                  </button>
                </>
              ) : (
                // 편집 모드: 왼쪽 버튼 = 취소, 오른쪽 버튼 = 등록
                <>
                  <button
                    className="cancelButton"
                    onClick={onClose}
                    disabled={loading}
                  >
                    취소
                  </button>
                  <button
                    className="registerButton"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    등록
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaSelected;
