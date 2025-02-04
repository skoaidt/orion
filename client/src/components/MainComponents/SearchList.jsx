import React, { useEffect, useState } from 'react'
import SolutionBox from '../SolutionBox';
import "./main.scss";


export const SearchList = ({ searchResults }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(searchResults.length);
  }, [searchResults]);

  return (
    <div className="searchlist">
      <div className="gap-100" />

      <div className="titleText">검색 결과 : {count}개가 검색되었습니다.</div>
      {searchResults.length > 0 ? (
        <div className="solutionsContainer">
          {searchResults.map((item) => (
            <div key={item.id} >
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
      ) : (
        <div className="noResults">
          검색된 결과가 없습니다. 다시 검색을 해보세요.
        </div>
      )}
      <div className="gap-60" />
    </div>
  )
}

export default SearchList;
