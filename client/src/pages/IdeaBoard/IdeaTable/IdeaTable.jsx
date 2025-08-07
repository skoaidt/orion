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
  { field: "status", headerName: "Status", width: 150, editable: true },
  { field: "dev_category", headerName: "개발유형", width: 100, editable: true },
  { field: "biz_category", headerName: "사업분야", width: 100, editable: true },
  {
    field: "workfl_category",
    headerName: "업무분야",
    width: 100,
    editable: true,
  },
  { field: "idea_title", headerName: "제목", width: 500, editable: true },
  { field: "headqt", headerName: "제안본부", width: 130, editable: true },
  { field: "team", headerName: "제안팀", width: 130, editable: true },
  { field: "name", headerName: "작성자", width: 100, editable: true },
  { field: "reg_date", headerName: "등록일", width: 100, editable: true },
  { field: "views", headerName: "조회수", width: 80, editable: true },
  // { field: "likes", headerName: "Like", width: 80, editable: true },
  // { field: "Dday", headerName: "D-day", width: 80, editable: true },
];

const filterOptions = {
  status: [
    "선택",
    "등록",
    "선정",
    "Pilot",
    "검증",
    "개발심의",
    "개발중",
    "개발완료",
    "보안진단",
  ],
  dev_category: ["선택", "신규개발", "기 완료"],
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
    "공통",
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
    "서버",
    "교육",
    "자산",
    "안전",
    "기타",
  ],
  searchType: ["제목", "작성자", "제안팀", "제안본부"],
};

const IdeaTable = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 첫 번째 팝업 관련 상태
  const [showPopup, setShowPopup] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 두 번째 팝업 관련 상태 추가 - 초기 위치를 왼쪽으로 설정
  const [showPopup2, setShowPopup2] = useState(false);
  const [dontShowToday2, setDontShowToday2] = useState(false);
  const [position2, setPosition2] = useState({ x: -500, y: 0 }); // 첫 번째 팝업 왼쪽에 위치
  const [dragging2, setDragging2] = useState(false);
  const [dragStart2, setDragStart2] = useState({ x: 0, y: 0 });

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

  // 오늘 날짜 팝업을 보지 않았는지 확인하는 함수
  const checkShouldShowPopup = () => {
    const today = new Date().toDateString();
    const hiddenDate = localStorage.getItem("hidePopupDate");
    return hiddenDate !== today;
  };

  // 두 번째 팝업 - 오늘 날짜 팝업을 보지 않았는지 확인하는 함수
  const checkShouldShowPopup2 = () => {
    const today = new Date().toDateString();
    const hiddenDate = localStorage.getItem("hidePopupDate2");
    return hiddenDate !== today;
  };

  // 컴포넌트 마운트 시 두 팝업 모두 표시 여부 확인
  useEffect(() => {
    if (checkShouldShowPopup()) {
      setShowPopup(true);
    }
    if (checkShouldShowPopup2()) {
      setShowPopup2(true);
    }
  }, []);

  // 첫 번째 팝업 닫기 함수
  const handleClosePopup = () => {
    if (dontShowToday) {
      const today = new Date().toDateString();
      localStorage.setItem("hidePopupDate", today);
    }
    setShowPopup(false);
    setDontShowToday(false);
    setPosition({ x: 0, y: 0 }); // 위치 초기화
  };

  // 두 번째 팝업 닫기 함수
  const handleClosePopup2 = () => {
    if (dontShowToday2) {
      const today = new Date().toDateString();
      localStorage.setItem("hidePopupDate2", today);
    }
    setShowPopup2(false);
    setDontShowToday2(false);
    setPosition2({ x: -500, y: 0 }); // 위치 초기화 시에도 왼쪽 위치로 설정
  };

  // 첫 번째 팝업 드래그 관련 함수들
  const handleMouseDown = useCallback(
    (e) => {
      setDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position.x, position.y]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (dragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [dragging, dragStart.x, dragStart.y]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  // 두 번째 팝업 드래그 관련 함수들
  const handleMouseDown2 = useCallback(
    (e) => {
      setDragging2(true);
      setDragStart2({
        x: e.clientX - position2.x,
        y: e.clientY - position2.y,
      });
    },
    [position2.x, position2.y]
  );

  const handleMouseMove2 = useCallback(
    (e) => {
      if (dragging2) {
        setPosition2({
          x: e.clientX - dragStart2.x,
          y: e.clientY - dragStart2.y,
        });
      }
    },
    [dragging2, dragStart2.x, dragStart2.y]
  );

  const handleMouseUp2 = useCallback(() => {
    setDragging2(false);
  }, []);

  // 첫 번째 팝업 드래그 이벤트 리스너 추가/제거
  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  // 두 번째 팝업 드래그 이벤트 리스너 추가/제거
  useEffect(() => {
    if (dragging2) {
      document.addEventListener("mousemove", handleMouseMove2);
      document.addEventListener("mouseup", handleMouseUp2);
    } else {
      document.removeEventListener("mousemove", handleMouseMove2);
      document.removeEventListener("mouseup", handleMouseUp2);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove2);
      document.removeEventListener("mouseup", handleMouseUp2);
    };
  }, [dragging2, handleMouseMove2, handleMouseUp2]);

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
        // 개발 환경에서만 에러 로그 출력
        if (process.env.NODE_ENV === "development") {
          console.error("아이디어 목록 가져오기 오류:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [isModalOpen]); // 모달이 닫힐 때마다 데이터 새로고침

  // 날짜 포맷 함수
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
  }, []);

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
      const categories = ["dev_category", "biz_category", "workfl_category"];
      for (let category of categories) {
        if (
          filters[category] !== "선택" &&
          row[category]?.toLowerCase() !== filters[category]?.toLowerCase()
        ) {
          return false;
        }
      }

      // status 필터링 (특별 처리)
      if (filters.status !== "선택") {
        if (filters.status === "보안진단") {
          // "보안진단" 필터가 선택된 경우 두 가지 보안진단 완료 상태를 모두 포함
          const isSecurityComplete =
            row.status === "소스코드보안진단완료" ||
            row.status === "인프라보안진단완료";
          if (!isSecurityComplete) {
            return false;
          }
        } else {
          // 다른 status 필터는 기존대로 처리
          if (row.status?.toLowerCase() !== filters.status?.toLowerCase()) {
            return false;
          }
        }
      }

      return true;
    });
  }, [filters, rows]);

  // 행 클릭 핸들러 - 원본 idea_id로 상세 페이지 이동
  const handleRowClick = useCallback(
    (row) => {
      // 개발 환경에서만 로그 출력
      if (process.env.NODE_ENV === "development") {
        console.log("Row clicked in IdeaTable:", row);
      }
      const url = `/ideaboard/detail/${row.idea_id}`; // idea_id를 사용하여 상세 페이지로 이동
      if (process.env.NODE_ENV === "development") {
        console.log("Navigating to:", url);
      }
      navigate(url);
    },
    [navigate]
  );

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="ideaTable">
      <div className="titleHeader">
        <img
          src={`${process.env.PUBLIC_URL}/image/icons/idea.png`}
          alt="ideaicon"
        />
        <h1>신규 제안</h1>
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
          <span className="count-number">{filteredRows.length}</span>건의 신규
          제안이 등록되었습니다
        </span>
        <button onClick={handleOpenModal}>신규 제안 등록</button>
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

      {/* 팝업 모달들 - 두 모달을 하나의 컨테이너에서 동시 렌더링 */}
      {(showPopup || showPopup2) && (
        <div className="popup-overlay" style={{ zIndex: 1000 }}>
          {/* 첫 번째 팝업 모달 */}
          {showPopup && (
            <div
              className="popup-modal"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: dragging ? "grabbing" : "grab",
              }}
            >
              <div
                className="popup-header"
                onMouseDown={handleMouseDown}
                style={{ cursor: "grab" }}
              >
                <h2>안내사항</h2>
              </div>
              <div className="popup-content">
                <p>
                  본 페이지에서는
                  <br />
                  <span
                    style={{
                      color: "#d32f2f",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    신규 개발이 필요한 과제에 대한 제안
                  </span>
                  만 받고 있습니다.
                  <br />
                  <br />
                  기 운영 중인 시스템 기능개선 및 성능개선 관련 제안은
                  <br />
                  추후 별도의 공지를 통해 접수 할 예정이오니, 이 점 양해
                  부탁드립니다.
                  <br />
                  <br />
                  추가로 궁금하신 사항은 담당자에게 문의해 주시면 신속하게
                  답변드리겠습니다.
                  <br />
                  <br />
                  감사합니다.
                  <br />
                  <br />○ 담당자 : AI/DT기획PL 김민영, 전다현
                </p>
              </div>
              <div className="popup-footer">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="dontShowToday"
                    checked={dontShowToday}
                    onChange={(e) => setDontShowToday(e.target.checked)}
                  />
                  <label htmlFor="dontShowToday">
                    오늘 하루 이 메시지 보지 않기
                  </label>
                </div>
                <button className="close-button" onClick={handleClosePopup}>
                  닫기
                </button>
              </div>
            </div>
          )}

          {/* 두 번째 팝업 모달 */}
          {showPopup2 && (
            <div
              className="popup-modal"
              style={{
                transform: `translate(${position2.x}px, ${position2.y}px)`,
                cursor: dragging2 ? "grabbing" : "grab",
              }}
            >
              <div
                className="popup-header"
                onMouseDown={handleMouseDown2}
                style={{ cursor: "grab" }}
              >
                <h2>보안진단 안내</h2>
              </div>
              <div className="popup-content">
                <p>
                  과제 개발 환경이 SKO서버, 자체 프로그램 등
                  <br />
                  <span
                    style={{
                      color: "#d32f2f",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    ID CUBE(Play ground) 외 환경 일 시 보안진단 이행은 필수
                  </span>
                  입니다.
                  <br />
                  <br />
                  <span
                    style={{
                      color: "#d32f2f",
                      fontWeight: "bold",
                    }}
                  >
                    ※ 미 이행 시 개발 시스템 오픈 및 사용 불가
                  </span>
                  <br />
                  <br />○ 보안진단 문의 : 경영기획팀/ 김동희
                </p>
              </div>
              <div className="popup-footer">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="dontShowToday2"
                    checked={dontShowToday2}
                    onChange={(e) => setDontShowToday2(e.target.checked)}
                  />
                  <label htmlFor="dontShowToday2">
                    오늘 하루 이 메시지 보지 않기
                  </label>
                </div>
                <button className="close-button" onClick={handleClosePopup2}>
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IdeaTable;
