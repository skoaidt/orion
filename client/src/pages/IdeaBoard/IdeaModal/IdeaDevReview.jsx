import React, { useState } from "react";
import "./ideaDevReview.scss";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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

const IdeaDevReview = ({ onClose }) => {
  const handleRegister = () => {
    alert("등록되었습니다!"); // 등록 완료 메시지
    onClose(); // 모달 닫기
  };

  // 시작일과 종료일 상태 관리
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
  });

  // 시작일 변경 핸들러
  const handleStartDateChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, startDate: newValue }));
  };

  // 종료일 변경 핸들러
  const handleEndDateChange = (newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, endDate: newValue }));
  };

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

        {/* 개발일정 */}
        <div className="ScheduleRowContainer">
          <div className="fieldLabel">개발 일정</div>

          {/* ✅ 시작 날짜 선택 */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="시작일"
              value={filters.startDate}
              onChange={handleStartDateChange}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>

          {/* ✅ 종료 날짜 선택 */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="종료일"
              value={filters.endDate}
              onChange={handleEndDateChange}
              slotProps={{ textField: { size: "small" } }}
              style={{ marginLeft: "16px" }} // 간격 추가
            />
          </LocalizationProvider>

          {/* 선택된 날짜 표시 */}
          {filters.startDate && filters.endDate && (
            <p style={{ marginTop: "8px" }}>
              선택된 기간: {dayjs(filters.startDate).format("YYYY-MM-DD")} ~{" "}
              {dayjs(filters.endDate).format("YYYY-MM-DD")}
            </p>
          )}
        </div>

        {/* 우선순위 */}
        <div className="priorityRowContainer">
          <div className="fieldLabel">우선 순위</div>
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
