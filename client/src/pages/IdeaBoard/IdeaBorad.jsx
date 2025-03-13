import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ideaBorad.scss";
import IdeaTable from "./IdeaTable/IdeaTable";
import IdeaDesc from "./IdeaTable/IdeaDesc";
import SideBar from "./IdeaTable/SideBar";
import IdeaNavbar from "./IdeaTable/IdeaNavbar";
const IdeaBorad = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.includes("/detail/");
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

  return (
    <div className="ideaBoard">
      <div className="wrapp">
        <SideBar />
        <div className="contents">
          <IdeaNavbar />
          {isDetailPage ? <IdeaDesc /> : <IdeaTable />}
        </div>
      </div>
    </div>
  );
};

export default IdeaBorad;
