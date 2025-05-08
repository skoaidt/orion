import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ideaBorad.scss";
import IdeaTable from "./IdeaTable/IdeaTable";
import IdeaDesc from "./IdeaTable/IdeaDesc";
import SideBar from "./IdeaTable/SideBar";
import IdeaNavbar from "./IdeaTable/IdeaNavbar";
import DashBoard from "./DashBoard/DashBoard";
import Kanban from "./Kanban/Kanban";
import DevTable from "./DevTable/DevTable";
import DevStats from "./DevStats/DevStats";

const IdeaBorad = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.includes("/detail/");
  const isKanbanPage = location.pathname.includes("/kanban/");
  const isDashBoardPage = location.pathname.includes("/dashboard");
  const isDevTablePage = location.pathname.includes("/devtable");
  const isSystemStatsPage = location.pathname.includes("/devstats");

  // 현재 경로 디버깅
  useEffect(() => {
    console.log("현재 경로:", location.pathname);
    console.log("isSystemStatsPage 체크:", isSystemStatsPage);
  }, [location.pathname, isSystemStatsPage]);

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
    console.log("renderContent 호출됨");
    if (isDetailPage) {
      console.log("IdeaDesc 렌더링");
      return <IdeaDesc />;
    } else if (isKanbanPage) {
      console.log("Kanban 렌더링");
      return <Kanban />;
    } else if (isDashBoardPage) {
      console.log("DashBoard 렌더링");
      return <DashBoard />;
    } else if (isDevTablePage) {
      console.log("DevTable 렌더링");
      return <DevTable />;
    } else if (isSystemStatsPage) {
      console.log("DevStats 렌더링");
      return <DevStats />;
    } else {
      console.log("IdeaTable 렌더링 (기본)");
      // /ideaboard 경로일 때 IdeaTable 렌더링
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
