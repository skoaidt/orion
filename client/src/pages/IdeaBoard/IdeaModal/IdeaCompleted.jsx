import React, { useState, useRef } from "react";
import "./ideaCompleted.scss";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import axios from "axios";

const IdeaCompleted = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // 파일 선택 핸들러
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // 파일 첨부 버튼 클릭 핸들러
  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  // 등록 버튼 클릭 핸들러
  const handleRegister = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("path", "Completed"); // 저장 경로 지정

        // 서버에 파일 업로드 요청
        await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("파일 업로드 성공:", selectedFile.name);
        alert("파일이 성공적으로 업로드되었습니다.");
      }

      // 여기에 다른 데이터 처리 로직 추가

      // 등록 완료 후 모달 닫기
      onClose();
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="completedModalOverlay">
      <div className="completedModalContent">
        <div className="titleBox">
          <h2>완료 : Solution 등록</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />

        <div className="rowContainerComment">
          <TextField
            className="commentTextfield"
            variant="outlined"
            placeholder="[영문명] Solution Name*"
            multiline
            fullWidth
          />
        </div>

        <div className="rowContainerComment">
          <TextField
            className="commentTextfield"
            variant="outlined"
            placeholder="[영문명] Solution Full Name"
            multiline
            fullWidth
          />
        </div>

        <div className="rowContainerComment">
          <TextField
            className="commentTextfield"
            variant="outlined"
            placeholder="[한글명] 솔루션 명칭"
            multiline
            fullWidth
          />
        </div>

        <div className="rowContainerComment">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                className="commentTextfield"
                variant="outlined"
                placeholder="[N사번] 개발자 사번*"
                multiline
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="datePicker"
                  label="개발 완료일"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  format="YYYY.MM.DD"
                  slotProps={{
                    textField: { fullWidth: true, variant: "outlined" },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </div>

        <div className="rowContainerComment">
          <TextField
            className="commentTextfield"
            variant="outlined"
            placeholder="Solution 바로가기 Link"
            multiline
            fullWidth
          />
        </div>

        <div className="rowContainerComment">
          <TextField
            className="commentTextfield"
            variant="outlined"
            placeholder="Github 바로가기 Link"
            multiline
            fullWidth
          />
        </div>

        <div className="rowContainer">
          <div className="fieldLabel">업무 직군</div>
          <FormControl className="fromControl">
            <RadioGroup row name="duplication-group" className="radioGroup">
              <FormControlLabel value="RM" control={<Radio />} label="RM" />
              <FormControlLabel
                value="Access"
                control={<Radio />}
                label="Access"
              />
              <FormControlLabel value="전송" control={<Radio />} label="전송" />
              <FormControlLabel
                value="Infra설비"
                control={<Radio />}
                label="Infra설비"
              />
              <FormControlLabel value="자산" control={<Radio />} label="자산" />
              <FormControlLabel value="SO" control={<Radio />} label="SO" />
              <FormControlLabel value="경영" control={<Radio />} label="경영" />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="rowContainer">
          <div className="fieldLabel">사용 여부</div>
          <FormControl className="fromControl">
            <RadioGroup row name="duplication-group" className="radioGroup">
              <FormControlLabel value="Y" control={<Radio />} label="사용(Y)" />
              <FormControlLabel
                value="N"
                control={<Radio />}
                label="미사용(N)"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="rowContainerComment fileAttachContainer">
          <div className="fileInputWrapper">
            <TextField
              className="commentTextfield fileInput"
              variant="outlined"
              placeholder="파일 첨부"
              value={selectedFile ? selectedFile.name : "첨부된 파일 없음"}
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Button
                    onClick={handleAttachClick}
                    className="attachButton"
                    startIcon={<AttachFileIcon />}
                    style={{
                      whiteSpace: "nowrap",
                      minWidth: "100px",
                      padding: "4px 10px",
                      margin: "4px",
                    }}
                    size="small"
                  >
                    파일첨부
                  </Button>
                ),
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="buttonContainer">
          <button className="cancelButton" onClick={onClose}>
            취소
          </button>
          <button className="registerButton" onClick={handleRegister}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCompleted;
