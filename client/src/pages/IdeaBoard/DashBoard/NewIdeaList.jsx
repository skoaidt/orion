import React, { useState, useEffect } from "react";
import "./newIdeaList.scss";
import DataTable from "../../../components/DataTable/DataTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const columns = [
  {
    field: "idea_title",
    headerName: "제목",
    width: 400,
    editable: false,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "reg_date",
    headerName: "등록일",
    width: 100,
    editable: false,
  },
];

const NewIdeaList = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentIdeas = async () => {
      try {
        setLoading(true);
        // IdeaTable.jsx와 동일한 API 호출
        const response = await axios.get("/api/ideas");

        // 날짜 포맷 함수
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return dateString;
          return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
        };

        // 데이터 형식화
        const formattedData = response.data.map((idea, index) => ({
          id: index + 1,
          original_id: idea.id, // 원본 아이디어 ID 보존
          idea_id: idea.id, // 상세 페이지 이동을 위한 ID
          idea_title: idea.title || "-",
          reg_date: formatDate(idea.created_at),
          created_at: idea.created_at, // 정렬을 위해 원본 날짜도 저장
        }));

        // 날짜를 기준으로 최신순으로 정렬하고 상위 8개만 가져오기
        const sortedData = formattedData
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 8);

        setIdeas(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("최신 아이디어 데이터를 가져오는 중 오류 발생:", err);
        setError(`데이터 로딩 오류: ${err.message}`);
        setLoading(false);
      }
    };

    fetchRecentIdeas();
  }, []);

  const handleRowClick = (row) => {
    if (!row || !row.idea_id) return;
    console.log("Row clicked in NewIdeaList:", row);
    const url = `/ideaboard/detail/${row.idea_id}`;
    console.log("Navigating to:", url);
    navigate(url);
  };

  return (
    <div className="newIdeaList">
      <div className="header">
        <p>최신등록 과제</p>
      </div>
      <div className="list">
        {loading ? (
          <div className="loading-container">
            <CircularProgress size={24} />
            <span>데이터를 불러오는 중...</span>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : ideas.length === 0 ? (
          <p>현재 신규 등록된 과제가 없습니다.</p>
        ) : (
          <DataTable
            slug="idea"
            columns={columns}
            rows={ideas}
            pagination={false}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </div>
  );
};

export default NewIdeaList;
