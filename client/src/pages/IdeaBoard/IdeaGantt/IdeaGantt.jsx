import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ideaGantt.scss";

const IdeaGantt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ideaData, setIdeaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ganttData, setGanttData] = useState([]);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    text: "",
    description: "",
    start_date: "",
    duration: 1,
    progress: 0,
    color: "#3282f6",
  });

  // 드래그 관련 상태 변수 추가
  const [dragState, setDragState] = useState({
    isDragging: false,
    currentTask: null,
    startX: 0,
    originalLeft: 0,
    originalDuration: 0,
  });

  // 작업 크기 조절 관련 상태 변수 추가
  const [resizeState, setResizeState] = useState({
    isResizing: false,
    currentTask: null,
    startX: 0,
    originalWidth: 0,
    originalDuration: 0,
  });

  // useEffect(() => {
  //   // API가 준비된 후 주석을 해제하여 실제 데이터를 가져오는 로직

  //   // 아이디어 데이터를 가져오는 함수
  //   const fetchIdeaData = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       // 아이디어 상세 정보를 가져오는 API 호출
  //       const response = await axios.get(`/api/ideas/${id}`);
  //       setIdeaData(response.data);

  //       // 간트 차트 데이터 설정
  //       generateGanttData(response.data);
  //     } catch (error) {
  //       console.error("간트 차트 데이터 로딩 중 오류 발생:", error);
  //       // API 호출 실패 시 기본 데이터 사용
  //       generateGanttData(null);
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id) {
  //     fetchIdeaData();
  //   }

  //   // 개발 중 가상 데이터로 테스트하기 위한 함수 호출
  //   generateMockData();
  // }, [id]);

  // 가상 데이터를 생성하는 함수
  const generateMockData = useCallback(() => {
    try {
      setLoading(true);
      setError(null); // 오류 상태 초기화

      // 현재 날짜를 기준으로 가상 데이터 생성
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate()); // 오늘 날짜부터 시작

      // 가상의 프로젝트 데이터
      const mockIdeaData = {
        id: id,
        title: "대형 사업자 관리 시스템",
        author: "전다현",
        team: "종로품질개선팀",
        category: "신규개발",
        startDate: startDate.toISOString().split("T")[0],
        status: "개발중",
      };

      // 가상의 간트 차트 데이터
      const tasks = [
        {
          id: 1,
          text: "요구사항 분석",
          start_date: startDate.toISOString().split("T")[0],
          duration: 3,
          progress: 1,
          color: "#32c832",
          dependencies: [], // 종속성 추가
        },
        {
          id: 2,
          text: "설계",
          start_date: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          duration: 4,
          progress: 0.8,
          color: "#328bc8",
          dependencies: [1], // 종속성 추가
        },
        {
          id: 3,
          text: "개발",
          start_date: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          duration: 10,
          progress: 0.2,
          color: "#c87032",
          dependencies: [2], // 종속성 추가
        },
        {
          id: 4,
          text: "테스트",
          start_date: new Date(startDate.getTime() + 17 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          duration: 5,
          progress: 0,
          color: "#c83232",
          dependencies: [3], // 종속성 추가
        },
      ];

      setGanttData(tasks);
      setIdeaData(mockIdeaData);
      setLoading(false);
    } catch (error) {
      console.error("간트 차트 데이터 생성 중 오류:", error);
      setError(error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // 개발 중 가상 데이터로 테스트하기 위한 함수 호출
    generateMockData();
  }, [generateMockData]);

  const handleBackClick = () => {
    navigate(`/ideaboard/detail/${id}`);
  };

  // 간트 차트 렌더링 컴포넌트
  const renderGanttChart = () => {
    if (loading) {
      return <div className="loading">데이터 로딩 중...</div>;
    }

    if (error) {
      return (
        <div className="ganttError">
          <p>간트 차트를 불러오는 중 오류가 발생했습니다.</p>
          <p>오류 내용: {error.message}</p>
        </div>
      );
    }

    if (ganttData.length === 0) {
      return (
        <div className="noData">
          <p>간트 차트에 표시할 데이터가 없습니다.</p>
          <button className="add-task-btn" onClick={handleNewTaskClick}>
            + 새 작업 추가
          </button>
        </div>
      );
    }

    try {
      // 날짜 표시 기간 계산 (오늘 날짜부터 30일간)
      const dateRange = 30;
      const monthSet = new Set();
      const dateArray = [];

      for (let i = 0; i < dateRange; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i); // 오늘부터 시작
        dateArray.push(date);
        monthSet.add(date.getMonth());
      }

      // 월별 날짜 그룹화
      const months = Array.from(monthSet).map((month) => {
        const datesInMonth = dateArray.filter(
          (date) => date.getMonth() === month
        );
        return {
          month,
          days: datesInMonth.length,
          startDate: datesInMonth[0],
        };
      });

      // 간트 차트 대신 사용할 간단한 UI
      return (
        <div className="simpleGantt">
          <div className="gantt-toolbar">
            <button className="add-task-btn" onClick={handleNewTaskClick}>
              + 새 작업 추가
            </button>
          </div>
          <div className="timeline-header">
            <div className="task-label">작업</div>
            <div className="timeline">
              <div className="month-row">
                {months.map((monthData, idx) => (
                  <div
                    key={`month-${idx}`}
                    className="month show-month"
                    style={{
                      width: `${monthData.days * 40}px`,
                    }}
                  >
                    {`${monthData.month + 1}월`}
                  </div>
                ))}
              </div>
              <div className="day-row">
                {dateArray.map((date, i) => (
                  <div
                    key={`day-${i}`}
                    className={`day ${
                      date.getDay() === 0 || date.getDay() === 6
                        ? "weekend"
                        : ""
                    }`}
                  >
                    {date.getDate()}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="timeline-body">
            {ganttData.map((task) => {
              const startDate = new Date(task.start_date);
              const today = new Date();
              const diffDays = Math.floor(
                (startDate - today) / (1000 * 60 * 60 * 24)
              );
              // 종속성 라인 표시를 위한 데이터
              const dependencies = task.dependencies || [];

              return (
                <div key={task.id} className="task-row">
                  <div className="task-label">{task.text}</div>
                  <div className="timeline">
                    {dependencies.map((depId) => {
                      // 종속성 있는 작업 찾기
                      const parentTask = ganttData.find((t) => t.id === depId);
                      if (!parentTask) return null;

                      // 부모 작업의 끝점과 현재 작업의 시작점 계산
                      const parentEndDate = new Date(parentTask.start_date);
                      parentEndDate.setDate(
                        parentEndDate.getDate() + parentTask.duration
                      );
                      const parentEndDiffDays = Math.floor(
                        (parentEndDate - today) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <div
                          key={`dep-${task.id}-${depId}`}
                          className="dependency-line"
                          style={{
                            left: `${(parentEndDiffDays + dateRange) * 40}px`,
                            width: `${
                              (diffDays + dateRange - parentEndDiffDays) * 40
                            }px`,
                          }}
                        />
                      );
                    })}
                    <div
                      className="task-bar"
                      style={{
                        marginLeft: `${(diffDays + dateRange) * 40}px`,
                        width: `${task.duration * 40}px`,
                        backgroundColor: task.color,
                      }}
                      onClick={() => handleTaskClick(task)}
                      onMouseDown={(e) => handleDragStart(e, task)}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: `${task.progress * 100}%`,
                          backgroundColor: `rgba(255, 255, 255, 0.3)`,
                        }}
                      />
                      <span className="task-text">{task.text}</span>
                      <div
                        className="task-resizer"
                        onMouseDown={(e) => handleResizerMouseDown(e, task)}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } catch (renderError) {
      console.error("간트 차트 렌더링 중 오류:", renderError);
      return (
        <div className="ganttError">
          <p>간트 차트 렌더링 중 오류가 발생했습니다.</p>
          <p>오류 내용: {renderError.message}</p>
        </div>
      );
    }
  };

  // 사이드바 렌더링 컴포넌트
  const renderSidebar = () => {
    if (!showSidebar) return null;

    const isNewTask = !selectedTask;
    const task = isNewTask ? newTask : selectedTask;

    const handleChange = (e) => {
      const { name, value } = e.target;

      if (isNewTask) {
        setNewTask({
          ...newTask,
          [name]: value,
        });
      } else {
        setSelectedTask({
          ...selectedTask,
          [name]: value,
        });
      }
    };

    return (
      <div className="task-sidebar">
        <div className="sidebar-header">
          <h3>{isNewTask ? "새 작업 추가" : "작업 상세정보"}</h3>
          <button
            className="close-btn"
            onClick={() => {
              setShowSidebar(false);
              setSelectedTask(null);
            }}
          >
            ×
          </button>
        </div>

        <div className="sidebar-content">
          <div className="form-group">
            <label htmlFor="text">작업명</label>
            <input
              type="text"
              id="text"
              name="text"
              value={task.text}
              onChange={handleChange}
              placeholder="작업명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">설명</label>
            <textarea
              id="description"
              name="description"
              value={task.description || ""}
              onChange={handleChange}
              placeholder="작업 설명을 입력하세요"
              rows={4}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="start_date">시작일</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={task.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">기간 (일)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              max="100"
              value={task.duration}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="progress">진행률</label>
            <div className="progress-input-container">
              <input
                type="range"
                id="progress"
                name="progress"
                min="0"
                max="1"
                step="0.01"
                value={task.progress}
                onChange={handleChange}
              />
              <span className="progress-value">
                {Math.round(task.progress * 100)}%
              </span>
            </div>
            <div
              className="progress-preview"
              style={{
                backgroundColor: getTaskColor(parseFloat(task.progress)),
              }}
            ></div>
          </div>

          <div className="form-actions">
            {isNewTask ? (
              <button className="save-btn" onClick={handleAddTask}>
                작업 추가
              </button>
            ) : (
              <>
                <button className="save-btn" onClick={handleUpdateTask}>
                  저장
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteTask(selectedTask.id)}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 안전하게 전체 컴포넌트 렌더링
  const renderSafeContent = () => {
    try {
      return (
        <>
          <div className="ganttInfo">
            {ideaData && (
              <div className="infoGrid">
                <div className="infoItem">
                  <span className="label">프로젝트 이름:</span>
                  <span className="value">
                    {ideaData.title || "대형 사업자 관리 시스템"}
                  </span>
                </div>
                <div className="infoItem">
                  <span className="label">담당자:</span>
                  <span className="value">{ideaData.author || "전다현"}</span>
                </div>
                <div className="infoItem">
                  <span className="label">팀:</span>
                  <span className="value">
                    {ideaData.team || "종로품질개선팀"}
                  </span>
                </div>
                <div className="infoItem">
                  <span className="label">카테고리:</span>
                  <span className="value">
                    {ideaData.category || "신규개발"}
                  </span>
                </div>
                <div className="infoItem">
                  <span className="label">상태:</span>
                  <span className="value">
                    {ideaData.status || "개발 진행중"}
                  </span>
                </div>
                <div className="infoItem">
                  <span className="label">시작일:</span>
                  <span className="value">
                    {ideaData.startDate
                      ? new Date(ideaData.startDate).toLocaleDateString("ko-KR")
                      : ""}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="gantt-container-wrapper">
            <div className="ganttContainer">{renderGanttChart()}</div>
            {renderSidebar()}
          </div>
        </>
      );
    } catch (mainError) {
      console.error("전체 컴포넌트 렌더링 중 오류:", mainError);
      return (
        <div className="ganttError">
          <p>간트 차트 화면 렌더링 중 치명적인 오류가 발생했습니다.</p>
          <p>오류 내용: {mainError.message}</p>
          <button
            className="backButton"
            onClick={handleBackClick}
            style={{ marginTop: "20px" }}
          >
            돌아가기
          </button>
        </div>
      );
    }
  };

  // 특정 월의 총 일수를 반환하는 함수
  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    // 다음 달의 0일 = 현재 달의 마지막 날
    return new Date(year, month + 1, 0).getDate();
  };

  // Task 추가 함수
  const handleAddTask = () => {
    if (!newTask.text || !newTask.start_date) {
      alert("작업명과 시작일은 필수 입력값입니다.");
      return;
    }

    const taskId =
      ganttData.length > 0
        ? Math.max(...ganttData.map((task) => task.id)) + 1
        : 1;

    // 새로운 작업 생성
    const task = {
      id: taskId,
      text: newTask.text,
      description: newTask.description,
      start_date: newTask.start_date,
      duration: parseInt(newTask.duration),
      progress: parseFloat(newTask.progress),
      color: getTaskColor(parseFloat(newTask.progress)),
    };

    // 작업 목록에 추가
    setGanttData([...ganttData, task]);

    // 작업 폼 초기화
    setNewTask({
      text: "",
      description: "",
      start_date: "",
      duration: 1,
      progress: 0,
      color: "#3282f6",
    });

    // 사이드바 닫기
    setShowSidebar(false);
  };

  // Task 삭제 함수
  const handleDeleteTask = (taskId) => {
    if (window.confirm("정말로 이 작업을 삭제하시겠습니까?")) {
      setGanttData(ganttData.filter((task) => task.id !== taskId));
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null);
        setShowSidebar(false);
      }
    }
  };

  // Task 수정 함수
  const handleUpdateTask = () => {
    if (!selectedTask) return;

    if (!selectedTask.text || !selectedTask.start_date) {
      alert("작업명과 시작일은 필수 입력값입니다.");
      return;
    }

    // 진행률에 따라 색상 업데이트
    selectedTask.color = getTaskColor(selectedTask.progress);

    // 작업 목록 업데이트
    setGanttData(
      ganttData.map((task) =>
        task.id === selectedTask.id ? { ...selectedTask } : task
      )
    );

    // 수정 완료 후 사이드바 닫기
    setShowSidebar(false);
    setSelectedTask(null);
  };

  // 진행률에 따른 색상 반환 함수
  const getTaskColor = (progress) => {
    if (progress === 0) return "#9e9e9e"; // 회색 (시작 전)
    if (progress < 0.3) return "#f44336"; // 빨간색 (초기 단계)
    if (progress < 0.7) return "#ff9800"; // 주황색 (중간 단계)
    if (progress < 1) return "#2196f3"; // 파란색 (후반 단계)
    return "#4caf50"; // 녹색 (완료)
  };

  // Task 선택 함수
  const handleTaskClick = (task) => {
    setSelectedTask({ ...task });
    setShowSidebar(true);
  };

  // 새 Task 추가 사이드바 열기
  const handleNewTaskClick = () => {
    // 오늘 날짜를 기본값으로 설정
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    setNewTask({
      ...newTask,
      start_date: formattedDate,
      dependencies: [],
    });

    setSelectedTask(null);
    setShowSidebar(true);
  };

  // 드래그 시작 핸들러
  const handleDragStart = (e, task) => {
    e.stopPropagation();
    const taskElement = e.currentTarget;
    const currentLeft = parseInt(taskElement.style.marginLeft, 10) || 0;

    setDragState({
      isDragging: true,
      currentTask: task,
      startX: e.clientX,
      originalLeft: currentLeft,
      originalDuration: task.duration,
    });

    // 드래그 중 이벤트 리스너 추가
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);

    // 드래그 중인 작업에 클래스 추가
    taskElement.classList.add("dragging");
  };

  // 드래그 이동 핸들러
  const handleDragMove = (e) => {
    if (!dragState.isDragging) return;

    const deltaX = e.clientX - dragState.startX;
    const newLeft = dragState.originalLeft + deltaX;

    // 타임라인 밖으로 나가지 않도록 제한
    const constrainedLeft = Math.max(0, newLeft);

    // 현재 드래그 중인 작업 요소 찾기
    const taskElements = document.querySelectorAll(".task-bar");
    for (const element of taskElements) {
      if (element.classList.contains("dragging")) {
        element.style.marginLeft = `${constrainedLeft}px`;

        // 새 위치에 해당하는 날짜 계산
        const dayWidth = 40; // 각 날짜 칸의 너비
        const dayOffset = Math.round(constrainedLeft / dayWidth);

        // 시작일 기준 (오늘 날짜부터)
        const baseDate = new Date();
        const newStartDate = new Date(baseDate);
        newStartDate.setDate(baseDate.getDate() + dayOffset - 30); // 30일 범위 조정

        // 툴팁으로 새 날짜 표시
        let dateTooltip = element.querySelector(".date-tooltip");
        if (!dateTooltip) {
          dateTooltip = document.createElement("div");
          dateTooltip.className = "date-tooltip";
          element.appendChild(dateTooltip);
        }
        dateTooltip.textContent = `${
          newStartDate.getMonth() + 1
        }월 ${newStartDate.getDate()}일`;
        dateTooltip.style.display = "block"; // 툴팁 표시

        break;
      }
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (e) => {
    if (!dragState.isDragging) return;

    // 이벤트 리스너 제거
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);

    // 드래그 중인 작업 요소 찾기
    const taskElements = document.querySelectorAll(".task-bar");
    let updatedTask = null;

    for (const element of taskElements) {
      if (element.classList.contains("dragging")) {
        element.classList.remove("dragging");

        // 툴팁 제거
        const tooltip = element.querySelector(".date-tooltip");
        if (tooltip) {
          element.removeChild(tooltip);
        }

        // 새 위치에 해당하는 날짜 계산
        const currentLeft = parseInt(element.style.marginLeft, 10) || 0;
        const dayWidth = 40; // 각 날짜 칸의 너비
        const dayOffset = Math.round(currentLeft / dayWidth);

        // 시작일 기준 (오늘 날짜부터)
        const baseDate = new Date();
        const newStartDate = new Date(baseDate);
        newStartDate.setDate(baseDate.getDate() + dayOffset - 30); // 30일 범위 조정

        // 작업 객체 업데이트
        updatedTask = {
          ...dragState.currentTask,
          start_date: newStartDate.toISOString().split("T")[0],
        };

        break;
      }
    }

    // 작업 목록 업데이트
    if (updatedTask) {
      setGanttData(
        ganttData.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    }

    // 드래그 상태 초기화
    setDragState({
      isDragging: false,
      currentTask: null,
      startX: 0,
      originalLeft: 0,
      originalDuration: 0,
    });
  };

  // 작업 크기 조절 시작 핸들러
  const handleResizerMouseDown = (e, task) => {
    e.stopPropagation();
    const taskElement = e.currentTarget.parentElement;
    const currentWidth = parseInt(taskElement.style.width, 10) || 0;

    setResizeState({
      isResizing: true,
      currentTask: task,
      startX: e.clientX,
      originalWidth: currentWidth,
      originalDuration: task.duration,
    });

    // 크기 조절 중 이벤트 리스너 추가
    document.addEventListener("mousemove", handleResizerMove);
    document.addEventListener("mouseup", handleResizerUp);

    // 크기 조절 중인 작업에 클래스 추가
    taskElement.classList.add("resizing");
  };

  const handleResizerMove = (e) => {
    if (!resizeState.isResizing) return;

    const deltaX = e.clientX - resizeState.startX;
    const newWidth = Math.max(40, resizeState.originalWidth + deltaX); // 최소 너비 설정

    // 새로운 기간 계산 (40px = 1일)
    const newDuration = Math.max(1, Math.round(newWidth / 40));

    // 현재 크기 조절 중인 작업 요소 찾기
    const taskElements = document.querySelectorAll(".task-bar");
    for (const element of taskElements) {
      if (element.classList.contains("resizing")) {
        element.style.width = `${newWidth}px`;

        // 끝 날짜 계산 및 툴팁 표시
        const startDate = new Date(resizeState.currentTask.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + newDuration - 1);

        // 툴팁으로 종료 날짜 표시
        let durationTooltip = element.querySelector(".duration-tooltip");
        if (!durationTooltip) {
          durationTooltip = document.createElement("div");
          durationTooltip.className = "duration-tooltip";
          element.appendChild(durationTooltip);
        }
        durationTooltip.textContent = `종료: ${
          endDate.getMonth() + 1
        }월 ${endDate.getDate()}일 (${newDuration}일)`;
        durationTooltip.style.display = "block";
        durationTooltip.style.right = "0";
        durationTooltip.style.top = "-25px";

        break;
      }
    }
  };

  const handleResizerUp = (e) => {
    if (!resizeState.isResizing) return;

    // 이벤트 리스너 제거
    document.removeEventListener("mousemove", handleResizerMove);
    document.removeEventListener("mouseup", handleResizerUp);

    // 크기 조절 중인 작업 요소 찾기
    const taskElements = document.querySelectorAll(".task-bar");
    let updatedTask = null;

    for (const element of taskElements) {
      if (element.classList.contains("resizing")) {
        element.classList.remove("resizing");

        // 툴팁 제거
        const tooltip = element.querySelector(".duration-tooltip");
        if (tooltip) {
          element.removeChild(tooltip);
        }

        // 새 너비에 해당하는 기간 계산
        const currentWidth = parseInt(element.style.width, 10) || 0;
        const newDuration = Math.max(1, Math.round(currentWidth / 40));

        // 작업 객체 업데이트
        updatedTask = {
          ...resizeState.currentTask,
          duration: newDuration,
        };

        break;
      }
    }

    // 작업 목록 업데이트
    if (updatedTask) {
      setGanttData(
        ganttData.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    }

    // 크기 조절 상태 초기화
    setResizeState({
      isResizing: false,
      currentTask: null,
      startX: 0,
      originalWidth: 0,
      originalDuration: 0,
    });
  };

  return (
    <div className="ideaGantt">
      <div className="ganttHeader">
        <h2>프로젝트 개발 일정 (아이디어 ID: {id})</h2>
        <button className="backButton" onClick={handleBackClick}>
          돌아가기
        </button>
      </div>
      {renderSafeContent()}
    </div>
  );
};

export default IdeaGantt;
