import React from "react";
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

const IdeaVerify = ({ onClose }) => {
  return (
    <div className="verifyModalOverlay">
      <div className="verifyModalContent">
        <div className="titleBox">
          <h2>선임부서 과제 검증</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />

        <div className="left">
          <div className="titleWrap">
            <div className="subTitle">
              본사 선임부서
              <span className="subTitleDesc">*선임부서 의견란</span>
            </div>
            <hr className="subTitleUnderline" />
          </div>
          {/* 중복 (duplication) */}
          <div className="rowContainer">
            <div className="fieldLabel">개발 협업</div>
            <FormControl className="fromControl">
              <RadioGroup row name="duplication-group" className="radioGroup">
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

          {/* 중복 (duplication) */}
          <div className="rowContainer">
            <div className="fieldLabel">대상</div>
            <FormControl className="fromControl">
              <RadioGroup row name="duplication-group" className="radioGroup">
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
              />
            </FormControl>
          </div>

          {/* 선정 여부 (selection) */}
          <div className="rowContainer">
            <div className="fieldLabel">검증여부</div>
            <FormGroup className="fromControl">
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography>Drop</Typography>
                <Switch
                  defaultChecked
                  inputProps={{ "aria-label": "default switch" }}
                />
                <Typography>선정</Typography>
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

          {/* 개발 협업 */}
          <div className="rowContainer">
            <div className="fieldLabel">개발 협업</div>
            <FormControl className="fromControl">
              <RadioGroup
                row
                name="ai-collaboration-group"
                className="radioGroup"
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
            <div className="fieldLabel">대상</div>
            <FormControl className="fromControl">
              <RadioGroup row name="ai-target-group" className="radioGroup">
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
                  defaultChecked
                  inputProps={{ "aria-label": "default switch" }}
                />
                <Typography>선정</Typography>
              </Stack>
            </FormGroup>
          </div>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="buttonContainer">
          <button className="cancelButton" onClick={onClose}>
            취소
          </button>
          <button className="registerButton" onClick={onClose}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaVerify;
