import React, { useState, useEffect } from "react";
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
// 외부 데이터 import 제거
// import { barChartData } from "./data";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const BarChartBox = () => {
  // 하드코딩된 조직별 현황 데이터 추가
  const organizationData = [
    { headqt: "강남", regCnt: 150, devCnt: 200, compCnt: 300 },
    { headqt: "강북", regCnt: 180, devCnt: 220, compCnt: 350 },
    { headqt: "인천", regCnt: 170, devCnt: 190, compCnt: 280 },
    { headqt: "경기", regCnt: 200, devCnt: 250, compCnt: 400 },
    { headqt: "전남", regCnt: 160, devCnt: 210, compCnt: 300 },
    { headqt: "전북", regCnt: 140, devCnt: 180, compCnt: 270 },
    { headqt: "경남", regCnt: 130, devCnt: 160, compCnt: 240 },
    { headqt: "경북", regCnt: 190, devCnt: 230, compCnt: 360 },
    { headqt: "충남", regCnt: 120, devCnt: 150, compCnt: 250 },
    { headqt: "충북", regCnt: 110, devCnt: 140, compCnt: 230 },
    { headqt: "강원", regCnt: 160, devCnt: 200, compCnt: 310 },
    { headqt: "Access", regCnt: 140, devCnt: 170, compCnt: 260 },
    { headqt: "안전보건", regCnt: 170, devCnt: 210, compCnt: 320 },
    { headqt: "AOC", regCnt: 180, devCnt: 220, compCnt: 330 },
    { headqt: "Infra설비", regCnt: 190, devCnt: 240, compCnt: 340 },
    { headqt: "SO", regCnt: 150, devCnt: 180, compCnt: 290 },
    { headqt: "전송", regCnt: 160, devCnt: 200, compCnt: 310 },
    { headqt: "경영", regCnt: 130, devCnt: 160, compCnt: 240 },
    { headqt: "사업지원", regCnt: 130, devCnt: 160, compCnt: 240 },
    { headqt: "기업문화", regCnt: 130, devCnt: 160, compCnt: 240 },
    { headqt: "자산", regCnt: 130, devCnt: 160, compCnt: 240 },
  ];

  const [processData, setProcessData] = useState({
    등록: 0,
    선정: 0,
    pilot: 0,
    검증: 0,
    개발심의: 0,
    개발중: 0,
    완료: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        setLoading(true);

        // 아이디어 목록 가져오기
        const response = await axios.get("/api/ideas");

        // 프로세스 별 카운트 계산
        const processCounts = {
          등록: 0,
          선정: 0,
          pilot: 0,
          검증: 0,
          개발심의: 0,
          개발중: 0,
          완료: 0,
        };

        // 아이디어 데이터 처리
        response.data.forEach((idea) => {
          // 상태에 따른 프로세스 카운트 증가
          const status = idea.status ? idea.status.toLowerCase() : "";

          if (status === "등록") processCounts.등록++;
          else if (status === "선정") processCounts.선정++;
          else if (status === "pilot") processCounts.pilot++;
          else if (status === "검증") processCounts.검증++;
          else if (status === "개발심의") processCounts.개발심의++;
          else if (status === "개발중" || status === "developing")
            processCounts.개발중++;
          else if (
            status === "완료" ||
            status === "completed" ||
            status === "개발완료" ||
            status === "developmentcompleted"
          )
            processCounts.완료++;
        });

        // 프로세스 데이터 설정
        setProcessData(processCounts);
        setLoading(false);
      } catch (err) {
        console.error("프로세스 데이터를 가져오는 중 오류 발생:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProcessData();
  }, []);

  // 숫자 포맷팅 함수 (천 단위 콤마)
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="barChartBox">
      <div className="processBox">
        <h1>프로세스 진행 현황</h1>
        {loading ? (
          <div className="loading-container">
            <CircularProgress size={24} />
            <span>데이터를 불러오는 중...</span>
          </div>
        ) : error ? (
          <div className="error-message">
            데이터를 불러오는 중 오류가 발생했습니다: {error}
          </div>
        ) : (
          <div className="boxwrap">
            <div className="box regBox">
              <div className="title">등록</div>
              <div className="cnt">{formatNumber(processData.등록)}</div>
            </div>
            <div className="box devBox">
              <div className="title">선정</div>
              <div className="cnt">{formatNumber(processData.선정)}</div>
            </div>
            <div className="box devBox">
              <div className="title">Pilot</div>
              <div className="cnt">{formatNumber(processData.pilot)}</div>
            </div>
            <div className="box devBox">
              <div className="title">검증</div>
              <div className="cnt">{formatNumber(processData.검증)}</div>
            </div>
            <div className="box devBox">
              <div className="title">개발심의</div>
              <div className="cnt">{formatNumber(processData.개발심의)}</div>
            </div>
            <div className="box devBox">
              <div className="title">개발중</div>
              <div className="cnt">{formatNumber(processData.개발중)}</div>
            </div>
            <div className="box compBox">
              <div className="title">완료</div>
              <div className="cnt">{formatNumber(processData.완료)}</div>
            </div>
          </div>
        )}
      </div>
      <hr style={{ margin: "20px 0" }} />
      <div className="chartBox">
        <h1>조직별 현황</h1>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={organizationData}
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
