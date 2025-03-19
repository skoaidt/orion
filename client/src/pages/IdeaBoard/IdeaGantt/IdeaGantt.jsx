import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ideaGantt.scss";

const IdeaGantt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ideaData, setIdeaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ganttData, setGanttData] = useState([]);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   // API가 준비된 후 주석을 해제하여 실제 데이터를 가져오는 로직

  //   // 아이디어 데이터를 가져오는 함수
  //   const fetchIdeaData = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       // 아이디어 상세 정보를 가져오는 API 호출
  //       const response = await axios.get(`/api/ideas/${id}`);
  //       setIdeaData(response.data);

  //       // 간트 차트 데이터 설정
  //       generateGanttData(response.data);
  //     } catch (error) {
  //       console.error("간트 차트 데이터 로딩 중 오류 발생:", error);
  //       // API 호출 실패 시 기본 데이터 사용
  //       generateGanttData(null);
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id) {
  //     fetchIdeaData();
  //   }

  //   // 개발 중 가상 데이터로 테스트하기 위한 함수 호출
  //   generateMockData();
  // }, [id]);

  // 가상 데이터를 생성하는 함수
  const generateMockData = useCallback(() => {
    try {
      setLoading(true);
      setError(null); // 오류 상태 초기화

      // 현재 날짜를 기준으로 가상 데이터 생성
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 10); // 10일 전 시작

      // 가상의 프로젝트 데이터
      const mockIdeaData = {
        id: id,
        title: "대형 사업자 관리 시스템",
        author: "전다현",
        team: "종로품질개선팀",
        category: "신규개발",
        startDate: startDate.toISOString().split("T")[0],
        status: "개발중",
      };

      // 가상의 간트 차트 데이터
      const tasks = [
        {
          id: 1,
          text: "요구사항 분석",
          start_date: startDate.toISOString().split("T")[0],
          duration: 3,
          progress: 1,
          color: "#32c832",
        },
        {
          id: 2,
          text: "설계",
          start_date: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          duration: 4,
          progress: 0.8,
          color: "#328bc8",
        },
        {
          id: 3,
          text: "개발",
          start_date: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          duration: 10,
          progress: 0.2,
          color: "#c87032",
        },
        {
          id: 4,
          text: "테스트",
          start_date: new Date(startDate.getTime() + 17 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          duration: 5,
          progress: 0,
          color: "#c83232",
        },
      ];

      setGanttData(tasks);
      setIdeaData(mockIdeaData);
      setLoading(false);
    } catch (error) {
      console.error("간트 차트 데이터 생성 중 오류:", error);
      setError(error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // 개발 중 가상 데이터로 테스트하기 위한 함수 호출
    generateMockData();
  }, [generateMockData]);

  const handleBackClick = () => {
    navigate(`/ideaboard/detail/${id}`);
  };

  // 간트 차트 렌더링 컴포넌트
  const renderGanttChart = () => {
    if (loading) {
      return <div className="loading">데이터 로딩 중...</div>;
    }

    if (error) {
      return (
        <div className="ganttError">
          <p>간트 차트를 불러오는 중 오류가 발생했습니다.</p>
          <p>오류 내용: {error.message}</p>
        </div>
      );
    }

    if (ganttData.length === 0) {
      return (
        <div className="noData">간트 차트에 표시할 데이터가 없습니다.</div>
      );
    }

    try {
      // 간트 차트 대신 사용할 간단한 UI
      return (
        <div className="simpleGantt">
          <div className="timeline-header">
            <div className="task-label">작업</div>
            <div className="timeline">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - 10 + i);
                return (
                  <div key={i} className="day">
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="timeline-body">
            {ganttData.map((task) => {
              const startDate = new Date(task.start_date);
              const startDay = startDate.getDate();
              const currentDate = new Date();
              currentDate.setDate(currentDate.getDate() - 10); // 시작일
              const diffDays = Math.floor(
                (startDate - currentDate) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={task.id} className="task-row">
                  <div className="task-label">{task.text}</div>
                  <div className="timeline">
                    <div
                      className="task-bar"
                      style={{
                        marginLeft: `${diffDays * 40}px`,
                        width: `${task.duration * 40}px`,
                        backgroundColor: task.color,
                      }}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: `${task.progress * 100}%`,
                          backgroundColor: `rgba(255, 255, 255, 0.3)`,
                        }}
                      />
                      <span className="task-text">{task.text}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } catch (renderError) {
      console.error("간트 차트 렌더링 중 오류:", renderError);
      return (
        <div className="ganttError">
          <p>간트 차트 렌더링 중 오류가 발생했습니다.</p>
          <p>오류 내용: {renderError.message}</p>
        </div>
      );
    }
  };

  // 안전하게 전체 컴포넌트 렌더링
  const renderSafeContent = () => {
    try {
      return (
        <>
          <div className="ganttInfo">
            {ideaData && (
              <div className="infoGrid">
                <div className="infoItem">
                  <span className="label">프로젝트 이름:</span>
                  <span className="value">
                    {ideaData.title || "대형 사업자 관리 시스템"}
                  </span>
                </div>
                <div className="infoItem">
                  <span className="label">담당자:</span>
                  <span className="value">{ideaData.author || "전다현"}</span>
                </div>
                <div className="infoItem">
                  <span className="label">팀:</span>
                  <span className="value">
                    {ideaData.team || "종로품질개선팀"}
                  </span>
                </div>
                <div className="infoItem">
                  <span className="label">카테고리:</span>
                  <span className="value">
                    {ideaData.category || "신규개발"}
                  </span>
                </div>
                <div className="infoItem">
                  <span className="label">상태:</span>
                  <span className="value">
                    {ideaData.status || "개발 진행중"}
                  </span>
                </div>
                <div className="infoItem">
                  <span className="label">시작일:</span>
                  <span className="value">
                    {ideaData.startDate
                      ? new Date(ideaData.startDate).toLocaleDateString("ko-KR")
                      : ""}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="ganttContainer">{renderGanttChart()}</div>
        </>
      );
    } catch (mainError) {
      console.error("전체 컴포넌트 렌더링 중 오류:", mainError);
      return (
        <div className="ganttError">
          <p>간트 차트 화면 렌더링 중 치명적인 오류가 발생했습니다.</p>
          <p>오류 내용: {mainError.message}</p>
          <button
            className="backButton"
            onClick={handleBackClick}
            style={{ marginTop: "20px" }}
          >
            돌아가기
          </button>
        </div>
      );
    }
  };

  return (
    <div className="ideaGantt">
      <div className="ganttHeader">
        <h2>프로젝트 개발 일정 (아이디어 ID: {id})</h2>
        <button className="backButton" onClick={handleBackClick}>
          돌아가기
        </button>
      </div>
      {renderSafeContent()}
    </div>
  );
};

export default IdeaGantt;
