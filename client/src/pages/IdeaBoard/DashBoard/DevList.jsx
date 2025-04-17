import React, { useState, useEffect } from "react";
import "./devList.scss";
import DataTable from "../../../components/DataTable/DataTable";
import axios from "axios";
import { differenceInDays } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";

const columns = [
  {
    field: "title",
    headerName: "제목",
    width: 200,
    editable: false,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "dday",
    headerName: "D-day",
    width: 100,
    editable: false,
    renderCell: (params) => {
      if (!params.value && params.value !== 0) return "-";

      return params.value > 0 ? (
        <span style={{ color: params.value <= 7 ? "red" : "green" }}>
          D-{params.value}
        </span>
      ) : (
        <span style={{ color: "red" }}>D+{Math.abs(params.value)}</span>
      );
    },
  },
];

// D-day 계산 함수
const calculateDday = (endDateStr) => {
  if (!endDateStr || endDateStr === "-") return null;

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

const DevList = () => {
  const [devData, setDevData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevData = async () => {
      try {
        setLoading(true);
        // 아이디어 목록 가져오기
        const response = await axios.get("/api/ideas");

        // "개발중" 상태인 아이디어만 필터링
        const developingIdeas = response.data.filter(
          (idea) => idea.status === "개발중" || idea.status === "developing"
        );

        // 각 아이디어에 대해 개발심의 데이터 가져오기
        const processedData = await Promise.all(
          developingIdeas.map(async (idea, index) => {
            try {
              // 개발심의 데이터 가져오기
              const devReviewResponse = await axios.get(
                `/api/ideas/devreview/${idea.idea_id || idea.id}`
              );

              const devReviewData = devReviewResponse.data;

              // 종료일 추출
              let endDate = "-";

              // 새로운 API 응답 구조에서 일정 정보 추출
              if (devReviewData.schedule && devReviewData.schedule.endDate) {
                endDate = devReviewData.schedule.endDate;
              }
              // 기존 응답 구조에서 일정 정보 추출
              else if (
                devReviewData.rawData &&
                devReviewData.rawData.length > 0 &&
                devReviewData.rawData[0].devScheduleEnd
              ) {
                endDate = devReviewData.rawData[0].devScheduleEnd;
              }
              // 직접 필드 접근
              else if (
                devReviewData.devScheduleEnd ||
                devReviewData.endDate ||
                devReviewData.end_date
              ) {
                endDate =
                  devReviewData.devScheduleEnd ||
                  devReviewData.endDate ||
                  devReviewData.end_date;
              }

              const dday = calculateDday(endDate);

              return {
                id: index + 1,
                idea_id: idea.idea_id || idea.id,
                title: idea.title || "-",
                dday: dday,
                raw_endDate: endDate, // 정렬을 위해 원본 날짜도 저장
              };
            } catch (err) {
              console.error(
                `아이디어 ${
                  idea.idea_id || idea.id
                }의 개발심의 데이터를 가져오는 중 오류:`,
                err
              );
              // 오류가 발생해도 기본 데이터는 반환
              return {
                id: index + 1,
                idea_id: idea.idea_id || idea.id,
                title: idea.title || "-",
                dday: null,
                raw_endDate: null,
              };
            }
          })
        );

        // D-day 기준으로 정렬 (null 값은 뒤로)
        const sortedData = processedData.sort((a, b) => {
          if (a.dday === null) return 1;
          if (b.dday === null) return -1;
          return a.dday - b.dday;
        });

        setDevData(sortedData);
        setLoading(false);
      } catch (err) {
        console.error(
          "개발 중인 아이디어 데이터를 가져오는 중 오류 발생:",
          err
        );
        setError(`데이터 로딩 오류: ${err.message}`);
        setLoading(false);
      }
    };

    fetchDevData();
  }, []);

  // 아이디어 상세 페이지로 이동하는 함수
  const handleIdeaClick = (idea) => {
    if (!idea || !idea.idea_id) return;
    window.location.href = `/ideaboard/detail/${idea.idea_id}`;
  };

  return (
    <div className="devList">
      <div className="header">
        <p>개발진행 과제</p>
      </div>
      <div className="list">
        {loading ? (
          <div className="loading-container">
            <CircularProgress size={24} />
            <span>데이터를 불러오는 중...</span>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : devData.length === 0 ? (
          <p>현재 개발이 진행되는 과제가 없습니다.</p>
        ) : (
          <DataTable
            slug="dev"
            columns={columns}
            rows={devData}
            onRowClick={handleIdeaClick}
            pagination={false}
          />
        )}
      </div>
    </div>
  );
};

export default DevList;
