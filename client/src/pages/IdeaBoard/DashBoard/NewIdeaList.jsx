import React from "react";
import "./newIdeaList.scss";
import DataTable from "../../../components/DataTable/DataTable";
import { newIdeaList } from "./data";
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
  // 데이터 가공 및 정렬 (배열 복사 후 처리)
  const processedData = [...newIdeaList].map((idea) => ({
    ...idea,
    created_at: idea.created_at.split(" ")[0],
  }));

  // 복사본 배열 정렬 및 자르기
  const sortedData = [...processedData]
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
        {sortedData.length === 0 ? (
          <p>현재 신규 등록된 과제가 없습니다.</p> // 데이터가 없을 경우 메시지 표시
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
