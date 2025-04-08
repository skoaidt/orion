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

const TransferList = ({
  onSelectedDevelopersChange,
  initialSelectedDevelopers = [],
  isViewMode = false,
}) => {
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
          no: dev.n_id, // n_id 필드 사용
          name: dev.name,
          team: dev.team,
          headqt: dev.headqt,
        }));

        // 초기 선택된 개발자가 있으면 오른쪽 리스트에 배치
        if (initialSelectedDevelopers && initialSelectedDevelopers.length > 0) {
          // 초기 선택된 개발자들의 ID 목록
          const selectedIds = initialSelectedDevelopers.map(
            (dev) => dev.no || dev.n_id
          );

          // 오른쪽 리스트에 배치할 개발자들
          const initialRightItems = developers.filter((dev) =>
            selectedIds.includes(dev.no)
          );

          // 왼쪽 리스트에 배치할 개발자들 (선택되지 않은 개발자들)
          const initialLeftItems = developers.filter(
            (dev) => !selectedIds.includes(dev.no)
          );

          setLeftItems(initialLeftItems);
          setRightItems(initialRightItems);
        } else {
          // 초기 선택된 개발자가 없으면 모든 개발자를 왼쪽 리스트에 배치
          setLeftItems(developers);
          setRightItems([]); // 오른쪽 리스트는 비어있음
        }

        setError("");
      } catch (error) {
        console.error("개발자 목록 가져오기 오류:", error);
        setError("개발자 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, [initialSelectedDevelopers]);

  // rightItems가 변경될 때마다 부모 컴포넌트에게 전달
  useEffect(() => {
    // 개발자 ID만 전송하는 대신 선택된 개발자 객체 전체를 전송
    onSelectedDevelopersChange(rightItems);
  }, [rightItems, onSelectedDevelopersChange]);

  const moveToRight = () => {
    if (isViewMode) return; // 조회 모드일 경우 이동 불가
    setRightItems([...rightItems, ...selectedLeft]);
    setLeftItems(leftItems.filter((item) => !selectedLeft.includes(item)));
    setSelectedLeft([]);
  };

  const moveToLeft = () => {
    if (isViewMode) return; // 조회 모드일 경우 이동 불가
    setLeftItems([...leftItems, ...selectedRight]);
    setRightItems(rightItems.filter((item) => !selectedRight.includes(item)));
    setSelectedRight([]);
  };

  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (isViewMode) return; // 조회 모드일 경우 선택 불가
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const renderTable = (items, selectedItems, setSelectedItems, className) => (
    <div className="tableContainer">
      <h3 className="tableTitle">
        {className === "left" ? "개발자 List" : "참여 개발자"}
      </h3>
      <table className={`table ${className}`}>
        <thead>
          <tr>
            <th>본부</th>
            <th>소속</th>
            <th>성명</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="status-cell loading">
                로딩 중...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="3" className="status-cell error">
                {error}
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="3" className="status-cell empty">
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                onClick={() =>
                  !isViewMode &&
                  toggleSelection(item, selectedItems, setSelectedItems)
                }
                className={selectedItems.includes(item) ? "selected" : ""}
                style={{ cursor: isViewMode ? "default" : "pointer" }}
              >
                <td>{item.headqt || "-"}</td>
                <td>{item.team}</td>
                <td>{item.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
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
            selectedLeft.length === 0 || isViewMode ? "disabled" : ""
          }`}
          onClick={moveToRight}
          style={{ cursor: isViewMode ? "not-allowed" : "pointer" }}
        />
        {/* 왼쪽으로 이동 버튼 */}
        <img
          src={`${process.env.PUBLIC_URL}/image/icons/left.png`}
          alt="왼쪽 이동"
          className={`moveButton ${
            selectedRight.length === 0 || isViewMode ? "disabled" : ""
          }`}
          onClick={moveToLeft}
          style={{ cursor: isViewMode ? "not-allowed" : "pointer" }}
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

const IdeaDevReview = ({ onClose, ideaId, isViewMode }) => {
  // 상태 변수 정의
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [startDate, setStartDate] = useState(dayjs()); // 오늘 날짜로 초기화
  const [endDate, setEndDate] = useState(dayjs().add(30, "day")); // 오늘로부터 30일 후로 초기화
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [devReviewData, setDevReviewData] = useState(null);
  const [initialSelectedDevelopers, setInitialSelectedDevelopers] = useState(
    []
  );

  // 개발심의 데이터 가져오기
  useEffect(() => {
    const fetchDevReviewData = async () => {
      if (!ideaId) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/ideas/devreview/${ideaId}`);
        console.log("개발심의 데이터 조회 결과:", response.data);

        // 데이터가 있으면 상태 업데이트
        if (response.data) {
          setDevReviewData(response.data);

          // 폼에 데이터 설정
          if (response.data.developers && response.data.developers.length > 0) {
            setInitialSelectedDevelopers(response.data.developers);
            setSelectedDevelopers(response.data.developers); // 현재 선택된 개발자로도 설정
          }

          if (response.data.schedule) {
            if (response.data.schedule.startDate) {
              setStartDate(dayjs(response.data.schedule.startDate));
            }

            if (response.data.schedule.endDate) {
              setEndDate(dayjs(response.data.schedule.endDate));
            }

            if (response.data.schedule.priority) {
              setPriority(response.data.schedule.priority);
            }
          }
        }
      } catch (error) {
        console.error("개발심의 데이터 조회 오류:", error);
        if (error.response && error.response.status === 404) {
          // 404 오류는 데이터가 없는 정상적인 상황일 수 있음
          console.log(
            "개발심의 데이터가 없습니다. 새로운 데이터를 등록합니다."
          );
        } else {
          setError("개발심의 데이터를 불러올 수 없습니다.");
        }
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    };

    fetchDevReviewData();
  }, [ideaId]);

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
      setError("개발자를 한 명 이상 선택해주세요.");
      return;
    }

    if (!priority) {
      setError("우선순위를 선택해주세요.");
      return;
    }

    // 시작일과 종료일이 유효한지 확인
    if (!startDate || !endDate) {
      setError("시작일자와 종료일자를 모두 선택해주세요.");
      return;
    }

    // 종료일이 시작일보다 이전인지 확인
    if (endDate.isBefore(startDate)) {
      setError("종료일은 시작일 이후여야 합니다.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 개발자 정보 전체를 전송 (id, n_id, name, team, headqt)
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

      // 성공 메시지 표시 후 모달 닫기
      alert("개발 심의 정보가 성공적으로 등록되었습니다.");
      onClose();
    } catch (error) {
      console.error("개발 심의 등록 오류:", error);

      // 서버에서 반환된 오류 메시지 표시
      if (error.response) {
        const errorMsg =
          error.response.data.error || "알 수 없는 오류가 발생했습니다.";
        setError(errorMsg);
      } else if (error.request) {
        // 요청은 전송되었지만 응답을 받지 못한 경우
        setError("서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.");
      } else {
        // 요청 설정 중 오류 발생
        setError("요청 중 오류가 발생했습니다: " + error.message);
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
        {error && (
          <div
            className="error-message"
            style={{
              color: "#d32f2f",
              backgroundColor: "#ffebee",
              padding: "8px 16px",
              borderRadius: "4px",
              margin: "10px 0",
              fontSize: "14px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ marginRight: "8px" }}>⚠️</span> {error}
          </div>
        )}

        {loading ? (
          <div className="loadingMessage">데이터를 불러오는 중입니다...</div>
        ) : (
          <>
            {/* 인력편성 */}
            <div className="manRowContainer">
              <div className="fieldLabel">인력 편성</div>
              <TransferList
                onSelectedDevelopersChange={setSelectedDevelopers}
                initialSelectedDevelopers={initialSelectedDevelopers}
                isViewMode={isViewMode}
              />
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
                  disabled={isViewMode}
                >
                  <FormControlLabel
                    value="high"
                    control={<Radio color="primary" disabled={isViewMode} />}
                    label="1순위"
                    disabled={isViewMode}
                  />
                  <FormControlLabel
                    value="medium"
                    control={<Radio color="primary" disabled={isViewMode} />}
                    label="2순위"
                    disabled={isViewMode}
                  />
                  <FormControlLabel
                    value="low"
                    control={<Radio color="primary" disabled={isViewMode} />}
                    label="3순위"
                    disabled={isViewMode}
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {/* 등록 버튼 */}
            <div className="buttonContainer">
              {isViewMode || devReviewData ? (
                <button className="cancelButton" onClick={onClose}>
                  닫기
                </button>
              ) : (
                <button
                  className="registerButton"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "등록 중..." : "등록"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaDevReview;
