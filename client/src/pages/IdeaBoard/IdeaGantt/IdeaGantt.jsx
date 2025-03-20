import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ideaGantt.scss";
import { Gantt } from "wx-react-gantt";
import { Willow } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { Toolbar } from "wx-react-gantt";
import { useRef } from "react";

const IdeaGantt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiRef = useRef();

  const tasks = [
    {
      id: 1,
      open: true,
      start: new Date(2024, 11, 6),
      duration: 8,
      text: "개발 기획 및 설계",
      progress: 60,
      type: "summary",
    },
    {
      id: 2,
      parent: 1,
      start: new Date(2024, 11, 6),
      duration: 4,
      text: "개발 기획",
      progress: 80,
    },
    {
      id: 3,
      parent: 1,
      start: new Date(2024, 11, 11),
      duration: 4,
      text: "DB 설계",
      progress: 30,
    },
    {
      id: 4,
      start: new Date(2024, 11, 12),
      duration: 8,
      text: "프론트엔드 개발",
      progress: 10,
      type: "summary",
    },
    {
      id: 5,
      parent: 4,
      start: new Date(2024, 11, 10),
      duration: 1,
      text: "HTML 설계작업",
      progress: 30,
    },
    {
      id: 6,
      parent: 4,
      start: new Date(2024, 11, 15),
      duration: 8,
      text: "HTML+Coding 작업",
      progress: 0,
    },
  ];

  const columns = [
    { id: "text", header: "업무 내용", flexGrow: 3 },
    {
      id: "start",
      header: "시작일",
      flexGrow: 1,
      align: "center",
    },
    {
      id: "duration",
      header: "개발기간(일)",
      align: "center",
      flexGrow: 1,
    },
    {
      id: "action",
      header: "",
      width: 50,
      align: "center",
    },
  ];

  const links = [
    { id: 1, source: 3, target: 4, type: "e2s" },
    { id: 2, source: 1, target: 2, type: "e2s" },
    { id: 21, source: 8, target: 1, type: "s2s" },
    { id: 22, source: 1, target: 6, type: "s2s" },
  ];
  const scales = [
    { unit: "month", step: 1, format: "yyyy MM" },
    { unit: "day", step: 1, format: "d" },
  ];

  const zoomConfig = {
    maxCellWidth: 400,
    level: 3,
    levels: [
      {
        minCellWidth: 200,
        scales: [{ unit: "year", step: 1, format: "yyyy" }],
      },
      {
        minCellWidth: 150,
        scales: [
          { unit: "year", step: 1, format: "yyyy" },
          { unit: "quarter", step: 1, format: "QQQQ" },
        ],
      },
      {
        minCellWidth: 250,
        scales: [
          { unit: "quarter", step: 1, format: "QQQQ" },
          { unit: "month", step: 1, format: "MMMM yyy" },
        ],
      },
      {
        minCellWidth: 100,
        scales: [
          { unit: "month", step: 1, format: "MMMM yyy" },
          { unit: "week", step: 1, format: "'week' w" },
        ],
      },
      {
        maxCellWidth: 200,
        scales: [
          { unit: "month", step: 1, format: "MMMM yyy" },
          { unit: "day", step: 1, format: "d" },
        ],
      },
      {
        minCellWidth: 25,
        scales: [
          { unit: "day", step: 1, format: "MMM d" },
          { unit: "hour", step: 6, format: "HH:mm" },
        ],
      },
      {
        scales: [
          { unit: "day", step: 1, format: "MMM d" },
          { unit: "hour", step: 1, format: "HH:mm" },
        ],
      },
    ],
  };

  const items = [
    {
      id: "add-task",
      comp: "button",
      icon: "wxi-plus",
      text: "작업 추가",
      type: "primary",
    },
    {
      id: "edit-task",
      comp: "button",
      icon: "wxi-edit",
      text: "편집",
      type: "link",
    },
  ];

  const handleBackClick = () => {
    navigate(`/ideaboard/detail/${id}`);
  };

  return (
    <div className="ideaGantt">
      <div className="ganttHeader">
        <h2>ID-{id} : 프로젝트 개발 일정 </h2>
        <button className="backButton" onClick={handleBackClick}>
          돌아가기
        </button>
      </div>
      <div className="ganttContainer">
        <Toolbar api={apiRef.current} items={items} />
        <Willow>
          <Gantt
            apiRef={apiRef}
            tasks={tasks}
            columns={columns}
            links={links}
            scales={scales}
            zoom={zoomConfig}
          />
        </Willow>
      </div>
    </div>
  );
};

export default IdeaGantt;
