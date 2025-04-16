import React, { useState, useEffect } from "react";
import "./newIdeaList.scss";
import DataTable from "../../../components/DataTable/DataTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    field: "title",
    headerName: "제목",
    width: 200,
    editable: true,
    headerAlign: "center",
    align: "left",
  },
  { field: "created_at", headerName: "등록일", width: 100, editable: true },
];

const NewIdeaList = () => {
  const navigate = useNavigate();
  const [ideaList, setIdeaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 날짜 포맷 변환 함수 (yyyy-mm-dd 형식으로 변환)
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // 이미 yyyy-mm-dd 형식이면 그대로 반환
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (err) {
      console.error("날짜 변환 오류:", err);
      return dateString;
    }
  };

  useEffect(() => {
    const fetchIdeaList = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/ideas");

        if (response.data && response.data.length > 0) {
          // API 응답에서 필요한 데이터만 추출하고 날짜 포맷 변환
          const processedData = response.data.map((idea) => ({
            id: idea.id,
            title: idea.title,
            created_at: formatDate(idea.created_at),
          }));
          setIdeaList(processedData);
        } else {
          // 데이터가 없는 경우 빈 배열 설정
          setIdeaList([]);
        }
      } catch (err) {
        console.error("아이디어 목록 로딩 중 오류:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setIdeaList([]); // 오류 발생 시 빈 배열 설정
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaList();
  }, []);

  // 복사본 배열 정렬 및 자르기
  const sortedData = [...ideaList]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  const handleRowClick = (row) => {
    console.log("Row clicked in IdeaTable:", row);
    const url = `/ideaboard/detail/${row.id}`;
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
          <p>데이터를 불러오는 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : sortedData.length === 0 ? (
          <p>현재 신규 등록된 과제가 없습니다.</p>
        ) : (
          <DataTable
            slug="idea"
            columns={columns}
            rows={sortedData}
            pagination={false}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </div>
  );
};

export default NewIdeaList;
