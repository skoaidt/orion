import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./devTable.scss";
import DataTable from "../../../components/DataTable/DataTable";
import FilterSelect from "../IdeaTable/FilterSelect";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import axios from "axios";
import { format, differenceInDays } from "date-fns";
import GitHubIcon from "@mui/icons-material/GitHub";

// 검색 필터 옵션 정의
const filterOptions = {
  searchType: ["제목", "작성자", "제안팀", "제안본부"],
};

// 상태 필터 옵션 정의
const statusOptions = [
  { value: "전체", label: "전체" },
  { value: "개발중", label: "개발중" },
  { value: "개발완료", label: "개발완료" },
  { value: "보안진단", label: "보안진단" },
];

const DevTable = () => {
  // 아이디어 목록 데이터 상태
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 검색 관련 상태
  const [searchFilters, setSearchFilters] = useState({
    searchType: "제목",
    searchText: "",
  });

  // 상태 필터 상태
  const [statusFilter, setStatusFilter] = useState("전체");

  // 컬럼 정의
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "idea_id", headerName: "아이디어 ID", width: 100 },
    { field: "status", headerName: "상태", width: 100 },
    { field: "business_field", headerName: "사업유형", width: 120 },
    { field: "job_field", headerName: "업무분야", width: 120 },
    { field: "title", headerName: "제목", width: 180, flex: 1 },
    { field: "dev_team", headerName: "개발팀", width: 120 },
    { field: "dept_name", headerName: "제안팀", width: 120 },
    { field: "name", headerName: "작성자", width: 100 },
    { field: "start_date", headerName: "시작날짜", width: 120 },
    { field: "end_date", headerName: "종료날짜", width: 120 },
    {
      field: "progress",
      headerName: "진행율",
      width: 100,
      renderCell: (params) => {
        if (!params.value && params.value !== 0) return "-";
        return (
          <span
            style={{
              color:
                params.value >= 100
                  ? "#4caf50"
                  : params.value >= 50
                  ? "#ff9800"
                  : "#f44336",
              fontWeight: "bold",
            }}
          >
            {params.value}%
          </span>
        );
      },
    },
    {
      field: "dday",
      headerName: "D-day",
      width: 100,
      renderCell: (params) => {
        if (!params.value && params.value !== 0) return "";
        return params.value > 0 ? (
          <span style={{ color: "green" }}>D-{params.value}</span>
        ) : (
          <span style={{ color: "red" }}>D+{Math.abs(params.value)}</span>
        );
      },
    },
  ];

  // 검색 필터 변경 핸들러
  const handleFilterChange = useCallback(
    (key) => (e) => {
      setSearchFilters((prev) => ({ ...prev, [key]: e.target.value }));
    },
    []
  );

  // 상태 필터 변경 핸들러
  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  // 상태 체크 함수 - 다양한 상태 표현을 통합
  const getUnifiedStatus = (status) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === "개발중" || lowerStatus === "developing") {
      return "개발중";
    }
    if (
      lowerStatus === "완료" ||
      lowerStatus === "개발완료" ||
      lowerStatus === "completed" ||
      lowerStatus === "developmentcompleted"
    ) {
      return "개발완료";
    }
    // 보안진단 상태 통합
    if (
      lowerStatus === "소스코드보안진단완료" ||
      lowerStatus === "인프라보안진단완료"
    ) {
      return "보안진단";
    }
    return status;
  };

  // 필터링된 아이디어 목록
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      // 상태 필터링
      if (statusFilter !== "전체") {
        if (statusFilter === "보안진단") {
          // "보안진단" 필터가 선택된 경우 두 가지 보안진단 완료 상태를 모두 포함
          const isSecurityComplete =
            idea.status === "소스코드보안진단완료" ||
            idea.status === "인프라보안진단완료";
          if (!isSecurityComplete) {
            return false;
          }
        } else {
          const unifiedStatus = getUnifiedStatus(idea.status);
          if (unifiedStatus !== statusFilter) {
            return false;
          }
        }
      }

      // 검색어 필터링
      if (searchFilters.searchText) {
        const searchFieldMap = {
          제목: idea.title,
          작성자: idea.name,
          제안팀: idea.dept_name,
          제안본부: idea.prnt_dept_name,
        };
        const searchField = searchFieldMap[searchFilters.searchType];
        if (
          !searchField
            ?.toLowerCase()
            .includes(searchFilters.searchText.toLowerCase())
        )
          return false;
      }
      return true;
    });
  }, [searchFilters, ideas, statusFilter]);

  // D-day 계산 함수
  const calculateDday = (endDateStr) => {
    if (!endDateStr) return null;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 시간 정보 제거

      const endDate = new Date(endDateStr);
      endDate.setHours(0, 0, 0, 0); // 시간 정보 제거

      return differenceInDays(endDate, today);
    } catch (error) {
      console.error("D-day 계산 중 오류:", error);
      return null;
    }
  };

  // 아이디어 데이터 가져오기
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        console.log("아이디어 목록 가져오기 시작");

        // 모든 아이디어 목록 가져오기 - 올바른 API 경로로 수정
        const response = await axios.get("/api/ideas");
        console.log("아이디어 목록 가져오기 성공:", response.data.length);

        // 실제 개발중이거나 완료된 아이디어만 필터링
        const developmentRelatedIdeas = response.data.filter(
          (idea) =>
            idea.status === "개발중" ||
            idea.status === "완료" ||
            idea.status === "개발완료" ||
            idea.status === "보안진단" ||
            idea.status === "소스코드보안진단완료" ||
            idea.status === "인프라보안진단완료" ||
            idea.status === "developing" ||
            idea.status === "completed" ||
            idea.status === "developmentCompleted"
        );
        console.log("개발 관련 아이디어 수:", developmentRelatedIdeas.length);

        // 각 아이디어에 대해 개발심의 데이터 가져오기 (병렬 처리)
        const ideasWithDevReviewData = await Promise.all(
          developmentRelatedIdeas.map(async (idea, index) => {
            try {
              console.log(
                `아이디어 ${
                  idea.idea_id || idea.id
                }의 개발심의 데이터 가져오기 시작`
              );

              // 개발심의 데이터 가져오기 - 올바른 API 경로로 수정
              const devReviewResponse = await axios.get(
                `/api/ideas/devreview/${idea.idea_id || idea.id}`
              );
              console.log(
                `아이디어 ${idea.idea_id || idea.id}의 개발심의 데이터:`,
                devReviewResponse.data
              );

              const devReviewData = devReviewResponse.data;

              // 시작일과 종료일 추출 (API 응답 구조에 따라 다르게 접근)
              let startDate = "-";
              let endDate = "-";
              let dday = null;
              let devTeam = "-"; // 첫 번째 개발자의 부서 정보

              // 새로운 API 응답 구조에서 일정 정보 추출 (schedule 객체가 있는 경우)
              if (devReviewData.schedule) {
                startDate = devReviewData.schedule.startDate || "-";
                endDate = devReviewData.schedule.endDate || "-";

                if (endDate && endDate !== "-") {
                  dday = calculateDday(endDate);
                  endDate = format(new Date(endDate), "yyyy-MM-dd");
                }

                if (startDate && startDate !== "-") {
                  startDate = format(new Date(startDate), "yyyy-MM-dd");
                }

                // 개발자 목록이 있으면 첫 번째 개발자의 부서 정보 가져오기
                if (
                  devReviewData.developers &&
                  devReviewData.developers.length > 0
                ) {
                  const firstDeveloper = devReviewData.developers[0];
                  devTeam = firstDeveloper.team || firstDeveloper.headqt || "-";
                }
              }
              // 기존 응답 구조에서 일정 정보 추출 (rawData 배열이 있는 경우)
              else if (
                devReviewData.rawData &&
                devReviewData.rawData.length > 0
              ) {
                const firstRecord = devReviewData.rawData[0];

                if (firstRecord.devScheduleStart) {
                  startDate = format(
                    new Date(firstRecord.devScheduleStart),
                    "yyyy-MM-dd"
                  );
                }

                if (firstRecord.devScheduleEnd) {
                  endDate = format(
                    new Date(firstRecord.devScheduleEnd),
                    "yyyy-MM-dd"
                  );
                  dday = calculateDday(firstRecord.devScheduleEnd);
                }

                // 첫 번째 개발자의 부서 정보 가져오기
                devTeam = firstRecord.team || firstRecord.headqt || "-";
              }
              // 직접 필드 접근 (이전 구조)
              else {
                if (
                  devReviewData.devScheduleStart ||
                  devReviewData.startDate ||
                  devReviewData.start_date
                ) {
                  const date =
                    devReviewData.devScheduleStart ||
                    devReviewData.startDate ||
                    devReviewData.start_date;
                  startDate = format(new Date(date), "yyyy-MM-dd");
                }

                if (
                  devReviewData.devScheduleEnd ||
                  devReviewData.endDate ||
                  devReviewData.end_date
                ) {
                  const date =
                    devReviewData.devScheduleEnd ||
                    devReviewData.endDate ||
                    devReviewData.end_date;
                  endDate = format(new Date(date), "yyyy-MM-dd");
                  dday = calculateDday(date);
                }

                // 개발자 부서 정보 추출 시도
                devTeam = devReviewData.team || devReviewData.headqt || "-";
              }

              // 테이블에 표시할 데이터 구성
              return {
                id: index + 1,
                idea_id: idea.idea_id || idea.id,
                status: idea.status, // 원본 상태 표시
                project_type: idea.project_type || "-",
                business_field: idea.business_field || "-",
                job_field: idea.job_field || "-",
                title: idea.title || "-",
                dev_team: devTeam, // 첫 번째 개발자의 부서 정보로 설정
                prnt_dept_name: idea.prnt_dept_name || "-",
                dept_name: idea.dept_name || "-",
                name: idea.name || "-",
                start_date: startDate,
                end_date: endDate,
                progress: idea.ideaprogress ? Number(idea.ideaprogress) : 0, // 진행율 추가
                dday: dday,
              };
            } catch (err) {
              console.error(
                `아이디어 ${
                  idea.id || idea.id
                }의 개발심의 데이터를 가져오는 중 오류:`,
                err
              );
              // 오류가 발생해도 기본 아이디어 데이터는 반환
              return {
                id: index + 1,
                idea_id: idea.idea_id || idea.id,
                status: idea.status, // 원본 상태 표시
                title: idea.title || "-",
                dept_name: idea.dept_name || "-",
                name: idea.author || "-",
                job_field: idea.VerifyField || "-",
                project_type: "-",
                business_field: "-",
                dev_team: "-",
                start_date: "-",
                end_date: "-",
                progress: 0,
                dday: null,
              };
            }
          })
        );

        console.log(
          "모든 아이디어 데이터 처리 완료:",
          ideasWithDevReviewData.length
        );
        setIdeas(ideasWithDevReviewData);
        setLoading(false);
      } catch (err) {
        console.error("아이디어 데이터를 가져오는 중 오류 발생:", err);
        setError(`API 오류: ${err.message}`);
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  // 아이디어 상세 페이지로 이동하는 함수
  const handleIdeaClick = (idea) => {
    if (!idea || !idea.idea_id) return;
    window.location.href = `/ideaboard/detail/${idea.idea_id}`;
  };

  return (
    <div className="devTable">
      {/* IdeaTable 스타일의 타이틀 헤더 */}
      <div className="titleHeader">
        <GitHubIcon style={{ fontSize: "30px", color: "#565656" }} />
        <h1>개발 과제 목록</h1>
      </div>

      {/* 검색 영역 */}
      <div className="MenuBox">
        {/* 상태 필터 Radio 그룹 */}
        <FormControl component="fieldset">
          <FormLabel
            component="legend"
            sx={{
              fontSize: "14px !important",
              color: "#565656 !important",
              marginBottom: "5px",
            }}
          >
            상태
          </FormLabel>
          <RadioGroup
            row
            value={statusFilter}
            onChange={handleStatusFilterChange}
            sx={{ gap: 1, marginTop: "5px" }}
          >
            {statusOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    size="small"
                    sx={{
                      padding: "4px",
                      color: "#565656",
                      "&.Mui-checked": {
                        color: "#1976d2",
                      },
                    }}
                  />
                }
                label={option.label}
                sx={{
                  marginRight: "15px",
                  "& .MuiFormControlLabel-label": {
                    fontSize: "14px !important",
                    color: "#333333 !important",
                    fontWeight: "500 !important",
                  },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <FilterSelect
          label="검색"
          value={searchFilters.searchType}
          options={filterOptions.searchType}
          onChange={handleFilterChange("searchType")}
        />

        {/* 검색창 */}
        <TextField
          size="small"
          placeholder={`${searchFilters.searchType} 검색...`}
          value={searchFilters.searchText}
          onChange={handleFilterChange("searchText")}
          sx={{ minWidth: 200 }}
        />
      </div>

      {/* 개수 표시하는 헤더 행 */}
      <div className="headerRow">
        <span>
          <span className="count-number">{filteredIdeas.length}</span>건의{" "}
          {statusFilter === "전체" ? "개발 관련" : statusFilter} 아이디어가
          있습니다
        </span>
      </div>

      {/* 데이터 테이블 */}
      {loading ? (
        <div>데이터를 불러오는 중입니다...</div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      ) : (
        <DataTable
          slug="dev"
          columns={columns}
          rows={filteredIdeas}
          onRowClick={handleIdeaClick}
        />
      )}
    </div>
  );
};

export default DevTable;
