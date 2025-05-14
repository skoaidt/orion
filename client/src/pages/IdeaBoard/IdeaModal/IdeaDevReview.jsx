import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../../context/authContext"; // AuthContext 추가

const TransferList = ({
  onSelectedDevelopersChange,
  initialSelectedDevelopers = [],
  disabled = false,
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

        // 개발자 목록을 이름순(ㄱㄴㄷ순)으로 정렬
        developers.sort((a, b) => a.name.localeCompare(b.name, "ko"));

        // 초기 선택된 개발자가 있으면 오른쪽 리스트에 배치
        if (initialSelectedDevelopers && initialSelectedDevelopers.length > 0) {
          // 초기 선택된 개발자들의 ID 목록 (no 또는 n_id)
          const selectedIds = initialSelectedDevelopers.map(
            (dev) => dev.no || dev.n_id
          );

          // 오른쪽 리스트에 배치할 개발자들
          const initialRightItems = [];

          // 선택된 ID에 해당하는 개발자들을 찾아서 오른쪽 리스트에 추가
          // 매칭되는 개발자만 오른쪽 리스트에 추가 (매칭되지 않는 개발자는 무시)
          selectedIds.forEach((id) => {
            // 개발자 목록에서 해당 ID를 가진 개발자 찾기
            const matchingDev = developers.find((dev) => dev.no === id);

            // 찾은 개발자가 있고, 아직 오른쪽 리스트에 없는 경우에만 추가
            if (
              matchingDev &&
              !initialRightItems.some((item) => item.no === id)
            ) {
              initialRightItems.push(matchingDev);
            }
            // 매칭되는 개발자가 없는 경우는 무시 (왼쪽 리스트에 남게 됨)
          });

          // 왼쪽 리스트에 배치할 개발자들 (선택되지 않은 개발자들)
          const initialLeftItems = developers.filter(
            (dev) => !initialRightItems.some((item) => item.no === dev.no)
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
        // console.error("개발자 목록 가져오기 오류:", error);
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
    if (disabled) return; // 읽기모드에서는 작동하지 않음

    // 오른쪽으로 이동할 아이템들
    const itemsToMove = selectedLeft;

    // 오른쪽 리스트에 추가될 새 아이템들 (기존 + 새로 이동하는 아이템들)
    // 중복 제거: 이미 rightItems에 있는 아이템은 추가하지 않음
    const newRightItems = [...rightItems];

    itemsToMove.forEach((item) => {
      // 이미 오른쪽 리스트에 no가 같은 아이템이 있는지 확인
      const isDuplicate = newRightItems.some(
        (rightItem) => rightItem.no === item.no
      );

      // 중복이 아닌 경우에만 오른쪽 리스트에 추가
      if (!isDuplicate) {
        newRightItems.push(item);
      }
    });

    // 업데이트된 오른쪽 리스트와 필터링된 왼쪽 리스트 설정
    setRightItems(newRightItems);
    setLeftItems(leftItems.filter((item) => !selectedLeft.includes(item)));
    setSelectedLeft([]);
  };

  const moveToLeft = () => {
    if (disabled) return; // 읽기모드에서는 작동하지 않음

    // 왼쪽으로 이동할 아이템들
    const itemsToMove = selectedRight;

    // 왼쪽 리스트에 추가될 새 아이템들 (기존 + 새로 이동하는 아이템들)
    // 중복 제거: 이미 leftItems에 있는 아이템은 추가하지 않음
    const newLeftItems = [...leftItems];

    itemsToMove.forEach((item) => {
      // 이미 왼쪽 리스트에 no가 같은 아이템이 있는지 확인
      const isDuplicate = newLeftItems.some(
        (leftItem) => leftItem.no === item.no
      );

      // 중복이 아닌 경우에만 왼쪽 리스트에 추가
      if (!isDuplicate) {
        newLeftItems.push(item);
      }
    });

    // 이름순(ㄱㄴㄷ순)으로 정렬
    const sortedLeftItems = newLeftItems.sort((a, b) => {
      return a.name.localeCompare(b.name, "ko");
    });

    // 업데이트된 왼쪽 리스트와 필터링된 오른쪽 리스트 설정
    setLeftItems(sortedLeftItems);
    setRightItems(rightItems.filter((item) => !selectedRight.includes(item)));
    setSelectedRight([]);
  };

  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (disabled) return; // 읽기모드에서는 작동하지 않음

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
                  toggleSelection(item, selectedItems, setSelectedItems)
                }
                className={selectedItems.includes(item) ? "selected" : ""}
                style={{ cursor: disabled ? "default" : "pointer" }}
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
            selectedLeft.length === 0 || disabled ? "disabled" : ""
          }`}
          onClick={moveToRight}
          style={{ cursor: disabled ? "default" : "pointer" }}
        />
        {/* 왼쪽으로 이동 버튼 */}
        <img
          src={`${process.env.PUBLIC_URL}/image/icons/left.png`}
          alt="왼쪽 이동"
          className={`moveButton ${
            selectedRight.length === 0 || disabled ? "disabled" : ""
          }`}
          onClick={moveToLeft}
          style={{ cursor: disabled ? "default" : "pointer" }}
        />
      </div>

      {/* 오른쪽 리스트 */}
      <div className="transferList">
        {renderTable(rightItems, selectedRight, setSelectedRight, "right")}
      </div>
    </div>
  );
};

const DatePickerComponent = ({ label, value, onChange, readOnly = false }) => {
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
          readOnly={readOnly}
          disabled={readOnly}
        />
      </LocalizationProvider>
    </div>
  );
};

const IdeaDevReview = ({ onClose, ideaId, isViewMode = false, onRegister }) => {
  // 인증 컨텍스트에서 현재 사용자 정보 가져오기
  const { currentUser } = useContext(AuthContext);

  // 상태 변수 정의
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [startDate, setStartDate] = useState(dayjs()); // 오늘 날짜로 초기화
  const [endDate, setEndDate] = useState(dayjs().add(30, "day")); // 오늘로부터 30일 후로 초기화
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devReviewData, setDevReviewData] = useState(null);
  const [initialSelectedDevelopers, setInitialSelectedDevelopers] = useState(
    []
  );
  const [viewMode, setViewMode] = useState(isViewMode); // 읽기모드 상태 초기화
  const [author, setAuthor] = useState(""); // 작성자 정보 저장

  // 개발심의 데이터 가져오기
  useEffect(() => {
    const fetchDevReviewData = async () => {
      if (!ideaId) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/ideas/devreview/${ideaId}`);

        // 데이터가 있으면 상태 업데이트
        if (response.data) {
          setDevReviewData(response.data);

          // 데이터가 있으면 읽기 모드로 설정
          setViewMode(true);

          // 작성자 정보 저장
          if (response.data.author_id) {
            setAuthor(response.data.author_id);
          }

          // 폼에 데이터 설정
          if (response.data.developers && response.data.developers.length > 0) {
            // 중복 제거: 개발자 ID(n_id)를 기준으로 고유한 개발자만 추출
            const uniqueDevelopers = [];
            const addedIds = new Set();

            response.data.developers.forEach((dev) => {
              // n_id가 있는지 확인하고 no로 사용
              const devId = dev.no || dev.n_id;
              if (devId && !addedIds.has(devId)) {
                addedIds.add(devId);
                // 항상 no 필드를 사용하도록 통일
                uniqueDevelopers.push({
                  ...dev,
                  no: devId, // n_id를 no로 통일
                });
              }
            });

            setInitialSelectedDevelopers(uniqueDevelopers);
            // 선택된 개발자 상태도 함께 설정 (읽기 모드 전환 시 상태 유지를 위함)
            setSelectedDevelopers(uniqueDevelopers);
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
        } else {
          // 데이터가 없으면 isViewMode 값에 따라 초기 설정
          setViewMode(isViewMode);
        }
      } catch (error) {
        // console.error("개발심의 데이터 조회 오류:", error);
        if (error.response && error.response.status === 404) {
          // 404 오류는 데이터가 없는 정상적인 상황일 수 있음
          // 데이터가 없으면 isViewMode 값에 따라 초기 설정
          setViewMode(isViewMode);
        } else {
          setError("개발심의 데이터를 불러올 수 없습니다.");
          // 에러가 발생했지만 데이터가 없는 경우 isViewMode 값에 따라 초기 설정
          setViewMode(isViewMode);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDevReviewData();
  }, [ideaId, isViewMode]);

  // 읽기모드 변경 시 상태 설정 (props가 변경될 때만 적용)
  useEffect(() => {
    // 데이터가 있는 경우 viewMode를 true로 유지
    if (!devReviewData) {
      setViewMode(isViewMode);
    }
  }, [isViewMode, devReviewData]);

  // 편집 권한을 확인하는 함수 (작성자 또는 Admin인 경우에만 수정 가능)
  const hasEditPermission = () => {
    // 현재 사용자가 없는 경우 권한 없음
    if (!currentUser) return false;

    // Admin이거나 작성자인 경우 권한 있음
    return currentUser.isAdmin || currentUser.userId === author;
  };

  // 우선순위 변경 핸들러
  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  // 날짜 변경 핸들러
  const handleStartDateChange = (newValue) => {
    if (viewMode) return; // 읽기 모드에서는 변경 불가

    if (newValue) {
      setStartDate(newValue);

      // 만약 시작일이 종료일보다 이후라면 종료일을 시작일 이후로 설정
      if (newValue.isAfter(endDate)) {
        setEndDate(newValue.add(7, "day"));
      }
    }
  };

  const handleEndDateChange = (newValue) => {
    if (viewMode) return; // 읽기 모드에서는 변경 불가

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
      const reviewData = {
        ideaID: ideaId || 1,
        developers: selectedDevelopers,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        priority: priority,
        isUpdate: devReviewData ? true : false, // 업데이트 여부 표시
        deleteBeforeInsert: true, // 백엔드에서 처리하도록 플래그 전달
      };

      // console.log("개발 심의 등록 데이터:", reviewData);

      // 단일 POST 요청으로 처리 (백엔드에서 deleteBeforeInsert 플래그를 확인하여 처리)
      const response = await axios.post("/api/ideas/devreview", reviewData);

      if (devReviewData) {
        alert("개발 심의 정보가 성공적으로 업데이트되었습니다.");
      } else {
        alert("개발 심의 정보가 성공적으로 등록되었습니다.");
      }

      // 등록 성공 시 devReviewData와 initialSelectedDevelopers 업데이트
      setDevReviewData(response.data);

      // 최신 상태로 initialSelectedDevelopers 업데이트
      setInitialSelectedDevelopers(selectedDevelopers);

      // 등록 후 읽기 모드로 변경
      setViewMode(true);

      // 상위 컴포넌트에 등록 완료 알림 (있는 경우)
      if (onRegister) {
        onRegister(response.data);
      }
    } catch (error) {
      // console.error("개발 심의 등록 오류:", error);

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

  // 편집 모드로 전환
  const handleEdit = () => {
    // 수정 권한이 있는지 확인
    if (hasEditPermission()) {
      setViewMode(false);
    } else {
      alert("수정 권한이 없습니다. 작성자 또는 관리자만 수정할 수 있습니다.");
    }
  };

  return (
    <div className="reviewModalOverlay">
      <div className="reviewModalContent">
        {/* 제목 */}
        <div className="titleBox">
          <h2>{viewMode ? "개발 심의" : "개발 심의"}</h2>
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
                disabled={viewMode} // 읽기 모드일 때 비활성화
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
                    readOnly={viewMode} // 읽기 모드 시 읽기 전용
                  />
                </div>

                {/* 종료일자 */}
                <div className="dateRight">
                  <DatePickerComponent
                    label="종료일자"
                    value={endDate}
                    onChange={handleEndDateChange}
                    readOnly={viewMode} // 읽기 모드 시 읽기 전용
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
                  disabled={viewMode} // 읽기 모드일 때 비활성화
                >
                  <FormControlLabel
                    value="1순위"
                    control={<Radio disabled={viewMode} />}
                    label="1순위"
                  />
                  <FormControlLabel
                    value="2순위"
                    control={<Radio disabled={viewMode} />}
                    label="2순위"
                  />
                  <FormControlLabel
                    value="3순위"
                    control={<Radio disabled={viewMode} />}
                    label="3순위"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {/* 버튼 영역 */}
            <div className="buttonContainer">
              {viewMode ? (
                // 읽기 모드: 왼쪽 버튼 = 수정, 오른쪽 버튼 = 닫기
                <>
                  <button
                    className="cancelButton"
                    onClick={handleEdit}
                    disabled={loading}
                  >
                    수정
                  </button>
                  <button
                    className="registerButton"
                    onClick={onClose}
                    disabled={loading}
                  >
                    닫기
                  </button>
                </>
              ) : (
                // 편집 모드: 왼쪽 버튼 = 취소, 오른쪽 버튼 = 등록
                <>
                  <button
                    className="cancelButton"
                    onClick={onClose}
                    disabled={loading}
                  >
                    취소
                  </button>
                  <button
                    className="registerButton"
                    onClick={handleRegister}
                    disabled={loading}
                    style={{
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.7 : 1,
                      position: "relative",
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={{ visibility: "hidden" }}>등록</span>
                        <span
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          처리 중...
                        </span>
                      </>
                    ) : (
                      "등록"
                    )}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaDevReview;
