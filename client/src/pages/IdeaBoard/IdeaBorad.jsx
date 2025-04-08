import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ideaBorad.scss";
import IdeaTable from "./IdeaTable/IdeaTable";
import IdeaDesc from "./IdeaTable/IdeaDesc";
import SideBar from "./IdeaTable/SideBar";
import IdeaNavbar from "./IdeaTable/IdeaNavbar";
import IdeaGantt from "./IdeaGantt/IdeaGantt";
import DashBoard from "./DashBoard/DashBoard";
import Kanban from "./Kanban/Kanban";

const IdeaBorad = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.includes("/detail/");
  const isGanttPage = location.pathname.includes("/gantt/");
  const isKanbanPage = location.pathname.includes("/kanban/");
  const isDashBoardPage = location.pathname.includes("/dashboard");

  // 화면 초기화 설정
  useEffect(() => {
    const appElement = document.querySelector(".app");
    const mainElement = document.querySelector(".main");

    appElement.classList.add("typing-active");
    mainElement.classList.add("typing-active");

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => {
      appElement.classList.remove("typing-active");
      mainElement.classList.remove("typing-active");
    };
  }, []);

  // 컴포넌트 선택 로직
  const renderContent = () => {
    if (isDetailPage) {
      return <IdeaDesc />;
    } else if (isGanttPage) {
      return <IdeaGantt />;
    } else if (isKanbanPage) {
      return <Kanban />;
    } else if (isDashBoardPage) {
      return <DashBoard />;
    } else {
      return <IdeaTable />;
    }
  };

  return (
    <div className="ideaBoard">
      <div className="wrapp">
        <SideBar />
        <div className="contents">
          <IdeaNavbar />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default IdeaBorad;
