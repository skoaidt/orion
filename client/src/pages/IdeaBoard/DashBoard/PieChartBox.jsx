import React, { useState, useEffect } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  // Sector,
} from "recharts";
import "./pieChartBox.scss";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

// 색상 팔레트 정의 (기존 색상 사용)
const colors = {
  primary: [
    "#5A6ACF",
    "#8A9BFF",
    "#4B5BBF",
    "#8593ED",
    "#A6B3F0",
    "#C2C9FF",
    "#A6B3FF",
    "#D9E0FF",
  ],
  secondary: ["#C7CEFF", "#b7b7b7", "#9BA3DE", "#7781D2"],
};

// IdeaRegister.jsx에서 가져온 정적 범례 데이터
const allLegendItems = {
  // 개발 유형 범례
  devType: ["신규개발", "고도화", "내재화"],

  // 사업 유형 범례
  bizType: [
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

  // 업무 분야 범례
  workField: [
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
};

// 각 데이터셋의 총합 계산
const getTotal = (data) => data.reduce((sum, item) => sum + item.value, 0);

const CustomPieChart = ({ data, title, loading, allItems = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = getTotal(data);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="custom-tooltip">
          <p className="label">{`${data.name} : ${data.value}`}</p>
          <p className="percent">{`(${((data.value / total) * 100).toFixed(
            0
          )}%)`}</p>
        </div>
      );
    }
    return null;
  };

  // 커스텀 레전드 렌더러 - 데이터가 없는 항목은 회색으로 표시
  const renderColorfulLegendText = (value, entry) => {
    // 실제 데이터 항목에 있는지 확인
    const isActive = data.some((item) => item.name === value);
    const textColor = isActive ? entry.color : "#aaaaaa";

    return (
      <span style={{ color: textColor, fontWeight: 500, fontSize: "12px" }}>
        {value}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="pieBox">
        <h1>{title}</h1>
        <div className="chart loading-container">
          <CircularProgress size={24} />
        </div>
      </div>
    );
  }

  // 모든 범례 항목을 포함하는 데이터 생성
  // 실제 데이터에 있는 항목은 그대로 사용, 없는 항목은 값이 0인 항목으로 추가
  const dataWithAllItems = allItems.map((item) => {
    const existingData = data.find((d) => d.name === item);
    if (existingData) {
      return existingData;
    }
    // 데이터가 없는 항목은 값이 0인 항목으로 추가
    return {
      name: item,
      value: 0,
      color: "#aaaaaa", // 회색으로 표시
      isEmpty: true, // 비어있는 항목 표시
    };
  });

  return (
    <div className="pieBox">
      <h1>{title}</h1>
      <div className="chart">
        {data.length === 0 ? (
          <div className="no-data-message">데이터가 없습니다</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data} // 차트에는 실제 데이터만 표시
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                onMouseEnter={onPieEnter}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={index === activeIndex ? "#8884d8" : "none"}
                    strokeWidth={index === activeIndex ? 3 : 0}
                  />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={renderColorfulLegendText}
                iconSize={10}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                payload={allItems.map((item) => {
                  const existingData = data.find((d) => d.name === item);
                  return {
                    value: item,
                    color: existingData ? existingData.color : "#cccccc",
                    type: "circle",
                    id: item,
                  };
                })}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const PieChartBox = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    devType: [], // 개발 유형
    bizType: [], // 사업 유형
    workField: [], // 업무 분야
  });

  useEffect(() => {
    const fetchIdeaData = async () => {
      try {
        setLoading(true);

        // IdeaTable.jsx와 동일한 API 호출
        const response = await axios.get("/api/ideas");

        // Status가 'Drop'인 아이디어를 제외한 모든 데이터 필터링
        const filteredIdeas = response.data.filter(
          (idea) => idea.status !== "Drop" && idea.status !== "drop"
        );

        // 개발 유형별 집계 (project_type 또는 dev_category)
        const devTypeCounts = {};
        filteredIdeas.forEach((idea) => {
          const type = idea.project_type || idea.dev_category || "기타";
          devTypeCounts[type] = (devTypeCounts[type] || 0) + 1;
        });

        // 사업 유형별 집계 (business_field 또는 biz_category)
        const bizTypeCounts = {};
        filteredIdeas.forEach((idea) => {
          const type = idea.business_field || idea.biz_category || "기타";
          bizTypeCounts[type] = (bizTypeCounts[type] || 0) + 1;
        });

        // 업무 분야별 집계 (job_field 또는 workfl_category)
        const workFieldCounts = {};
        filteredIdeas.forEach((idea) => {
          const field = idea.job_field || idea.workfl_category || "기타";
          workFieldCounts[field] = (workFieldCounts[field] || 0) + 1;
        });

        // 차트 데이터 형식으로 변환 (빈 값 제외)
        const devTypeData = Object.entries(devTypeCounts)
          .filter(([key]) => key && key !== "선택" && key !== "-")
          .map(([name, value], index) => ({
            name,
            value,
            color: colors.primary[index % colors.primary.length],
          }));

        const bizTypeData = Object.entries(bizTypeCounts)
          .filter(([key]) => key && key !== "선택" && key !== "-")
          .map(([name, value], index) => ({
            name,
            value,
            color: colors.primary[index % colors.primary.length],
          }));

        const workFieldData = Object.entries(workFieldCounts)
          .filter(([key]) => key && key !== "선택" && key !== "-")
          .map(([name, value], index) => ({
            name,
            value,
            color: colors.primary[index % colors.primary.length],
          }));

        setChartData({
          devType: devTypeData,
          bizType: bizTypeData,
          workField: workFieldData,
        });

        setLoading(false);
      } catch (err) {
        console.error("아이디어 데이터를 가져오는 중 오류 발생:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchIdeaData();
  }, []);

  if (error) {
    return (
      <div className="pieChartBox">
        <div className="error-message">
          데이터를 불러오는 중 오류가 발생했습니다: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pieChartBox">
      <CustomPieChart
        data={chartData.devType}
        title="개발 유형"
        loading={loading}
        allItems={allLegendItems.devType}
      />
      <CustomPieChart
        data={chartData.bizType}
        title="사업 유형"
        loading={loading}
        allItems={allLegendItems.bizType}
      />
      <CustomPieChart
        data={chartData.workField}
        title="업무 분야"
        loading={loading}
        allItems={allLegendItems.workField}
      />
    </div>
  );
};

export default PieChartBox;
