import React, { useState } from "react";
import "./ideaDevReview.scss";
import CloseIcon from "@mui/icons-material/Close";

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

  // 항목 이동 핸들러
  const moveToRight = () => {
    setRightItems([...rightItems, ...selectedLeft]); // 오른쪽 리스트에 추가
    setLeftItems(leftItems.filter((item) => !selectedLeft.includes(item))); // 왼쪽 리스트에서 제거
    setSelectedLeft([]); // 선택 초기화
  };

  const moveToLeft = () => {
    setLeftItems([...leftItems, ...selectedRight]); // 왼쪽 리스트에 추가
    setRightItems(rightItems.filter((item) => !selectedRight.includes(item))); // 오른쪽 리스트에서 제거
    setSelectedRight([]); // 선택 초기화
  };

  // 항목 선택 핸들러
  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item)); // 선택 해제
    } else {
      setSelectedItems([...selectedItems, item]); // 선택 추가
    }
  };

  // 표 렌더링 함수
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
          <button className="registerButton" onClick={onClose}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaDevReview;
