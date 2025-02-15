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
  // const [selectedCategory, setSelectedCategory] = useState([]);
  // const category = useLocation().search;
  // console.log("TypingMain에서 나오는 category:", category);

  // const fetchCategories = async (category) => {
  //   try {
  //     const response = await axios.get(`/api/typings/typingdata/${category}`);
  //     setSelectedCategory(response.data);
  //     console.log("Fetched categories:", response.data);
  //   } catch (error) {
  //     console.error("카테고리 가져올때 오류가 발생하였습니다.", error);
  //   }
  // };
  // const handleCategorySelect = (category) => {
  //   setSelectedCategory([]); // 선택된 카테고리 초기화
  //   fetchCategories(category); // 카테고리 선택 시 데이터 가져오기
  //   navigate(`/typingHome?category=${category}`);
  // };

  // useEffect(() => {
  //   console.log("category 값이 변경되었습니다:", category);
  // }, [category]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.get(`/api/typings/typingdata/${category}`);
  //       setSelectedCategory(response.data);
  //       console.log("Fetched categories:", response.data);
  //     } catch (error) {
  //       console.error("카테고리 가져올때 오류가 발생하였습니다.", error);
  //     }
  //   };
  //   fetchCategories();
  // }, [category]);

  // console.log("selectedCategory", selectedCategory);

  return (
    <div className="typingMain">
      <Navbar />
      <div className="typingMainContent">
        <h1>Category Select</h1>
        <div className="categoryButtons">
          <button
            onClick={() => {
              handleCategorySelect("01");
              console.log("선택된 카테고리:", "01");
            }}
          >
            일반 문장
          </button>
          <button onClick={() => handleCategorySelect("02")}>기술 문장</button>
          {/* 추가적인 카테고리가 필요하면 여기에 버튼을 추가하세요 */}
        </div>
      </div>

      {/* <Routes>
        <Route
          path="/typingHome"
          element={<TypingHome typingData={selectedCategory} />}
        />
      </Routes> */}
    </div>
  );
};

export default TypingMain;
