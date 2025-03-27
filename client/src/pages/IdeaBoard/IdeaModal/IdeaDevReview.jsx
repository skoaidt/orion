import React, { useState, useEffect } from "react";
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
import axios from "axios";

const TransferList = ({ onSelectedDevelopersChange }) => {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedLeft, setSelectedLeft] = useState([]);
  const [selectedRight, setSelectedRight] = useState([]);

  // 개발자 목록 가져오기
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/ideas/developers");

        // 서버에서 받은 개발자 데이터를 형식에 맞게 변환
        const developers = response.data.map((dev) => ({
          id: dev.id,
          no: dev.developerId,
          name: dev.name,
          dept: dev.team,
          project: dev.projectCount,
        }));

        // 초기에는 모든 개발자를 왼쪽 리스트에 배치
        setLeftItems(developers);
        setRightItems([]); // 오른쪽 리스트는 초기에 비어있음
        setError("");
      } catch (error) {
        console.error("개발자 목록 가져오기 오류:", error);
        setError("개발자 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  // rightItems가 변경될 때마다 부모 컴포넌트에게 전달
  useEffect(() => {
    const selectedDeveloperIds = rightItems.map((developer) => developer.id);
    onSelectedDevelopersChange(selectedDeveloperIds);
  }, [rightItems, onSelectedDevelopersChange]);

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
        {loading ? (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
              로딩 중...
            </td>
          </tr>
        ) : error ? (
          <tr>
            <td colSpan="4" style={{ textAlign: "center", color: "red" }}>
              {error}
            </td>
          </tr>
        ) : items.length === 0 ? (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
              데이터가 없습니다.
            </td>
          </tr>
        ) : (
          items.map((item) => (
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
          ))
        )}
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

const IdeaDevReview = ({ onClose, ideaId }) => {
  // 상태 변수 정의
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [startDate, setStartDate] = useState(dayjs()); // 오늘 날짜로 초기화
  const [endDate, setEndDate] = useState(dayjs().add(30, "day")); // 오늘로부터 30일 후로 초기화
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 우선순위 변경 핸들러
  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  // 날짜 변경 핸들러
  const handleStartDateChange = (newValue) => {
    if (newValue) {
      setStartDate(newValue);

      // 만약 시작일이 종료일보다 이후라면 종료일을 시작일 이후로 설정
      if (newValue.isAfter(endDate)) {
        setEndDate(newValue.add(7, "day"));
      }
    }
  };

  const handleEndDateChange = (newValue) => {
    if (newValue) {
      // 종료일이 시작일보다 이전이면 변경하지 않음
      if (newValue.isBefore(startDate)) {
        alert("종료일은 시작일 이후여야 합니다.");
        return;
      }
      setEndDate(newValue);
    }
  };

  const handleRegister = async () => {
    // 필수 필드 검증
    if (selectedDevelopers.length === 0) {
      alert("개발자를 한 명 이상 선택해주세요.");
      return;
    }

    if (!startDate) {
      alert("시작일자를 선택해주세요.");
      return;
    }

    if (!endDate) {
      alert("종료일자를 선택해주세요.");
      return;
    }

    if (!priority) {
      alert("우선순위를 선택해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 데이터 준비
      const devReviewData = {
        ideaID: ideaId || 1,
        developers: selectedDevelopers,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        priority: priority,
      };

      console.log("등록할 개발 심의 데이터:", devReviewData);

      // API 호출
      const response = await axios.post("/api/ideas/devreview", devReviewData);

      console.log("개발 심의 등록 성공:", response.data);
      alert("개발 심의 정보가 성공적으로 등록되었습니다.");

      onClose();
    } catch (error) {
      console.error("개발 심의 등록 오류:", error);

      // 서버에서 반환된 오류 메시지 표시
      if (error.response) {
        const errorMsg =
          error.response.data.error || "알 수 없는 오류가 발생했습니다.";
        setError(errorMsg);
        alert(`오류: ${errorMsg}`);
      } else {
        setError("서버 연결에 실패했습니다.");
        alert("서버 연결에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
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
        {error && <div className="error-message">{error}</div>}

        {/* 인력편성 */}
        <div className="manRowContainer">
          <div className="fieldLabel">인력 편성</div>
          <TransferList onSelectedDevelopersChange={setSelectedDevelopers} />
        </div>

        <div className="ScheduleRowContainer">
          <div className="fieldLabel">개발 일정</div>
          <div className="datePickerContainer">
            {/* 시작일자 */}
            <div className="dateLeft">
              <DatePickerComponent
                label="시작일자"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>

            {/* 종료일자 */}
            <div className="dateRight">
              <DatePickerComponent
                label="종료일자"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
        </div>

        {/* 우선순위 */}
        <div className="priorityRowContainer">
          <div className="fieldLabel">우선 순위</div>
          <FormControl className="formControl">
            <RadioGroup
              row
              name="priority-group"
              className="radioGroup"
              value={priority}
              onChange={handlePriorityChange}
            >
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
          <button className="cancelButton" onClick={onClose} disabled={loading}>
            취소
          </button>
          <button
            className="registerButton"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaDevReview;
