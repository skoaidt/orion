import "./productComponents.scss";
import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import SolutionBox from '../SolutionBox';
import { BsPencil } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { AuthContext } from '../../context/authContext';


const getRandomIds = (array, size) => {
  const randomValues = new Uint32Array(array.length); window.crypto.getRandomValues(randomValues);
  const indices = array.map((_, index) => index);

  const shuffledIndices = indices.sort((a, b) => {
    const randomA = randomValues[a] / 4294967295;
    const randomB = randomValues[b] / 4294967295;
    return randomA - randomB;
  });
  return shuffledIndices.slice(0, size).map(index => array[index].id);
}

export const ProductContent = ({ solutionData, productId, getDevelopers }) => {

  const navigate = useNavigate();
  const [getsolutions, setGetSolutions] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await axios.get('/api/solutions/getsolution');
        setGetSolutions(response.data);
      } catch (error) {
        console.error("solutions 가져올때 오류가 발생하였습니다:", error);
      }
    };
    fetchSolutions();
  }, []);

  const isAdmin = currentUser?.isAdmin;
  const userId = currentUser?.userId;
  const isAuthorized = isAdmin || solutionData.n_id === userId;

  const randomIds = getRandomIds(getsolutions, 3);
  const filteredData = getsolutions.filter(item => randomIds.includes(item.id));
  const developerData = getDevelopers && getDevelopers.find(
    developer => developer.n_id === solutionData.n_id
  );
  const handleEditClick = () => {
    navigate(`/product/${productId}/update`);
  };

  const DisplayStyledText = ({ htmlContent }) => {
    const cleanHTML = DOMPurify.sanitize(htmlContent);
    return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
  };

  const handleDevImageError = (e) => {
    e.target.src = process.env.PUBLIC_URL + "/image/icons/noavatar.png";
  };

  return (
    <div className="productContent">
      <div className="contentBox">
        <div className="container">
          <div className="innerBox">
            <div className="leftSide">
              <div className="gap-60"></div>
              <div className="titleBox">

                <div className="title">Product Description</div>
                {isAuthorized && (
                  <div className="edit" onClick={handleEditClick}>
                    <BsPencil></BsPencil>
                    <p>내용 수정하기</p>
                  </div>
                )}
              </div>
              <div className="desc">

                <div className="gap-20"></div>
                <div className="subTitleArea">
                  <div className="subTitleBox"></div>
                  <div className="subTitle">추진 방향</div>
                </div>
                <div className="itemBox">
                  <DisplayStyledText htmlContent={solutionData.direc} />
                </div>

                <div className="gap-20"></div>
                <div className="subTitleArea">
                  <div className="subTitleBox"></div>
                  <div className="subTitle">추진 내역</div>
                </div>
                <div className="itemBox">
                  <DisplayStyledText htmlContent={solutionData.target} />
                </div>

                <div className="gap-20"></div>
                <div className="subTitleArea">
                  <div className="subTitleBox"></div>
                  <div className="subTitle">기대 효과</div>
                </div>
                <div className="itemBox">
                  <DisplayStyledText htmlContent={solutionData.effect} />
                </div>

              </div>
            </div>

            <div className="rightSide">
              <div className="devDesc">
                <div className="developer">
                  {/* <img
                    src={developerData?.dev_img ?
                      `${process.env.PUBLIC_URL}${developerData.dev_img}` :
                      `${process.env.PUBLIC_URL}/image/developer/basic.jpg`}
                    className="devImg" alt="devImg"
                    onError={handleDevImageError}
                  /> */}
                  <img
                    src={`${process.env.PUBLIC_URL}${developerData?.dev_img}`}
                    className="devImg"
                    alt="devImg"
                    onError={handleDevImageError}
                  />
                  <div>
                    <span style={{ color: '#585858' }}>{solutionData.headquarters} </span>
                    <span style={{ color: '#1CA8DB' }}>{solutionData.team} </span>
                    <div className="devNm">{solutionData.name}</div>
                  </div>
                </div>

                <hr style={{ width: "70%" }} />

                <div className="langDesc">
                  <table>
                    <tbody>
                      <tr>
                        <td>개발 일자</td>
                        <td>{solutionData.reg_date}</td>
                      </tr>

                      <tr>
                        <td>Version</td>
                        <td>{solutionData.version}</td>
                      </tr>
                      <tr>
                        <td>최근 업데이트</td>
                        <td>{solutionData.reupdate}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>

                <div className="devIntro">
                  <div className="title">개발자 소개</div>
                  <div className="desc">
                    {developerData?.introduction}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="gap-60"></div>
      </div>

      <hr />

      <div className="randomBox">
        <div className="gap-60" />
        <div className="title">Other Solutions</div>
        <div className="solutionsContainer">
          {filteredData.map((item) => (
            <div className="solBox" key={item.id}>
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
      </div>

      <div className="gap-60"></div>
    </div>
  )
}

export default ProductContent;