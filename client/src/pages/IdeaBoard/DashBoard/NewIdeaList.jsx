import React from "react";
import "./newIdeaList.scss";
import DataTable from "../../../components/DataTable/DataTable";
import { newIdeaList } from "./data";

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
  // 데이터 가공 및 정렬 (배열 복사 후 처리)
  const processedData = [...newIdeaList].map((idea) => ({
    ...idea,
    created_at: idea.created_at.split(" ")[0],
  }));

  // 복사본 배열 정렬 및 자르기
  const sortedData = [...processedData]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 7);

  return (
    <div className="newIdeaList">
      <div className="header">
        <p>최신등록과제</p>
      </div>
      <div className="list">
        <DataTable
          slug="idea"
          columns={columns}
          rows={sortedData}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default NewIdeaList;
