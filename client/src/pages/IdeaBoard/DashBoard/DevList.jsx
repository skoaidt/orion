import React from "react";
import "./devList.scss";
import DataTable from "../../../components/DataTable/DataTable";
import { devList } from "./data";

const columns = [
  {
    field: "title",
    headerName: "제목",
    width: 200,
    editable: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "d_day",
    headerName: "D-day",
    width: 100,
    editable: true,
  },
];

const calculateDDay = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  const timeDiff = targetDate - today;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff >= 0 ? daysDiff : 0; // D-day는 0 이하로 표시하지 않음
};

const rowsWithDDay = devList.map((item) => ({
  ...item,
  d_day: calculateDDay(item.completed_at),
}));

const DevList = () => {
  // 배열을 복사한 후 정렬
  const sortedRows = [...rowsWithDDay].sort((a, b) => a.d_day - b.d_day);

  return (
    <div className="devList">
      <div className="header">
        <p>개발진행 과제</p>
      </div>
      <div className="list">
        {sortedRows.length === 0 ? (
          <p>현재 개발이 진행되는 과제가 없습니다.</p> // 데이터가 없을 경우 메시지 표시
        ) : (
          <DataTable
            slug="idea"
            columns={columns}
            rows={sortedRows} // 복사하여 정렬된 배열 사용
            pagination={false}
          />
        )}
      </div>
    </div>
  );
};

export default DevList;
