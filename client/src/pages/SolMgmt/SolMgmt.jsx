import React, { useState, useEffect } from "react";
import "./solMgmt.scss";
import GitHubIcon from "@mui/icons-material/GitHub";
import DataTable from "../../components/DataTable/DataTable";
import axios from "axios";
import { format, differenceInDays } from "date-fns";

const SolMgmt = () => {
  // 아이디어 목록 데이터 상태
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFigmaImage, setShowFigmaImage] = useState(true); // 피그마 이미지 표시 상태
  const [imageError, setImageError] = useState(false); // 이미지 로드 오류 상태

  // 이미지 에러 처리 함수
  const handleImageError = () => {
    console.error("피그마 이미지를 로드할 수 없습니다.");
    setImageError(true);
  };

  // 데모 보기/숨기기 토글 함수
  const toggleDemo = () => {
    setShowFigmaImage(!showFigmaImage);
  };

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

        // 모든 아이디어 목록 가져오기
        const response = await axios.get("/api/ideas");

        // "개발완료" 상태인 아이디어만 필터링
        const completedIdeas = response.data.filter(
          (idea) =>
            idea.status === "완료" ||
            idea.status === "개발완료" ||
            idea.status === "completed" ||
            idea.status === "developmentCompleted"
        );

        // 각 아이디어에 대해 개발심의 데이터 가져오기 (병렬 처리)
        const ideasWithDevReviewData = await Promise.all(
          completedIdeas.map(async (idea, index) => {
            try {
              // 개발심의 데이터 가져오기
              const devReviewResponse = await axios.get(
                `/api/ideas/devreview/${idea.idea_id || idea.id}`
              );

              const devReviewData = devReviewResponse.data;

              // 시작일과 종료일 추출
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
                status: idea.status,
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
                status: idea.status,
                title: idea.title || "-",
                dept_name: idea.dept_name || "-",
                name: idea.author || "-",
                job_field: idea.VerifyField || "-",
                project_type: "-",
                business_field: "-",
                dev_team: "-",
                start_date: "-",
                end_date: "-",
                dday: null,
              };
            }
          })
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
    <div className="solMgmt">
      {/* 피그마 이미지 섹션 */}
      <div className="figma-image-section">
        <div className="header-buttons">
          <button className="toggle-button" onClick={toggleDemo}>
            {showFigmaImage ? "개발 중 Demo 버전 보기" : "기획 버전 보기"}
          </button>
        </div>

        {showFigmaImage && (
          <div className="figma-image-container">
            {!imageError ? (
              <>
                <img
                  src="/upload/Completed/Demosystem.jpg"
                  alt="System 활용률 Figma 디자인"
                  className="figma-image"
                  onError={handleImageError}
                />
              </>
            ) : (
              <div className="image-error">
                <p>이미지를 불러올 수 없습니다. 이미지 경로를 확인해주세요.</p>
                <p>기본 경로: {"/upload/Completed/Demosystem.jpg"}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Demo 버전 - 기존 코드 유지 */}
      {!showFigmaImage && (
        <>
          {/* DevTable 스타일의 타이틀 헤더 */}
          <div className="titleHeader">
            <GitHubIcon style={{ fontSize: "30px", color: "#565656" }} />
            <h1>System 활용률(Demo)</h1>
          </div>
          {/* 그리드 레이아웃 컨테이너 */}
          <div className="boxContainer">
            {/* 첫 번째 줄: 2개 박스 */}
            <div className="box box1">
              <h3>Solution Top5</h3>
              <div className="content">시스템 활용률 데이터 1</div>
            </div>
            <div className="box box2">
              <h3>Solution Worst 5</h3>
              <div className="content">시스템 활용률 데이터 2</div>
            </div>

            {/* 두 번째 줄: 8:2 비율의 박스들을 위한 컨테이너 */}
            <div className="second-row-container">
              {/* 두 번째 줄 첫 번째 박스 (80%) */}
              <div className="box box3">
                <h3>Keyword Card</h3>
                <div className="content">시스템 활용률 데이터 3</div>
              </div>
              {/* 두 번째 줄 두 번째 박스 (20%) */}
              <div className="box box4">
                <h3>KeyWord Best</h3>
                <div className="content">시스템 활용률 데이터 4</div>
              </div>
            </div>

            {/* 세 번째 줄: 1개 박스 - 개발완료 아이디어 목록 */}
            <div className="box box5">
              <h3>Solution 활용 현황</h3>
              <div className="content table-container">
                {/* 데이터 테이블 */}
                {loading ? (
                  <div>데이터를 불러오는 중입니다...</div>
                ) : error ? (
                  <div className="error-container">
                    <p className="error-message">{error}</p>
                  </div>
                ) : (
                  <DataTable
                    slug="sol"
                    columns={columns}
                    rows={ideas}
                    onRowClick={handleIdeaClick}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SolMgmt;
