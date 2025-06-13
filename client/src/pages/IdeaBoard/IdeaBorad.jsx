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
import SolMgmt from "../SolMgmt/SolMgmt";
import TrendPage from "./TrendPage/TrendPage";
import TrendDetail from "./TrendPage/TrendDetail";

const IdeaBorad = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.includes("/detail/");
  const isKanbanPage = location.pathname.includes("/kanban/");
  const isDashBoardPage = location.pathname.includes("/dashboard");
  const isDevTablePage = location.pathname.includes("/devtable");
  const isSolMgmtPage = location.pathname.includes("/solmgmt");
  const isTrendPage = location.pathname === "/ideaboard/trend";
  const isTrendDetailPage = location.pathname.match(
    /^\/ideaboard\/trend\/\d+$/
  );

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
    } else if (isKanbanPage) {
      return <Kanban />;
    } else if (isDashBoardPage) {
      return <DashBoard />;
    } else if (isDevTablePage) {
      return <DevTable />;
    } else if (isSolMgmtPage) {
      return <SolMgmt />;
    } else if (isTrendDetailPage) {
      return <TrendDetail />;
    } else if (isTrendPage) {
      return <TrendPage />;
    } else {
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
