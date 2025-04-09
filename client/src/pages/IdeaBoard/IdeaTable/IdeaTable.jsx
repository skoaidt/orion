import React, { useState, useMemo, useCallback, useEffect } from "react";
import DataTable from "../../../components/DataTable/DataTable";
import FilterSelect from "./FilterSelect";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "./ideaTable.scss";
import { useNavigate } from "react-router-dom";
import IdeaRegister from "../IdeaModal/IdeaRegister";
import axios from "axios";
dayjs.extend(isBetween);

const columns = [
  { field: "display_id", headerName: "ID", width: 50 }, // 화면에 표시되는 ID
  { field: "status", headerName: "Status", width: 100, editable: true },
  { field: "dev_category", headerName: "개발유형", width: 100, editable: true },
  { field: "biz_category", headerName: "사업분야", width: 100, editable: true },
  {
    field: "workfl_category",
    headerName: "업무분야",
    width: 100,
    editable: true,
  },
  { field: "idea_title", headerName: "제목", width: 500, editable: true },
  { field: "headqt", headerName: "제안본부", width: 80, editable: true },
  { field: "team", headerName: "제안팀", width: 100, editable: true },
  { field: "name", headerName: "작성자", width: 100, editable: true },
  { field: "reg_date", headerName: "등록일", width: 100, editable: true },
  { field: "views", headerName: "조회수", width: 80, editable: true },
  // { field: "likes", headerName: "Like", width: 80, editable: true },
  { field: "Dday", headerName: "D-day", width: 80, editable: true },
];

const filterOptions = {
  status: ["선택", "등록", "검증", "완료"],
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
  searchType: ["제목", "작성자", "제안팀", "제안본부"],
};

const IdeaTable = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 필터 상태를 객체로 관리
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
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/ideas");

        // 전체 조회수 정보 가져오기
        const viewCountsResponse = await axios.get("/api/ideas/viewcounts");

        // 조회수 정보를 아이디어 ID로 맵핑
        const viewCountsMap = {};
        viewCountsResponse.data.forEach((item) => {
          viewCountsMap[item.idea_id] = item.viewcount;
        });

        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const formattedData = response.data.map((idea, index) => ({
          id: idea.id, // 원래 DB의 id (내부 처리용)
          display_id: index + 1, // 화면에 표시될 순차적 ID
          idea_id: idea.id, // 원본 아이디어 ID 보존
          status: idea.status || "등록", // 기본값 설정
          dev_category: idea.project_type || "", // 과제 유형을 개발 유형으로 매핑
          biz_category: idea.business_field || "",
          workfl_category: idea.job_field || "",
          idea_title: idea.title || "",
          headqt: idea.prnt_dept_name || "",
          team: idea.dept_name || "",
          name: idea.name || "",
          reg_date: formatDate(idea.created_at),
          views: viewCountsMap[idea.id] || 0, // 실제 조회수 데이터 사용
          // likes: idea.likes || 0, // 기본값 설정 (백엔드에서 제공하지 않음)
          Dday: "D-0", // 기본값 설정 (백엔드에서 제공하지 않음)
        }));

        setRows(formattedData);
      } catch (error) {
        console.error("아이디어 목록 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [isModalOpen]); // 모달이 닫힐 때마다 데이터 새로고침

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

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
  }, [filters, rows]);

  // 행 클릭 핸들러 - 원본 idea_id로 상세 페이지 이동
  const handleRowClick = (row) => {
    console.log("Row clicked in IdeaTable:", row);
    const url = `/ideaboard/detail/${row.idea_id}`; // idea_id를 사용하여 상세 페이지로 이동
    console.log("Navigating to:", url);
    navigate(url);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="ideaTable">
      <div className="titleHeader">
        <img
          src={`${process.env.PUBLIC_URL}/image/icons/idea.png`}
          alt="ideaicon"
        />
        <h1>Idea Board</h1>
      </div>

      {/* 필터 영역 */}
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

        {/* 시작 날짜 선택 */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="시작일"
            value={filters.startDate}
            onChange={handleStartDateChange}
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>

        {/* 종료 날짜 선택 */}
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
        <button onClick={handleOpenModal}>IDEA 등록</button>
      </div>

      {/* 데이터 테이블 */}
      {loading ? (
        <div>데이터를 불러오는 중입니다...</div>
      ) : (
        <DataTable
          slug="idea"
          columns={columns}
          rows={filteredRows}
          onRowClick={handleRowClick}
        />
      )}

      {/* 모달 컴포넌트 */}
      {isModalOpen && <IdeaRegister onClose={handleCloseModal} />}
    </div>
  );
};

export default IdeaTable;
