import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import "./kanban.scss";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CodeIcon from "@mui/icons-material/Code";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Tooltip, IconButton } from "@mui/material";

import { AuthContext } from "../../../context/authContext";
import IdeaDevelop from "../IdeaModal/IdeaDevelop";
import DevStart from "../IdeaModal/DevStart";

// StrictMode와 함께 사용할 수 있는 Droppable 래퍼
const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

const Kanban = () => {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState({ content: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ideaData, setIdeaData] = useState({ title: "", project_type: "" });
  const [devReviewData, setDevReviewData] = useState({
    developers: [],
    schedule: { startDate: null, endDate: null, priority: "" },
    rawData: [],
  });
  const [showDevelopModal, setShowDevelopModal] = useState(false);
  const [showDevStartModal, setShowDevStartModal] = useState(false);
  // 초기 데이터 상태
  const [columns, setColumns] = useState({
    todo: {
      id: "todo",
      title: "To do",
      taskIds: [],
      tasks: [],
    },
    kickoff: {
      id: "kickoff",
      title: "Kick Off",
      taskIds: [],
      tasks: [],
    },
    inprogress: {
      id: "inprogress",
      title: "진행중",
      taskIds: [],
      tasks: [],
    },
    done: {
      id: "done",
      title: "완료",
      taskIds: [],
      tasks: [],
    },
  });

  // 칼럼 순서
  const columnOrder = ["todo", "kickoff", "inprogress", "done"];

  // 아이디어 데이터 가져오기
  const fetchIdeaData = async () => {
    try {
      const response = await axios.get(`/api/ideas/${id}`);
      setIdeaData(response.data);
    } catch (error) {
      console.error("아이디어 정보 가져오기 오류:", error);
    }
  };

  // 개발자 리뷰 데이터 가져오기
  const fetchDevReviewData = async () => {
    try {
      const response = await axios.get(`/api/ideas/devreview/${id}`);
      setDevReviewData(response.data);
    } catch (error) {
      console.error("개발자 정보 가져오기 오류:", error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 아이디어 정보 가져오기
        await fetchIdeaData();

        // 개발자 정보 가져오기
        await fetchDevReviewData();

        // 칸반 컬럼 초기화 (필요한 경우)
        await axios.post(`/api/kanbans/${id}/init`);

        // 작업 데이터 가져오기
        const response = await axios.get(`/api/kanbans/${id}/tasks`);

        // 작업 데이터를 컬럼별로 분류
        const newColumns = { ...columns };

        // 모든 컬럼 작업 초기화
        columnOrder.forEach((colId) => {
          newColumns[colId].tasks = [];
          newColumns[colId].taskIds = [];
        });

        // 서버에서 받은 작업을 적절한 컬럼에 배치
        response.data.forEach((task) => {
          const status = task.status || "todo";
          if (newColumns[status]) {
            const taskItem = {
              id: task.task_id,
              title: task.content,
              createdAt: task.created_at,
            };
            newColumns[status].tasks.push(taskItem);
            newColumns[status].taskIds.push(task.task_id);
          }
        });

        setColumns(newColumns);
        setLoading(false);
      } catch (err) {
        console.error("데이터 로딩 오류:", err);
        setError("칸반 보드 데이터를 로드하는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBackClick = () => {
    navigate(`/ideaboard/detail/${id}`);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // 목적지가 없는 경우 (드래그앤드롭이 취소된 경우)
    if (!destination) {
      return;
    }

    // 같은 위치에 드롭된 경우
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // 출발지 컬럼
    const sourceColumn = columns[source.droppableId];
    // 도착지 컬럼
    const destColumn = columns[destination.droppableId];

    if (sourceColumn === destColumn) {
      // 같은 컬럼 내에서 순서만 변경
      const newTaskIds = Array.from(sourceColumn.taskIds);
      const newTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);

      newTaskIds.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
        tasks: newTasks,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });

      // 서버에 작업 순서 업데이트
      try {
        await axios.put(`/api/kanbans/${id}/tasks/${draggableId}`, {
          status: newColumn.id,
          position: destination.index,
        });
      } catch (err) {
        console.error("작업 순서 업데이트 오류:", err);
        // 오류 발생 시 상태를 원래대로 복원할 수도 있음
      }
    } else {
      // 다른 컬럼으로 이동
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTaskIds = Array.from(destColumn.taskIds);
      const destTasks = Array.from(destColumn.tasks);

      // 이동할 태스크 찾기
      const taskToMove = sourceTasks[source.index];

      // 원본 배열에서 태스크 제거
      const newSourceTasks = [...sourceTasks];
      newSourceTasks.splice(source.index, 1);
      sourceTaskIds.splice(source.index, 1);

      // 목적지 배열에 태스크 추가
      const newDestTasks = [...destTasks];
      newDestTasks.splice(destination.index, 0, taskToMove);
      destTaskIds.splice(destination.index, 0, taskToMove.id);

      const newSourceColumn = {
        ...sourceColumn,
        taskIds: sourceTaskIds,
        tasks: newSourceTasks,
      };

      const newDestColumn = {
        ...destColumn,
        taskIds: destTaskIds,
        tasks: newDestTasks,
      };

      setColumns({
        ...columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      });

      // 서버에 작업 상태 및 순서 업데이트
      try {
        await axios.put(`/api/kanbans/${id}/tasks/${draggableId}`, {
          status: newDestColumn.id,
          position: destination.index,
        });
      } catch (err) {
        console.error("작업 상태 업데이트 오류:", err);
        // 오류 발생 시 상태를 원래대로 복원할 수도 있음
      }
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewTask({ content: value });
  };

  const handleAddTask = async () => {
    if (newTask.content.trim() === "") return;

    const taskId = `task-${Date.now()}`;
    const newTaskItem = {
      id: taskId,
      title: newTask.content,
      createdAt: new Date().toISOString(),
    };

    // Todo 컬럼에 새 태스크 추가 (클라이언트)
    const todoColumn = columns.todo;
    const newTodoColumn = {
      ...todoColumn,
      taskIds: [...todoColumn.taskIds, taskId],
      tasks: [...todoColumn.tasks, newTaskItem],
    };

    setColumns({
      ...columns,
      todo: newTodoColumn,
    });

    // 폼 초기화
    setNewTask({ content: "" });
    setShowForm(false);

    // 서버에 작업 추가
    try {
      await axios.post(`/api/kanbans/${id}/tasks`, {
        task_id: taskId,
        content: newTask.content,
        status: "todo",
        position: todoColumn.tasks.length,
      });
    } catch (err) {
      console.error("작업 추가 오류:", err);
      // 오류 발생 시 상태를 원래대로 복원할 수도 있음
    }
  };

  const handleDevelopComplete = () => {
    console.log("개발 완료 버튼 클릭, 현재 아이디어 ID:", id);
    setShowDevelopModal(true);
  };

  const handleDevStart = () => {
    console.log("개발 시작 버튼 클릭, 현재 아이디어 ID:", id);
    setShowDevStartModal(true);
  };

  const handleCloseModal = () => {
    setShowDevelopModal(false);
  };

  const handleCloseDevStartModal = () => {
    setShowDevStartModal(false);
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // 현재 사용자가 개발자인지 확인하는 함수
  const isCurrentUserDeveloper = () => {
    // 개발자 목록이 없거나 빈 배열인 경우
    if (
      !devReviewData ||
      !devReviewData.developers ||
      devReviewData.developers.length === 0
    ) {
      return false;
    }

    // currentUser가 없는 경우
    if (!currentUser) {
      return false;
    }

    // 개발자 목록에서 현재 사용자 확인 (n_id 또는 이름으로 비교)
    return devReviewData.developers.some(
      (dev) =>
        (dev.no && currentUser.n_id && dev.no === currentUser.n_id) ||
        (dev.name && currentUser.name && dev.name === currentUser.name)
    );
  };

  // 개발 완료 버튼 표시 여부
  const showCompleteButton = isCurrentUserDeveloper();

  return (
    <div className="kanban">
      {showDevelopModal && <IdeaDevelop onClose={handleCloseModal} id={id} />}
      {showDevStartModal && (
        <DevStart onClose={handleCloseDevStartModal} id={id} />
      )}
      <div className="kanban-header">
        <div className="header">
          <div className="left">
            <div className="title">{ideaData.title || "프로젝트 이름"}</div>
            <div className="idNo">
              <span>ID - </span>
              <span> {id}</span>
            </div>
            {ideaData.project_type && (
              <div className="projectType">[{ideaData.project_type}]</div>
            )}
            {ideaData.business_field && (
              <div className="businessField">[{ideaData.business_field}]</div>
            )}
            {ideaData.job_field && (
              <div className="jobField">[{ideaData.job_field}]</div>
            )}
            {devReviewData &&
              devReviewData.schedule &&
              devReviewData.schedule.priority && (
                <div className="devPriority">
                  [{devReviewData.schedule.priority}]
                </div>
              )}
          </div>
          <div className="right">
            {showCompleteButton && (
              <button className="developing">
                <GitHubIcon /> &nbsp;개발중
              </button>
            )}

            {showCompleteButton && (
              <button className="devStart" onClick={handleDevStart}>
                <CodeIcon /> &nbsp;Start
              </button>
            )}
            {showCompleteButton && (
              <button
                className="completedButton"
                onClick={handleDevelopComplete}
              >
                개발 완료
              </button>
            )}
            <button className="backButton" onClick={handleBackClick}>
              돌아가기
            </button>
          </div>
        </div>
        <hr
          style={{
            margin: "10px 0",
            borderColor: "#e0e0e0",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        />
        <div className="devInfo">
          <div className="left">
            <div className="developerList">
              <div className="title">개발자 정보</div>

              <div className="developerListItem">
                {devReviewData &&
                devReviewData.developers &&
                devReviewData.developers.length > 0 ? (
                  devReviewData.developers.map((dev, index) => (
                    <React.Fragment key={index}>
                      <div className="developerListItemName">{dev.name}</div>
                      <div className="developerListItemTeam">{dev.team}</div>
                    </React.Fragment>
                  ))
                ) : (
                  <div>개발자 정보가 없습니다.</div>
                )}
              </div>
            </div>
          </div>
          <div className="right">
            <div className="devSchedule">
              <div>
                <Tooltip title="개발 일정" arrow placement="top">
                  <IconButton className="icon" size="small" color="primary">
                    <EventAvailableIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className="date">
              <Tooltip title="개발 시작일" arrow placement="top">
                <div className="wrap">
                  <div className="dateTitle">START</div>
                  <div className="dateValue">
                    {devReviewData && devReviewData.schedule
                      ? formatDate(devReviewData.schedule.startDate)
                      : "-"}
                  </div>
                </div>
              </Tooltip>
            </div>
            <div className="date">
              <Tooltip title="개발 종료일" arrow placement="top">
                <div className="wrap">
                  <div className="dateTitle">END</div>
                  <div className="dateValue">
                    {devReviewData && devReviewData.schedule
                      ? formatDate(devReviewData.schedule.endDate)
                      : "-"}
                  </div>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {columnOrder.map((columnId) => {
            const column = columns[columnId];

            return (
              <div className="kanban-column" key={column.id}>
                <h2 className="column-title">{column.title}</h2>

                {column.id === "todo" && (
                  <div className="add-task-section">
                    {!showForm ? (
                      <button
                        className="add-task-button"
                        onClick={() => setShowForm(true)}
                      >
                        + 새 작업 추가
                      </button>
                    ) : (
                      <div className="task-form">
                        <textarea
                          name="content"
                          placeholder="작업 내용을 입력하세요"
                          value={newTask.content}
                          onChange={handleInputChange}
                        ></textarea>
                        <div className="form-buttons">
                          <button onClick={handleAddTask}>추가</button>
                          <button onClick={() => setShowForm(false)}>
                            취소
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <StrictModeDroppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      className="task-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="task-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="task-content">{task.title}</div>
                              <div className="task-footer">
                                <small>
                                  {new Date(
                                    task.createdAt
                                  ).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
