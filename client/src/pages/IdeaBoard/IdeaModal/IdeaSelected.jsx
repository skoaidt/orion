import React, { useState } from "react";
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

const IdeaSelected = ({ onClose, ideaId }) => {
  // 상태 변수 정의
  const [duplication, setDuplication] = useState("");
  const [scope, setScope] = useState("");
  const [comment, setComment] = useState("");
  const [isSelected, setIsSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        idea_id: ideaId || 1, // ideaId가 전달되지 않은 경우 테스트용으로 1 사용
        duplication,
        scope,
        comment,
        is_selected: isSelected,
      };

      console.log("등록할 과제 선정 데이터:", selectionData);

      // API 호출
      const response = await axios.post("/api/ideas/selection", selectionData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("과제 선정 등록 성공:", response.data);
      alert("과제 선정 정보가 성공적으로 등록되었습니다.");

      // 성공 후 모달 닫기
      onClose();
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
          <h2>과제 선정</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />

        {/* 오류 메시지 표시 */}
        {error && <div className="errorMessage">{error}</div>}

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
            >
              <FormControlLabel value="신규" control={<Radio />} label="신규" />
              <FormControlLabel
                value="기존 시스템 고도화"
                control={<Radio />}
                label="기존 시스템 고도화"
              />
              <FormControlLabel
                value="기존 시스템 기능추가"
                control={<Radio />}
                label="기존 시스템 기능추가"
              />
              <FormControlLabel
                value="타 시스템 중복"
                control={<Radio />}
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
            >
              <FormControlLabel value="TBOH" control={<Radio />} label="TBOH" />
              <FormControlLabel value="TO" control={<Radio />} label="TO" />
              <FormControlLabel value="OBH" control={<Radio />} label="OBH" />
              <FormControlLabel
                value="자체사용"
                control={<Radio />}
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
          />
        </div>

        {/* 선정 여부 (selection) */}
        <div className="rowContainer">
          <div className="fieldLabel">선정여부</div>
          <FormGroup className="fromControl">
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography>Drop</Typography>
              <Switch
                checked={isSelected}
                onChange={handleSelectionChange}
                inputProps={{ "aria-label": "selection switch" }}
              />
              <Typography>선정</Typography>
            </Stack>
          </FormGroup>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="buttonContainer">
          <button className="cancelButton" onClick={onClose} disabled={loading}>
            취소
          </button>
          <button
            className="registerButton"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "처리 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaSelected;
