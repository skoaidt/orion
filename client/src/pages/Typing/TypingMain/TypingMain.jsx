import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TypingMain.scss";
import Navbar from "../Navbar/Navbar";

const TypingMain = () => {
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

  const navigate = useNavigate();
  const handleCategorySelect = (category) => {
    navigate(`/typingHome?category=${category}`);
  };

  return (
    <div className="typingMain">
      <Navbar />
      <div className="typingMainContent">
        <h1>Category Select</h1>
        <div className="categoryButtons">
          <button
            onClick={() => handleCategorySelect("01")}
            style={{ width: "150px" }}
          >
            일반 문장
          </button>
          <button
            onClick={() => handleCategorySelect("02")}
            style={{ width: "150px" }}
          >
            기술 문장
          </button>
          <button
            onClick={() => handleCategorySelect("03")}
            style={{ width: "150px" }}
          >
            TEST
          </button>
          {/* 추가적인 카테고리가 필요하면 여기에 버튼을 추가하세요 */}
        </div>
      </div>
    </div>
  );
};

export default TypingMain;
