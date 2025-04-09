import React, { useState, useMemo, useCallback, useEffect } from "react";
import "./ideaManagement.scss";
import DataTable from "../../../components/DataTable/DataTable";
import FilterSelect from "./FilterSelect";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useNavigate } from "react-router-dom";
import axios from "axios";

dayjs.extend(isBetween);

// 테이블 컬럼 정의
const columns = [
  { field: "display_id", headerName: "ID", width: 50 },
  { field: "status", headerName: "개발상태", width: 100 },
  { field: "dev_category", headerName: "개발유형", width: 100 },
  { field: "biz_category", headerName: "사업분야", width: 100 },
  { field: "workfl_category", headerName: "업무분야", width: 100 },
  { field: "idea_title", headerName: "제목", width: 400 },
  { field: "team", headerName: "개발팀", width: 100 },
  { field: "name", headerName: "담당자", width: 100 },
  { field: "start_date", headerName: "시작일", width: 100 },
  { field: "end_date", headerName: "완료예정일", width: 100 },
  { field: "progress", headerName: "진행률", width: 80 },
  { field: "Dday", headerName: "남은일수", width: 80 },
];

// 필터 옵션
const filterOptions = {
  status: ["선택", "개발중", "테스트", "배포완료", "보류"],
  dev_category: ["선택", "Access", "Infra", "신규개발", "고도화"],
  biz_category: [
    "선택",
    "Access",
    "AOC",
    "Biz",
    "Infra설비",
    "SO",
    "기업문화",
    "안전보건",
    "자산",
    "전송",
  ],
  workfl_category: [
    "선택",
    "품질",
    "고장",
    "RM",
    "시설",
    "CE",
    "사무",
    "Biz",
    "기타",
  ],
  searchType: ["제목", "담당자", "개발팀"],
};

const IdeaManagement = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 필터 상태 관리
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

  // 데이터 가져오기
  useEffect(() => {
    const fetchDevelopments = async () => {
      try {
        setLoading(true);
        // 실제 API 경로로 수정 필요 (현재는 예시로 ideas API 사용)
        const response = await axios.get("/api/ideas");

        // 가져온 데이터를 개발 관리 형식으로 변환
        const formattedData = response.data.map((idea, index) => {
          // 개발 시작일과 종료일을 임의로 설정 (실제로는 DB에서 가져와야 함)
          const startDate = new Date(idea.created_at);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 30); // 임시로 30일 후로 설정

          // 남은 일수 계산
          const today = new Date();
          const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          const dday = daysLeft > 0 ? `D-${daysLeft}` : "지연";

          // 임의로 진행률 설정 (실제로는 DB에서 가져와야 함)
          const progress = Math.min(
            Math.floor(((today - startDate) / (endDate - startDate)) * 100),
            100
          );

          return {
            id: idea.id,
            display_id: index + 1,
            idea_id: idea.id,
            status: idea.status === "developing" ? "개발중" : "개발대기",
            dev_category: idea.project_type || "",
            biz_category: idea.business_field || "",
            workfl_category: idea.job_field || "",
            idea_title: idea.title || "",
            team: idea.dept_name || "",
            name: idea.name || "",
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            progress: `${progress}%`,
            Dday: dday,
          };
        });

        setRows(formattedData);
      } catch (error) {
        console.error("개발 관리 데이터 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopments();
  }, []);

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
  };

  // 필터 값 변경 핸들러
  const handleFilterChange = useCallback(
    (key) => (e) => {
      setFilters((prev) => ({ ...prev, [key]: e.target.value }));
    },
    []
  );

  // 날짜 변경 핸들러
  const handleStartDateChange = useCallback((newValue) => {
    setFilters((prev) => ({ ...prev, startDate: newValue }));
  }, []);

  const handleEndDateChange = useCallback((newValue) => {
    setFilters((prev) => ({ ...prev, endDate: newValue }));
  }, []);

  // 필터링 로직
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // 검색어 필터링
      if (filters.searchText) {
        const searchFieldMap = {
          제목: row.idea_title,
          담당자: row.name,
          개발팀: row.team,
        };
        const searchField = searchFieldMap[filters.searchType];
        if (
          !searchField?.toLowerCase().includes(filters.searchText.toLowerCase())
        )
          return false;
      }

      // 날짜 범위 필터링
      if (filters.startDate && filters.endDate) {
        const rowStartDate = dayjs(row.start_date);
        if (!rowStartDate.isValid()) return false;

        const start = dayjs(filters.startDate);
        const end = dayjs(filters.endDate);

        if (!rowStartDate.isBetween(start, end, "day", "[]")) {
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
  }, [filters, rows]);

  // 행 클릭 핸들러
  const handleRowClick = (row) => {
    console.log("Row clicked in IdeaManagement:", row);
    const url = `/ideaboard/detail/${row.idea_id}`;
    console.log("Navigating to:", url);
    navigate(url);
  };

  return (
    <div className="ideaManagement">
      <div className="titleHeader">
        <img
          src={`${process.env.PUBLIC_URL}/image/icons/idea.png`}
          alt="ideaicon"
        />
        <h1>개발 관리</h1>
      </div>

      {/* 필터 영역 */}
      <div className="filterBar">
        <FilterSelect
          label="개발상태"
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

        {/* 날짜 선택기 */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="시작일"
            value={filters.startDate}
            onChange={handleStartDateChange}
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>

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

      {/* 테이블 헤더 */}
      <div className="headerRow">
        <span>
          <span className="count-number">{filteredRows.length}</span>건의 개발
          프로젝트가 있습니다
        </span>
      </div>

      {/* 데이터 테이블 */}
      {loading ? (
        <div>데이터를 불러오는 중입니다...</div>
      ) : (
        <DataTable
          slug="development"
          columns={columns}
          rows={filteredRows}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
};

export default IdeaManagement;
