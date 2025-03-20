import React from "react";
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

const IdeaSelected = ({ onClose }) => {
  return (
    <div className="selectedModalOverlay">
      <div className="selectedModalContent">
        <div className="titleBox">
          <h2>과제 선정</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />
        {/* 중복 (duplication) */}
        <div className="rowContainer">
          <div className="fieldLabel">과제중복</div>
          <FormControl className="fromControl">
            <RadioGroup row name="duplication-group" className="radioGroup">
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
            <RadioGroup row name="scope-group" className="radioGroup">
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
          />
        </div>

        {/* 선정 여부 (selection) */}
        <div className="rowContainer">
          <div className="fieldLabel">선정여부</div>
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

export default IdeaSelected;
