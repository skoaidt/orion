import React, { useState } from "react";
import "./ideaDevReview.scss";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker"; // StaticDatePicker 추가
import dayjs from "dayjs";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const TransferList = () => {
  const [leftItems, setLeftItems] = useState([
    { id: 1, no: "001", name: "최종언", dept: "AI/DT개발팀", project: "3" },
    { id: 2, no: "002", name: "남정수", dept: "AI/DT기획팀", project: "4" },
    { id: 4, no: "004", name: "손지호", dept: "AI/DT기획팀", project: "5" },
  ]);
  const [rightItems, setRightItems] = useState([
    { id: 3, no: "003", name: "강병구", dept: "AI/DT기획팀", project: "4" },
  ]);

  const [selectedLeft, setSelectedLeft] = useState([]);
  const [selectedRight, setSelectedRight] = useState([]);

  const moveToRight = () => {
    setRightItems([...rightItems, ...selectedLeft]);
    setLeftItems(leftItems.filter((item) => !selectedLeft.includes(item)));
    setSelectedLeft([]);
  };

  const moveToLeft = () => {
    setLeftItems([...leftItems, ...selectedRight]);
    setRightItems(rightItems.filter((item) => !selectedRight.includes(item)));
    setSelectedRight([]);
  };

  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const renderTable = (items, selectedItems, setSelectedItems, className) => (
    <table className={`table ${className}`}>
      <thead>
        <tr>
          <th>No</th>
          <th>성명</th>
          <th>소속</th>
          <th>Project(건)</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            onClick={() =>
              toggleSelection(item, selectedItems, setSelectedItems)
            }
            className={selectedItems.includes(item) ? "selected" : ""}
          >
            <td>{item.no}</td>
            <td>{item.name}</td>
            <td>{item.dept}</td>
            <td>{item.project}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="transferTable">
      {/* 왼쪽 리스트 */}
      <div className="transferList">
        {renderTable(leftItems, selectedLeft, setSelectedLeft, "left")}
      </div>

      {/* 이동 버튼 */}
      <div className="transferButton">
        {/* 오른쪽으로 이동 버튼 */}
        <img
          src={`${process.env.PUBLIC_URL}/image/icons/right.png`}
          alt="오른쪽 이동"
          className={`moveButton ${
            selectedLeft.length === 0 ? "disabled" : ""
          }`}
          onClick={moveToRight}
        />
        {/* 왼쪽으로 이동 버튼 */}
        <img
          src={`${process.env.PUBLIC_URL}/image/icons/left.png`}
          alt="왼쪽 이동"
          className={`moveButton ${
            selectedRight.length === 0 ? "disabled" : ""
          }`}
          onClick={moveToLeft}
        />
      </div>

      {/* 오른쪽 리스트 */}
      <div className="transferList">
        {renderTable(rightItems, selectedRight, setSelectedRight, "right")}
      </div>
    </div>
  );
};

const DatePickerComponent = ({ label, value, onChange }) => {
  return (
    <div className="datePickerWrapper">
      {/* 날짜 라벨 */}
      <p>
        {label}: {value ? dayjs(value).format("YYYY-MM-DD") : "미정"}
      </p>

      {/* Material-UI DatePicker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={onChange}
        />
      </LocalizationProvider>
    </div>
  );
};

const IdeaDevReview = ({ onClose }) => {
  const handleRegister = () => {
    alert("등록되었습니다!");
    onClose();
  };

  // 시작일과 종료일 상태 관리
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="reviewModalOverlay">
      <div className="reviewModalContent">
        {/* 제목 */}
        <div className="titleBox">
          <h2>개발 심의</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />

        {/* 인력편성 */}
        <div className="manRowContainer">
          <div className="fieldLabel">인력 편성</div>
          <TransferList />
        </div>

        <div className="ScheduleRowContainer">
          <div className="fieldLabel">개발 일정</div>
          <div className="datePickerContainer">
            {/* 시작일자 */}
            <div className="dateLeft">
              <DatePickerComponent
                label="시작일자"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
            </div>

            {/* 종료일자 */}
            <div className="dateRight">
              <DatePickerComponent
                label="종료일자"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
            </div>
          </div>
        </div>

        {/* 우선순위 */}
        <div className="priorityRowContainer">
          <div className="fieldLabel">우선 순위</div>
          <FormControl className="formControl">
            <RadioGroup row name="scope-group" className="radioGroup">
              <FormControlLabel
                value="1순위"
                control={<Radio />}
                label="1순위"
              />
              <FormControlLabel
                value="2순위"
                control={<Radio />}
                label="2순위"
              />
              <FormControlLabel
                value="3순위"
                control={<Radio />}
                label="3순위"
              />
            </RadioGroup>
          </FormControl>
        </div>

        {/* 등록취소 */}
        <div className="buttonContainer">
          <button className="cancelButton" onClick={onClose}>
            취소
          </button>
          <button
            className="registerButton"
            onClick={handleRegister} // 등록 버튼 클릭 시 처리
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaDevReview;
