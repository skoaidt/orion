import React, { useState, useEffect } from "react";
import SolutionBox from "../SolutionBox";
import { Link } from "react-router-dom";
import { BsFillStarFill } from "react-icons/bs";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import "./main.scss";

export const MainRecommend = ({ solutionData, getDevelopers }) => {
  //최근 등록된 Solutions
  const [latestSolutions, setLatestSolutions] = useState([]);
  useEffect(() => {
    const sortedSolutions = solutionData.sort(
      (a, b) => new Date(b.reg_date) - new Date(a.reg_date)
    );
    setLatestSolutions(sortedSolutions.slice(0, 4));
  }, [solutionData]);

  // console.log("soltuiondata: ", solutionData);

  // 좋아요 등록수 많은 Solutions
  const [topLikedSolutions, setTopLikedSolutions] = useState([]);
  useEffect(() => {
    const fetchTopLikedSolutions = async () => {
      try {
        const response = await axios.get("/api/solutions/getTopLikedSolutions");
        setTopLikedSolutions(response.data);
      } catch (error) {
        console.error("Error fetching top liked solutions:", error);
      }
    };

    fetchTopLikedSolutions();
  }, []);

  //랜덤으로 개발자 소개 (3명)
  const [randomDevelopers, setRandomDevelopers] = useState([]);
  const [expandedStates, setExpandedStates] = useState({});

  // 랜덤 개발자 목록 생성 함수
  const generateRandomDevelopers = (developers, size) => {
    const randomValues = new Uint32Array(developers.length);
    window.crypto.getRandomValues(randomValues);
    const shuffled = developers.sort((a, b) => {
      const randomA = randomValues[developers.indexOf(a)] / 4294967295;
      const randomB = randomValues[developers.indexOf(b)] / 4294967295;
      return randomA - randomB;
    });
    return shuffled.slice(0, size);
  };

  // 초기 랜덤 개발자 목록 설정
  useEffect(() => {
    const randomDevs = generateRandomDevelopers(getDevelopers, 3);
    setRandomDevelopers(randomDevs);
    // 초기화시 모든 개발자의 "더보기/접기" 상태를 false로 설정
    const initialStates = randomDevs.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: false }),
      {}
    );
    setExpandedStates(initialStates);
  }, [getDevelopers]);
  // "더보기/접기" 상태 토글 함수
  const toggleExpand = (id) => {
    setExpandedStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDevImageError = (e) => {
    e.target.src = process.env.PUBLIC_URL + "/image/icons/noavatar.png";
  };

  return (
    <div className="mainRecommend">
      <div className="gap-100" />

      <div className="titleText">
        <span>&#127775;</span> 따끈따끈 <b>새로운 Solutions</b>
      </div>
      <div className="subText">새로운 AI/DT Solution를 공유합니다.</div>

      <div className="newBox">
        <div className="leftSide">
          <div className="circleImg">
            <img
              className="animation-updown"
              src={process.env.PUBLIC_URL + "/image/main/circle_01.png"}
              alt="circle_01"
            />
          </div>
          <p className="text">
            새로운 AI/DT Solution을 <br></br> 만나보세요.
          </p>
          <p className="subText">
            The Best AI/DT Solution and System have arrived.
          </p>
        </div>
        <div className="rightSide">
          <div className="solutionsContainer">
            <div className="solutionsRow">
              {latestSolutions.slice(0, 2).map((solution) => (
                <div className="solutionColumn" key={solution.id}>
                  <SolutionBox
                    key={solution.id}
                    id={solution.id}
                    solName={solution.sol_name}
                    solFullName={solution.sol_full_name}
                    korName={solution.kor_name}
                    url={solution.url}
                    img={solution.img}
                  />
                </div>
              ))}
            </div>
            <div className="solutionsRow">
              {latestSolutions.slice(2, 4).map((solution) => (
                <div className="solutionColumn" key={solution.id}>
                  <SolutionBox
                    key={solution.id}
                    id={solution.id}
                    solName={solution.sol_name}
                    solFullName={solution.sol_full_name}
                    korName={solution.kor_name}
                    url={solution.url}
                    img={solution.img}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="gap-60"></div>

      <div className="mainBanner">
        <div className="left">
          <p className="text">Creative AI/DT Solution Courses</p>
          <p className="subText">
            ‘24년 새로운 AI/DT Solution 및 과제를 소개합니다.
          </p>
        </div>
        <div className="right">
          <p className="subText">
            {" "}
            No. 1 기술전문회사로 도약하기 위해서 우리의 본업인 현장 경쟁력
            강화를 위해 AI/DT전문가 양성하였습니다. <br></br>
            우리 회사 IT 전문가들의 잠재능력을 유감없이 보여주는 여러가지 사례와
            과제들을 확인해보세요.
          </p>
          <button type="button" className="bannerBtn">
            <Link to="/portfolio" className="text">
              See More
            </Link>
          </button>
        </div>
      </div>

      <div className="gap-60"></div>

      <div className="titleText">
        <span role="img" aria-label="fire">
          &#128293;{" "}
        </span>
        화제의 인기 <b>Solutions</b>
      </div>
      <div className="subText">인기가 있고, 사용률이 높은 Solution입니다.</div>

      <div className="popularBox">
        <div className="leftSide">
          <div className="solutionsContainer">
            <div className="solutionsRow">
              {topLikedSolutions.slice(0, 2).map((solution) => (
                <div className="solutionColumn" key={solution.id}>
                  <SolutionBox
                    key={solution.id}
                    id={solution.id}
                    solName={solution.sol_name}
                    solFullName={solution.sol_full_name}
                    korName={solution.kor_name}
                    url={solution.url}
                    img={solution.img}
                  />
                </div>
              ))}
            </div>
            <div className="solutionsRow">
              {topLikedSolutions.slice(2, 4).map((solution) => (
                <div className="solutionColumn" key={solution.id}>
                  <SolutionBox
                    key={solution.id}
                    id={solution.id}
                    solName={solution.sol_name}
                    solFullName={solution.sol_full_name}
                    korName={solution.kor_name}
                    url={solution.url}
                    img={solution.img}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rightSide">
          <div className="circleImg">
            <img
              className="animation-updown"
              src={process.env.PUBLIC_URL + "/image/main/circle_02.png"}
              alt="circle_01"
            />
          </div>
          <p className="text">
            인기있는 AI/DT Solution을 <br></br> 만나보세요.
          </p>
          <p className="subText">The Best Solutions and System have arrived.</p>
        </div>
      </div>

      <div className="gap-60"></div>

      <div className="joinUsBox">
        <div className="leftSide">
          {[...Array(5)].map((_, index) => (
            <BsFillStarFill
              key={index}
              style={{ color: "#EFC42D", margin: "2px" }}
            />
          ))}
          <p className="title">AI/DT 개발자를 소개합니다.</p>
          <p>
            SK오앤에스는{" "}
            <span style={{ color: "#f06292" }}>{getDevelopers?.length}</span>
            명의 AI/DT 전문가 팀과 함께 성장하며, 현장 업무를 혁신하는 다양한
            아이디어를 발굴하여 새로운 비전과 가치를 추구하고 있습니다. 우리는
            기술의 힘으로 업무 방식을 개선하고, 더 나은 미래를 설계하는 데
            중점을 두고 있습니다. AI/DT 전문가의 도움이 필요한 순간, 언제든지
            저희에게 연락해 주세요. 우리는 여러분의 도전을 지원하고, 함께 성장해
            나가기 위해 여기 있습니다.
          </p>
        </div>
        <div className="rightSide">
          {randomDevelopers.map((developer) => (
            <Box className="devBox" key={developer.id}>
              <img
                // src={`${process.env.PUBLIC_URL}/image/developer/${developer.n_id}.jpg`}
                src={process.env.PUBLIC_URL + developer.dev_img}
                className="personCircle"
                alt="developer_img"
                onError={handleDevImageError}
              />
              <Typography variant="body2" component="p">
                {expandedStates[developer.id]
                  ? developer.introduction
                  : `${developer.introduction.substring(0, 150)}...`}
              </Typography>
              <Button onClick={() => toggleExpand(developer.id)}>
                {expandedStates[developer.id] ? "접기" : "더 보기"}
              </Button>
              <Typography variant="subtitle1" component="p" className="name">
                {developer.name}
              </Typography>
              <Typography variant="subtitle1" component="p" className="team">
                {developer.team}
              </Typography>
            </Box>
          ))}
        </div>
      </div>

      <div className="gap-100"></div>
    </div>
  );
};

export default MainRecommend;
