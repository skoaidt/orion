import React, { useState, useMemo, useCallback } from "react";
import DataTable from "../../../components/DataTable/DataTable";
import FilterSelect from "./FilterSelect";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "./ideaTable.scss";

dayjs.extend(isBetween);

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "status", headerName: "Status", width: 80, editable: true },
  { field: "dev_category", headerName: "개발유형", width: 100, editable: true },
  { field: "biz_category", headerName: "사업분야", width: 100, editable: true },
  {
    field: "workfl_category",
    headerName: "업무분야",
    width: 100,
    editable: true,
  },
  { field: "idea_title", headerName: "제목", width: 450, editable: true },
  { field: "headqt", headerName: "제안본부", width: 80, editable: true },
  { field: "team", headerName: "제안팀", width: 100, editable: true },
  { field: "name", headerName: "작성자", width: 100, editable: true },
  { field: "reg_date", headerName: "등록일", width: 100, editable: true },
  { field: "views", headerName: "조회수", width: 80, editable: true },
  { field: "likes", headerName: "Like", width: 80, editable: true },
  { field: "Dday", headerName: "D-day", width: 80, editable: true },
];

const filterOptions = {
  status: ["선택", "등록", "검증", "완료"],
  dev_category: ["선택", "Access", "Infra"],
  biz_category: ["선택", "Access", "Infra", "RM"],
  workfl_category: ["선택", "품질", "RM"],
  searchType: ["제목", "작성자", "제안팀", "제안본부"],
};

const originalRows = [
  {
    id: 1,
    status: "등록",
    dev_category: "access",
    biz_category: "infra",
    workfl_category: "rm",
    idea_title: "아이디어1",
    headqt: "본부1",
    team: "팀1",
    name: "홍길동",
    reg_date: "2025-02-01",
    views: 100,
    likes: 10,
    Dday: "D-3",
  },
  {
    id: 2,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 3,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2025-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 4,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 5,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 6,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 7,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 8,
    status: "검증",
    dev_category: "Access",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 9,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 10,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 11,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 12,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 13,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 14,
    status: "검증",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
  {
    id: 15,
    status: "완료",
    dev_category: "infra",
    biz_category: "access",
    workfl_category: "품질",
    idea_title: "아이디어2",
    headqt: "본부2",
    team: "팀2",
    name: "이순신",
    reg_date: "2023-10-02",
    views: 150,
    likes: 20,
    Dday: "D-2",
  },
];

const IdeaTable = () => {
  // ✅ 필터 상태를 객체로 관리 (startDate와 endDate 추가)
  const [filters, setFilters] = useState({
    status: "선택",
    dev_category: "선택",
    biz_category: "선택",
    workfl_category: "선택",
    searchType: "제목",
    searchText: "",
    startDate: null,
    endDate: null,
  });

  // ✅ 필터 값 변경 핸들러(useCallback으로 최적화)
  const handleFilterChange = useCallback(
    (key) => (e) => {
      setFilters((prev) => ({ ...prev, [key]: e.target.value }));
    },
    []
  );

  // ✅ 날짜 변경 핸들러(useCallback으로 최적화)
  const handleStartDateChange = useCallback((newValue) => {
    setFilters((prev) => ({ ...prev, startDate: newValue }));
  }, []);

  const handleEndDateChange = useCallback((newValue) => {
    setFilters((prev) => ({ ...prev, endDate: newValue }));
  }, []);

  // ✅ 필터링 로직(useMemo로 최적화)
  const filteredRows = useMemo(() => {
    return originalRows.filter((row) => {
      // 검색어 필터링
      if (filters.searchText) {
        const searchFieldMap = {
          제목: row.idea_title,
          작성자: row.name,
          제안팀: row.team,
          제안본부: row.headqt,
        };
        const searchField = searchFieldMap[filters.searchType];
        if (
          !searchField?.toLowerCase().includes(filters.searchText.toLowerCase())
        )
          return false;
      }

      // 날짜 범위 필터링
      if (filters.startDate && filters.endDate) {
        const rowDate = dayjs(row.reg_date);
        if (!rowDate.isValid()) return false;

        const start = dayjs(filters.startDate);
        const end = dayjs(filters.endDate);

        if (!rowDate.isBetween(start, end, "day", "[]")) {
          return false;
        }
      }

      // 카테고리 필터링
      const categories = [
        "status",
        "dev_category",
        "biz_category",
        "workfl_category",
      ];
      for (let category of categories) {
        if (
          filters[category] !== "선택" &&
          row[category]?.toLowerCase() !== filters[category]?.toLowerCase()
        ) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="ideaTable">
      <img
        src={`${process.env.PUBLIC_URL}/image/icons/idea.png`}
        alt="ideaicon"
      />
      <h1>Idea Board</h1>

      {/* ✅ 필터 영역 */}
      <div className="MenuBox">
        <FilterSelect
          label="Status"
          value={filters.status}
          options={filterOptions.status}
          onChange={handleFilterChange("status")}
        />

        <FilterSelect
          label="개발유형"
          value={filters.dev_category}
          options={filterOptions.dev_category}
          onChange={handleFilterChange("dev_category")}
        />

        <FilterSelect
          label="사업분야"
          value={filters.biz_category}
          options={filterOptions.biz_category}
          onChange={handleFilterChange("biz_category")}
        />

        <FilterSelect
          label="업무분야"
          value={filters.workfl_category}
          options={filterOptions.workfl_category}
          onChange={handleFilterChange("workfl_category")}
        />

        {/* ✅ 시작 날짜 선택 */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="시작일"
            value={filters.startDate}
            onChange={handleStartDateChange}
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>

        {/* ✅ 종료 날짜 선택 */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="종료일"
            value={filters.endDate}
            onChange={handleEndDateChange}
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>

        <FilterSelect
          label="검색"
          value={filters.searchType}
          options={filterOptions.searchType}
          onChange={handleFilterChange("searchType")}
        />

        {/* 검색창 */}
        <TextField
          size="small"
          placeholder={`${filters.searchType} 검색...`}
          value={filters.searchText}
          onChange={handleFilterChange("searchText")}
          sx={{ minWidth: 200 }}
        />
      </div>

      {/* 테이블 헤더 및 등록 버튼 */}
      <div className="headerRow">
        <span>
          <span className="count-number">{filteredRows.length}</span>건의 Idea가
          등록되었습니다
        </span>
        <button>IDEA 등록</button>
      </div>

      {/* 데이터 테이블 */}
      <DataTable slug="idea" columns={columns} rows={filteredRows} />
    </div>
  );
};

export default IdeaTable;
