import React from "react";
import "./ideaTable.scss";
import DataTable from "../../../components/DataTable/DataTable";

const IdeaTable = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "status", headerName: "Status", width: 80, editable: true },
    { field: "dev_category", headerName: "개발유형", width: 100, editable: true },
    { field: "biz_category", headerName: "사업분야", width: 100, editable: true },
    { field: "workfl_category", headerName: "업무분야", width: 100, editable: true },
    { field: "idea_title", headerName: "제목", width: 450, editable: true },
    { field: "headqt", headerName: "제안본부", width: 80, editable: true },
    { field: "team", headerName: "제안팀", width: 100, editable: true },
    { field: "name", headerName: "작성자", width: 100, editable: true },
    { field: "reg_date", headerName: "등록일", width: 100, editable: true },
    { field: "views", headerName: "조회수", width: 80, editable: true },
    { field: "likes", headerName: "Like", width: 80, editable: true },
    { field: "Dday", headerName: "D-day", width: 80, editable: true },
  ];

  const rows = [
    { id: 1, status: "등록", dev_category: "access", biz_category: "infra", workfl_category: "rm", idea_title: "아이디어1", headqt: "본부1", team: "팀1", name: "홍길동", reg_date: "2023-10-01", views: 100, likes: 10, Dday: "D-3" },
    { id: 2, status: "검증", dev_category: "infra", biz_category: "access", workfl_category: "품질", idea_title: "아이디어2", headqt: "본부2", team: "팀2", name: "이순신", reg_date: "2023-10-02", views: 150, likes: 20, Dday: "D-2" },
    { id: 3, status: "등록", dev_category: "access", biz_category: "infra", workfl_category: "rm", idea_title: "아이디어1", headqt: "본부1", team: "팀1", name: "홍길동", reg_date: "2023-10-01", views: 100, likes: 10, Dday: "D-3" },
    { id: 4, status: "검증", dev_category: "infra", biz_category: "access", workfl_category: "품질", idea_title: "아이디어2", headqt: "본부2", team: "팀2", name: "이순신", reg_date: "2023-10-02", views: 150, likes: 20, Dday: "D-2" },
    { id: 5, status: "등록", dev_category: "access", biz_category: "infra", workfl_category: "rm", idea_title: "아이디어1", headqt: "본부1", team: "팀1", name: "홍길동", reg_date: "2023-10-01", views: 100, likes: 10, Dday: "D-3" },
    { id: 6, status: "검증", dev_category: "infra", biz_category: "access", workfl_category: "품질", idea_title: "아이디어2", headqt: "본부2", team: "팀2", name: "이순신", reg_date: "2023-10-02", views: 150, likes: 20, Dday: "D-2" },
    { id: 7, status: "등록", dev_category: "access", biz_category: "infra", workfl_category: "rm", idea_title: "아이디어1", headqt: "본부1", team: "팀1", name: "홍길동", reg_date: "2023-10-01", views: 100, likes: 10, Dday: "D-3" },
    { id: 8, status: "검증", dev_category: "infra", biz_category: "access", workfl_category: "품질", idea_title: "아이디어2", headqt: "본부2", team: "팀2", name: "이순신", reg_date: "2023-10-02", views: 150, likes: 20, Dday: "D-2" },
    { id: 9, status: "등록", dev_category: "access", biz_category: "infra", workfl_category: "rm", idea_title: "아이디어1", headqt: "본부1", team: "팀1", name: "홍길동", reg_date: "2023-10-01", views: 100, likes: 10, Dday: "D-3" },
    { id: 10, status: "검증", dev_category: "infra", biz_category: "access", workfl_category: "품질", idea_title: "아이디어2", headqt: "본부2", team: "팀2", name: "이순신", reg_date: "2023-10-02", views: 150, likes: 20, Dday: "D-2" },
    { id: 11, status: "검증", dev_category: "infra", biz_category: "access", workfl_category: "품질", idea_title: "아이디어2", headqt: "본부2", team: "팀2", name: "이순신", reg_date: "2023-10-02", views: 150, likes: 20, Dday: "D-2" },
    { id: 12, status: "검증", dev_category: "infra", biz_category: "access", workfl_category: "품질", idea_title: "아이디어2", headqt: "본부2", team: "팀2", name: "이순신", reg_date: "2023-10-02", views: 150, likes: 20, Dday: "D-2" },

    // 추가적인 행을 필요에 따라 추가하세요.
  ];

  return (
    <div className="ideaTable">
      <h1>Idea Board</h1>
      <div className="MenuBox">
        <menu>개발유형</menu>
        <menu>사업분야</menu>
        <menu>업무분야</menu>
        <menu>등록일</menu>
        <menu>검색</menu>
        <menu>Status</menu>
      </div>
      <div className="headerRow">
        <span><span className="count-number">{rows[rows.length - 1]?.id || 0}</span>건의 Idea가 등록되었습니다</span>
        <button>IDEA 등록</button>
      </div>
      <DataTable slug="idea" columns={columns} rows={rows} />
    </div>
  );
};

export default IdeaTable;
