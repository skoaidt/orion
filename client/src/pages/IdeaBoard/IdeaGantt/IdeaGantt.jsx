import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ideaGantt.scss";
import { Gantt } from "wx-react-gantt";
import { Willow } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

const IdeaGantt = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
        <Willow>
          <Gantt
            tasks={tasks}
            columns={columns}
            links={links}
            scales={scales}
          />
        </Willow>
      </div>
    </div>
  );
};

export default IdeaGantt;
