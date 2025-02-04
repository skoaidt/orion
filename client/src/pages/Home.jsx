import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import MainContents from "../components/MainComponents/MainContents";
import MiddleNavBar from "../components/MainComponents/MiddleNavBar";
import MainRecommend from "../components/MainComponents/MainRecommend";
import SearchList from "../components/MainComponents/SearchList";
import AllSolution from '../components/MainComponents/AllSolution';
import WorkField from '../components/MainComponents/WorkField';

// import developerData from '../json/developerdata.json';

export const Home = ({ getDevelopers }) => {

  // console.log("Home에서 보는 getDevelopers : ", getDevelopers);

  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (results) => {
    setSearchResults(results);
    navigate("/search");
  };

  ////////////////////////
  // Solution 불러오기 선언구간
  const [getsolutions, setGetSolutions] = useState([]);
  const fetchSolutions = async () => {
    try {
      const response = await axios.get('/api/solutions/getsolution');
      const sortedSolutions = response.data.sort((a, b) => a.id - b.id);
      setGetSolutions(sortedSolutions);
    } catch (error) {
      console.error("solutions 가져올때 오류가 발생하였습니다:", error);
    }
  };
  useEffect(() => {
    fetchSolutions();
  }, []);
  // console.log("Home에서 보는 getsolutions : ", getsolutions);

  ////////////////////////

  ////////////////////////
  // WorkFld 기준으로 불러오기
  const [workFlSols, setWorkFlSols] = useState([]);
  const work_field = useLocation().search
  useEffect(() => {
    const fetchWorkSol = async () => {
      try {
        const response = await axios.get(`/api/solutions/getWorkfld/${work_field}`);
        setWorkFlSols(response.data);
      } catch (error) {
        console.error("solutions 가져올때 오류가 발생하였습니다:", error);
      }
    };
    fetchWorkSol();
  }, [work_field]);
  ////////////////////////

  return (
    <div className="home">
      <MainContents solutionData={getsolutions} onSearch={handleSearch} />
      <MiddleNavBar />
      <Routes>
        <Route path="/" element={<MainRecommend solutionData={getsolutions} getDevelopers={getDevelopers} />} />
        <Route path="/search" element={<SearchList searchResults={searchResults} />} />
        <Route path="/all" element={<AllSolution solutionData={getsolutions} />} />
        <Route path="/workfield" element={<WorkField solutionData={workFlSols} />} />

      </Routes>
    </div>
  )
}
export default Home;