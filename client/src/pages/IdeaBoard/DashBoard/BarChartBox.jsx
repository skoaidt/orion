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
  // 하드코딩된 조직별 현황 데이터 추가 (이름만 유지하고 카운트는 0으로 초기화)
  const organizationData = [
    { headqt: "강남", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "강북", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "인천", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "경기", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "전남", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "전북", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "경남", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "경북", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "충남", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "충북", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "강원", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "Access", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "안전보건", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "AOC", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "Infra설비", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "SO", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "전송", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "경영", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "사업지원", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "기업문화", regCnt: 0, devCnt: 0, compCnt: 0 },
    { headqt: "자산운영", regCnt: 0, devCnt: 0, compCnt: 0 },
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
  const [chartData, setChartData] = useState(organizationData);

  // 팀명 기준 치환 함수 - 특정 팀명을 본부로 매핑
  const normalizeTeam = (teamName) => {
    if (!teamName) return null;

    // 대소문자 구분 없이 처리하고 공백 제거
    const normalizedTeam = teamName.toLowerCase().replace(/\s+/g, "");

    // Access 관련 팀 처리
    if (teamName === "Access계획팀" || teamName === "Access기술팀") {
      console.log(`팀명 기준 치환: "${teamName}" -> Access 본부로 분류`);
      return "Access";
    }

    // 전송 관련 팀 처리
    if (teamName === "전송기술팀") {
      console.log(`팀명 기준 치환: "${teamName}" -> 전송 본부로 분류`);
      return "전송";
    }

    // Infra설비 관련 팀 처리
    if (teamName === "Infra설비기술팀") {
      console.log(`팀명 기준 치환: "${teamName}" -> Infra설비 본부로 분류`);
      return "Infra설비";
    }

    // 팀명 매핑이 없는 경우 null 반환 (본부명 처리로 넘어감)
    return null;
  };

  // 본부명 치환 함수 - 특정 본부명에 대해서만 'Access본부' 제거 및 기타 치환
  const normalizeHeadquarter = (headquarter) => {
    if (!headquarter) return "";

    // 대소문자 구분 없이 처리하고 공백 제거
    const normalizedHQ = headquarter.toLowerCase().replace(/\s+/g, "");

    console.log(`원본 본부명: "${headquarter}", 정규화: "${normalizedHQ}"`);

    // 특수 본부명 직접 매핑
    if (headquarter === "전송담당") {
      console.log(`특수 본부 처리: "${headquarter}" -> 전송 본부로 분류`);
      return "전송";
    }

    if (headquarter === "Infra설비담당") {
      console.log(`특수 본부 처리: "${headquarter}" -> Infra설비 본부로 분류`);
      return "Infra설비";
    }

    // 지역 본부 목록 (Access본부 제거 적용 대상)
    const regionalHeadquarters = [
      "강남",
      "강북",
      "인천",
      "경기",
      "경남",
      "경북",
      "전남",
      "전북",
      "충남",
      "충북",
      "강원",
    ];

    // 지역 본부에 대한 처리 (Access본부 제거)
    for (const region of regionalHeadquarters) {
      const regionLower = region.toLowerCase();
      if (
        normalizedHQ.includes(regionLower) &&
        (normalizedHQ.includes("access") || normalizedHQ.includes("본부"))
      ) {
        console.log(`본부명 치환 (지역): ${headquarter} -> ${region}`);
        return region;
      }
    }

    // 사용자 요청에 따른 특정 본부명 치환
    if (normalizedHQ.includes("사업지원담당")) {
      console.log(`본부명 치환 (사업지원): ${headquarter} -> 사업지원`);
      return "사업지원";
    }

    if (normalizedHQ.includes("기업문화담당")) {
      console.log(`본부명 치환 (기업문화): ${headquarter} -> 기업문화`);
      return "기업문화";
    }

    if (normalizedHQ.includes("자산운영담당")) {
      console.log(`본부명 치환 (자산운영): ${headquarter} -> 자산운영`);
      return "자산운영";
    }

    if (normalizedHQ.includes("경영지원본부")) {
      console.log(`본부명 치환 (경영): ${headquarter} -> 경영`);
      return "경영";
    }

    if (normalizedHQ.includes("so담당")) {
      console.log(`본부명 치환 (SO): ${headquarter} -> SO`);
      return "SO";
    }

    if (normalizedHQ.includes("aoc담당")) {
      console.log(`본부명 치환 (AOC): ${headquarter} -> AOC`);
      return "AOC";
    }

    if (normalizedHQ.includes("안전보건담당")) {
      console.log(`본부명 치환 (안전보건): ${headquarter} -> 안전보건`);
      return "안전보건";
    }
  };

  // 상태를 카테고리별로 분류하는 함수
  const categorizeStatus = (status) => {
    if (!status) return "";

    status = status.toLowerCase().trim();

    if (
      status === "등록" ||
      status === "선정" ||
      status === "pilot" ||
      status === "검증" ||
      status === "개발심의"
    ) {
      return "reg";
    } else if (status === "개발중" || status === "developing") {
      return "dev";
    } else if (
      status === "완료" ||
      status === "completed" ||
      status === "개발완료" ||
      status === "developmentcompleted"
    ) {
      return "comp";
    }

    console.log(`미분류 상태: ${status}`);
    return "";
  };

  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        setLoading(true);

        // 아이디어 목록 가져오기
        const response = await axios.get("/api/ideas");
        console.log(`아이디어 데이터 수: ${response.data.length}`);

        // API 응답 구조 확인을 위한 샘플 데이터 로그
        if (response.data.length > 0) {
          console.log("아이디어 데이터 샘플:", response.data[0]);
        }

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

        // 조직별 현황 카운트를 위한 객체 초기화
        const orgCounts = {};
        organizationData.forEach((org) => {
          orgCounts[org.headqt] = { regCnt: 0, devCnt: 0, compCnt: 0 };
        });

        // 매핑되지 않은 본부 추적
        const unmappedHeadquarters = new Set();

        // 아이디어 데이터 처리
        response.data.forEach((idea) => {
          // 상태에 따른 프로세스 카운트 증가
          const status = idea.status ? idea.status.toLowerCase().trim() : "";

          // 본부/팀 정보 처리
          let normalizedHeadqt = "";
          const teamName = idea.dept_name || "";
          const originalHeadqt = idea.prnt_dept_name || idea.headquarter || "";

          // 1. 먼저 팀명 기준으로 매핑 시도
          const teamBasedHeadqt = normalizeTeam(teamName);

          // 2. 팀명 매핑이 있으면 사용, 없으면 본부명 기준으로 매핑
          normalizedHeadqt =
            teamBasedHeadqt || normalizeHeadquarter(originalHeadqt);

          // 본부명이 매핑 테이블에 없는 경우 추적
          if (normalizedHeadqt && !orgCounts[normalizedHeadqt]) {
            unmappedHeadquarters.add(originalHeadqt);
          }

          // 상태에 따른 프로세스 카운트 증가
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

          // 조직별 현황 카운트 증가 (상태 카테고리별로 분류)
          if (normalizedHeadqt && orgCounts[normalizedHeadqt]) {
            const category = categorizeStatus(status);

            if (category === "reg") {
              orgCounts[normalizedHeadqt].regCnt++;
            } else if (category === "dev") {
              orgCounts[normalizedHeadqt].devCnt++;
            } else if (category === "comp") {
              orgCounts[normalizedHeadqt].compCnt++;
            }
          }
        });

        // 매핑되지 않은 본부명 로그
        if (unmappedHeadquarters.size > 0) {
          console.log(
            "매핑되지 않은 본부명들:",
            Array.from(unmappedHeadquarters)
          );
        }

        // 조직별 카운트 합계 로그 - 어떤 본부에 데이터가 있는지 확인
        Object.entries(orgCounts).forEach(([headqt, counts]) => {
          const total = counts.regCnt + counts.devCnt + counts.compCnt;
          console.log(
            `${headqt}: 등록=${counts.regCnt}, 개발중=${counts.devCnt}, 완료=${counts.compCnt}, 합계=${total}`
          );
        });

        // 프로세스 데이터 설정
        setProcessData(processCounts);

        // 조직별 차트 데이터 업데이트
        const updatedChartData = organizationData.map((org) => {
          const counts = orgCounts[org.headqt] || {
            regCnt: 0,
            devCnt: 0,
            compCnt: 0,
          };
          return {
            headqt: org.headqt,
            regCnt: counts.regCnt,
            devCnt: counts.devCnt,
            compCnt: counts.compCnt,
          };
        });

        setChartData(updatedChartData);
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
            <div className="box devBox">
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
            data={loading ? organizationData : chartData}
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
