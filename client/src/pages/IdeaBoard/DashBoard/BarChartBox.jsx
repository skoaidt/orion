import React from "react";
import "./barChartBox.scss";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { barChartData } from "./data";

const BarChartBox = () => {
  return (
    <div className="barChartBox">
      <div className="processBox">
        <h1>프로세스 진행 현황</h1>
        <div className="boxwrap">
          <div className="box regBox">
            <div className="title">등록</div>
            <div className="cnt">123</div>
          </div>
          <div className="box devBox">
            <div className="title">선정</div>
            <div className="cnt">245</div>
          </div>
          <div className="box devBox">
            <div className="title">Pilot</div>
            <div className="cnt">198</div>
          </div>
          <div className="box devBox">
            <div className="title">검증</div>
            <div className="cnt">312</div>
          </div>
          <div className="box devBox">
            <div className="title">개발심의</div>
            <div className="cnt">87</div>
          </div>
          <div className="box devBox">
            <div className="title">개발</div>
            <div className="cnt">256</div>
          </div>
          <div className="box compBox">
            <div className="title">완료</div>
            <div className="cnt">175</div>
          </div>
        </div>
      </div>
      <hr style={{ margin: "20px 0" }} />
      <div className="chartBox">
        <h1>조직별 현황</h1>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={barChartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid stroke="none" />
            <XAxis
              dataKey="headqt"
              angle={-90}
              height={60}
              textAnchor="end"
              tickMargin={5}
            />
            <YAxis hide={true} />
            <Tooltip
              formatter={(value, name) => {
                const labels = {
                  regCnt: "등록",
                  devCnt: "개발중",
                  compCnt: "완료",
                };
                return [value, labels[name] || name];
              }}
            />
            <Legend
              formatter={(value) => {
                const labels = {
                  regCnt: "등록",
                  devCnt: "개발중",
                  compCnt: "완료",
                };
                return labels[value] || value;
              }}
            />
            <Bar dataKey="regCnt" stackId="a" fill="#5a5a5a" name="등록" />
            <Bar dataKey="devCnt" stackId="a" fill="#989ef0" name="개발중" />
            <Bar dataKey="compCnt" stackId="a" fill="#493d9e" name="완료" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartBox;
