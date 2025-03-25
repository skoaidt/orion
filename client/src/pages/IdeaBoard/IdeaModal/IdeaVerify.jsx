import React, { useState } from "react";
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

const IdeaVerify = ({ onClose, ideaId }) => {
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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      // 필수 필드 검증
      const requiredFields = [
        "development_collaboration",
        "target_user",
        "comment",
        "ai_development_collaboration",
        "feasibility",
        "ai_comment",
      ];

      const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].toString().trim() === ""
      );

      if (missingFields.length > 0) {
        setError("모든 필수 항목을 입력해주세요.");
        return;
      }

      const response = await fetch("/api/ideas/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea_id: ideaId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "검증 정보 등록에 실패했습니다.");
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verifyModalOverlay">
      <div className="verifyModalContent">
        <div className="titleBox">
          <h2>선임부서 과제 검증</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />
        {error && <div className="error-message">{error}</div>}

        <div className="left">
          <div className="titleWrap">
            <div className="subTitle">
              본사 선임부서
              <span className="subTitleDesc">*선임부서 의견란</span>
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
              >
                <FormControlLabel
                  value="전사"
                  control={<Radio />}
                  label="전사"
                />
                <FormControlLabel
                  value="협업"
                  control={<Radio />}
                  label="협업"
                />
                <FormControlLabel
                  value="자체"
                  control={<Radio />}
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
              >
                <FormControlLabel
                  value="본부"
                  control={<Radio />}
                  label="본부"
                />
                <FormControlLabel value="팀" control={<Radio />} label="팀" />
                <FormControlLabel
                  value="담당자"
                  control={<Radio />}
                  label="담당자"
                />
                <FormControlLabel
                  value="Vendor"
                  control={<Radio />}
                  label="Vendor"
                />
                <FormControlLabel
                  value="대외기관"
                  control={<Radio />}
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
                  checked={!formData.verification_status}
                  onChange={handleSwitchChange("verification_status")}
                  inputProps={{ "aria-label": "verification status switch" }}
                />
                <Typography>검증</Typography>
              </Stack>
            </FormGroup>
          </div>
        </div>

        <div className="right">
          <div className="titleWrap">
            <div className="subTitle">
              본사 AI/DT
              <span className="subTitleDesc">*AI/DT 의견란</span>
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
              >
                <FormControlLabel
                  value="전사"
                  control={<Radio />}
                  label="전사"
                />
                <FormControlLabel
                  value="협업"
                  control={<Radio />}
                  label="협업"
                />
                <FormControlLabel
                  value="자체"
                  control={<Radio />}
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
              >
                <FormControlLabel
                  value="가능"
                  control={<Radio />}
                  label="가능"
                />
                <FormControlLabel
                  value="불가능"
                  control={<Radio />}
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
                  checked={!formData.ai_verification_status}
                  onChange={handleSwitchChange("ai_verification_status")}
                  inputProps={{ "aria-label": "ai verification status switch" }}
                />
                <Typography>검증</Typography>
              </Stack>
            </FormGroup>
          </div>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="buttonContainer">
          <button className="cancelButton" onClick={onClose}>
            취소
          </button>
          <button
            className="registerButton"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaVerify;
