import React, { useState } from "react";
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

const data1 = [
  { name: "전사개발", value: 400, color: "#5A6ACF" },
  { name: "협업개발", value: 300, color: "#8593ED" },
  { name: "자체개발", value: 300, color: "#C7CEFF" },
  { name: "기타", value: 200, color: "#b7b7b7" },
];

const data2 = [
  { name: "Access", value: 400, color: "#5A6ACF" },
  { name: "Infra설비", value: 300, color: "#4B5BBF" },
  { name: "전송", value: 300, color: "#8A9BFF" },
  { name: "AOC", value: 200, color: "#8593ED" },
  { name: "SO", value: 200, color: "#A6B3F0" },
  { name: "자산", value: 200, color: "#C2C9FF" },
  { name: "안전보건", value: 200, color: "#A6B3FF" },
  { name: "기업문화", value: 200, color: "#D9E0FF" },
];

const data3 = [
  { name: "품질", value: 400, color: "#5A6ACF" },
  { name: "고장", value: 300, color: "#4B5BBF" },
  { name: "RM", value: 300, color: "#8A9BFF" },
  { name: "시설", value: 200, color: "#8593ED" },
  { name: "CE", value: 200, color: "#A6B3F0" },
  { name: "사무", value: 200, color: "#C2C9FF" },
  { name: "Biz.", value: 200, color: "#A6B3FF" },
  { name: "기타", value: 200, color: "#D9E0FF" },
];

// 각 데이터셋의 총합 계산
const getTotal = (data) => data.reduce((sum, item) => sum + item.value, 0);

const CustomPieChart = ({ data, title }) => {
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

  // 커스텀 레전드 렌더러
  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    return (
      <span style={{ color, fontWeight: 500, fontSize: "12px" }}>{value}</span>
    );
  };

  return (
    <div className="pieBox">
      <h1>{title}</h1>
      <div className="chart">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={70}
              // fill="#8884d8"
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
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PieChartBox = () => {
  return (
    <div className="pieChartBox">
      <CustomPieChart data={data1} title="개발 유형" />
      <CustomPieChart data={data2} title="사업 유형" />
      <CustomPieChart data={data3} title="업무 분야" />
    </div>
  );
};

export default PieChartBox;
