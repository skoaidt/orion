import React, { useEffect, useState } from 'react'
import SolutionBox from '../SolutionBox';
import "./main.scss";


export const AllSolution = ({ solutionData }) => {

  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(solutionData.length);
  }, [solutionData]);


  return (
    <div className="allSolution">
      <div className="gap-100" />
      <div className="titleText">Solution List</div>
      <div className="subText">모든 AI/DT Solution의 목록은 {count}개 입니다.</div>
      <div className="gap-20" />
      <div className="solutionsContainer">
        {solutionData.map((item) => (
          <div key={item.id}>
            <SolutionBox
              key={item.id}
              id={item.id}
              solName={item.sol_name}
              solFullName={item.sol_full_name}
              korName={item.kor_name}
              url={item.url}
              img={item.img}
            />
          </div>
        ))}
      </div>
      <div className="gap-60" />
    </div>
  )
}

export default AllSolution;
