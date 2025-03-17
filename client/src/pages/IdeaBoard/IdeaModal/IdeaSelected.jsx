import React from "react";
import "./ideaSelected.scss";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch'; // 기본 Switch 컴포넌트 사용

const IdeaSelected = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>과제 선정</h2>

        {/* 중복 (duplication) */}
        <div className="rowContainer">
          <div className="field-label">과제중복</div>
          <FormControl className="fromControl">
            <RadioGroup row name="duplication-group" className="radioGroup">
              <FormControlLabel value="신규" control={<Radio />} label="신규" />
              <FormControlLabel value="기존 시스템 고도화" control={<Radio />} label="기존 시스템 고도화" />
              <FormControlLabel value="기존 시스템 기능추가" control={<Radio />} label="기존 시스템 기능추가" />
              <FormControlLabel value="타 시스템 중복" control={<Radio />} label="타 시스템 중복" />
            </RadioGroup>
          </FormControl>
        </div>

        {/* 사용 범위 (scope) */}
        <div className="rowContainer">
          <div className="field-label">사용범위</div>
          <FormControl className="fromControl">
            <RadioGroup row name="scope-group" className="radioGroup">
              <FormControlLabel value="TBOH" control={<Radio />} label="TBOH" />
              <FormControlLabel value="TO" control={<Radio />} label="TO" />
              <FormControlLabel value="OBH" control={<Radio />} label="OBH" />
              <FormControlLabel value="자체사용" control={<Radio />} label="O자체사용" />
            </RadioGroup>
          </FormControl>
        </div>

        {/* 의견 작성 (comment) */}
        <div className="rowContainerComment">
          <div className="field-label">의견작성</div>
          <TextField className="comment-textfield"
            variant="outlined"
            placeholder="의견을 작성해주세요"
            multiline
            rows={4}
            fullWidth
          />
        </div>

        {/* 선정 여부 (selection) */}
        <div className="rowContainer">
          <div className="field-label">선정여부</div>
          <FormGroup className="fromControl">
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography>Drop</Typography>
              <Switch defaultChecked inputProps={{ 'aria-label': 'default switch' }} />
              <Typography>선정</Typography>
            </Stack>
          </FormGroup>
        </div>
        {/* 버튼 (button) */}  
        <div className="buttonContainer">
          <button onClick={onClose}>취소</button>
          <button onClick={onClose}>등록</button>
        </div>   
      </div>
    </div>
  );
};

export default IdeaSelected;
