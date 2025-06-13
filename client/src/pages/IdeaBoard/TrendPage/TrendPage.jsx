import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./trendPage.scss";

const TrendPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    contents: "",
    image: null,
  });

  // Quill 에디터 모듈 설정
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "color",
    "background",
  ];

  // 임시 데이터
  const mockTrends = [
    {
      id: 1,
      title: "AI 기술 동향 및 발전 방향",
      category: "AI",
      createDate: "2024-03-15",
      writer: "관리자",
      viewlog: "150",
      contents: "AI 기술의 최신 동향과 미래 발전 방향에 대한 분석...",
      image: "/images/ai-trend.jpg",
    },
    {
      id: 2,
      title: "디지털 트랜스포메이션의 현재와 미래",
      category: "DT",
      createDate: "2024-03-14",
      writer: "관리자",
      viewlog: "120",
      contents: "디지털 트랜스포메이션의 현재 상황과 미래 전망...",
      image: "/images/dt-trend.jpg",
    },
    {
      id: 3,
      title: "머신러닝 기초 교육 자료",
      category: "교육",
      createDate: "2024-03-13",
      writer: "관리자",
      viewlog: "200",
      contents: "머신러닝의 기초 개념과 실습 방법...",
      image: "/images/ml-basic.jpg",
    },
  ];

  const handleRowClick = (id) => {
    navigate(`/ideaboard/trend/${id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      contents: content,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 호출로 데이터 전송
    console.log("Form submitted:", formData);
    setIsModalOpen(false);
    setFormData({
      title: "",
      category: "",
      contents: "",
      image: null,
    });
  };

  return (
    <div className="trendPage">
      <div className="trendPageContainer">
        <div className="trendPageHeader">
          <div className="trendPageTitle">
            <h1>기술동향</h1>
            <p>AI/DT 관련 교육 자료 및 동향을 소개합니다</p>
          </div>
          <button
            className="registerButton"
            onClick={() => setIsModalOpen(true)}
          >
            기술 동향 등록
          </button>
        </div>

        <div className="trendTable">
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>카테고리</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {mockTrends.map((trend, index) => (
                <tr
                  key={trend.id}
                  onClick={() => handleRowClick(trend.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{trend.title}</td>
                  <td>{trend.category}</td>
                  <td>{trend.writer}</td>
                  <td>{trend.createDate}</td>
                  <td>{trend.viewlog}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="modalOverlay">
            <div className="modalContent">
              <div className="modalHeader">
                <h2>기술 동향 등록</h2>
                <button
                  className="closeButton"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="formGroup">
                  <label>제목</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="formGroup">
                  <label>카테고리</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="AI">AI</option>
                    <option value="DT">DT</option>
                    <option value="교육">교육</option>
                  </select>
                </div>
                <div className="formGroup">
                  <label>내용</label>
                  <div className="editorContainer">
                    <ReactQuill
                      theme="snow"
                      value={formData.contents}
                      onChange={handleEditorChange}
                      modules={modules}
                      formats={formats}
                    />
                  </div>
                </div>
                <div className="formGroup">
                  <label>대표 이미지</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="modalFooter">
                  <button type="submit" className="submitButton">
                    등록
                  </button>
                  <button
                    type="button"
                    className="cancelButton"
                    onClick={() => setIsModalOpen(false)}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendPage;
