import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./kanban.scss";

// StrictMode 문제 해결을 위한 함수
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

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
  const { id } = useParams();
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [showForm, setShowForm] = useState(false);

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
      title: "In Progress",
      taskIds: [],
      tasks: [],
    },
    done: {
      id: "done",
      title: "Done",
      taskIds: [],
      tasks: [],
    },
  });

  // 칼럼 순서
  const columnOrder = ["todo", "kickoff", "inprogress", "done"];

  const handleBackClick = () => {
    navigate(`/ideaboard/detail/${id}`);
  };

  const onDragEnd = (result) => {
    console.log("onDragEnd result:", result);
    const { destination, source, draggableId } = result;

    // 목적지가 없는 경우 (드래그앤드롭이 취소된 경우)
    if (!destination) {
      console.log("No destination found");
      return;
    }

    // 같은 위치에 드롭된 경우
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log("Dropped in the same position");
      return;
    }

    console.log("Source column ID:", source.droppableId);
    console.log("Destination column ID:", destination.droppableId);

    // 출발지 컬럼
    const sourceColumn = columns[source.droppableId];
    // 도착지 컬럼
    const destColumn = columns[destination.droppableId];

    console.log("Source column:", sourceColumn);
    console.log("Destination column:", destColumn);

    if (sourceColumn === destColumn) {
      // 같은 컬럼 내에서 순서만 변경
      console.log("Moving within the same column");
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

      console.log("Updated column:", newColumn);

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      // 다른 컬럼으로 이동
      console.log("Moving to a different column");
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTaskIds = Array.from(destColumn.taskIds);
      const destTasks = Array.from(destColumn.tasks);

      console.log("Source tasks before:", sourceTasks);
      console.log("Source index:", source.index);

      // 이동할 태스크 찾기
      const taskToMove = sourceTasks[source.index];
      console.log("Task to move:", taskToMove);

      // 원본 배열에서 태스크 제거
      const newSourceTasks = [...sourceTasks];
      newSourceTasks.splice(source.index, 1);
      sourceTaskIds.splice(source.index, 1);

      // 목적지 배열에 태스크 추가
      const newDestTasks = [...destTasks];
      newDestTasks.splice(destination.index, 0, taskToMove);
      destTaskIds.splice(destination.index, 0, taskToMove.id);

      console.log("Updated source tasks:", newSourceTasks);
      console.log("Updated destination tasks:", newDestTasks);

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

      console.log("New source column:", newSourceColumn);
      console.log("New destination column:", newDestColumn);

      setColumns({
        ...columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = () => {
    if (newTask.title.trim() === "") return;

    const taskId = `task-${Date.now()}`;
    const newTaskItem = {
      id: taskId,
      title: newTask.title,
      description: newTask.description,
      createdAt: new Date().toISOString(),
    };

    // Todo 컬럼에 새 태스크 추가
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
    setNewTask({ title: "", description: "" });
    setShowForm(false);
  };

  return (
    <div className="kanban">
      <div className="kanban-header">
        <h1>{id}번 : 프로젝트 칸반 보드</h1>
        <button className="back-button" onClick={handleBackClick}>
          돌아가기
        </button>
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
                        <input
                          type="text"
                          name="title"
                          placeholder="작업 제목"
                          value={newTask.title}
                          onChange={handleInputChange}
                        />
                        <textarea
                          name="description"
                          placeholder="상세 내용"
                          value={newTask.description}
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
                              <h3>{task.title}</h3>
                              <p>{task.description}</p>
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
