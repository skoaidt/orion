import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import ProductContent from '../components/ProductComponents/ProductContent';
import ProductReviews from '../components/ProductComponents/ProductReviews';
import ProductUpdate from '../components/ProductComponents/ProductUpdate';
import ProductPncr from '../components/ProductComponents/ProductPncr.jsx';
import Detail from '../components/ProductComponents/Detail/Detail.jsx';
import { Button, IconButton } from '@mui/material';
import { pink } from '@mui/material/colors';
import { BsFillStarFill } from 'react-icons/bs';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { AuthContext } from '../context/authContext.js';
import { format } from 'date-fns';

export const Product = ({ getDevelopers }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reviewCnt, setReviewCnt] = useState([]);
  const { productId } = useParams();

  // 좋아요 수 가져오기와 업데이트 하기 
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // selectedRow 추가
  // const [completeStatus, setCompleteStatus] = useState(0); // completeStatus 추가
  // const [isAuthorized, setIsAuthorized] = useState(false); // isAuthorized 추가

  const fetchLikeCount = useCallback(async () => {
    try {
      const response = await axios.get(`/api/solutions/getSolutionLikes?sol_id=${productId}`);
      // console.log("Response from getSolutionLikes:", response.data); // 디버그를 위해 추가
      // console.log("Like count:", response.data.likeCnt); // likeCnt 값을 로그로 출력
      setLikeCount(response.data.likeCnt);
    } catch (error) {
      console.error("fetchLikeCount 좋아요 수 가져오기 실패: ", error);
    }
  }, [productId]);

  const fetchLikes = useCallback(async () => {
    try {
      const userLikeResponse = await axios.get(`/api/solutions/solutionlike/check`,
        { params: { sol_id: productId, n_id: currentUser.userId } });
      setLiked(userLikeResponse.data.liked);
    } catch (error) {
      console.error("fetchLikes 좋아요 등록 여부: ", error);
    }
  }, [productId, currentUser.userId]);

  useEffect(() => {
    fetchLikeCount();
    fetchLikes();
  }, [fetchLikeCount, fetchLikes]);

  const handleLike = async () => {
    if (!liked) {
      const logData = {
        sol_id: productId,
        n_id: currentUser.userId,
        n_name: currentUser.name,
        team: currentUser.deptName,
        headqt: currentUser.prntDeptName,
        date: format(new Date(), 'yyyy-MM-dd HH:mm'),
        category: 'like',
      };

      try {
        await axios.post('/api/solutions/solutionlike', logData);
        setLiked(true);
        await fetchLikeCount();  // 최신 좋아요 수를 가져와서 상태를 업데이트
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.error('Error logging like:', error);
        }
      }
    }
    else {
      alert("이미 좋아요를 누르셨습니다.");
    }
  };

  ////////////////////////
  // Product ID 기준 불러오기
  const [product, getProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/solutions/getsolution/${productId}`);
        getProduct(response.data[0]);
      } catch (error) {
        console.error("solutions 가져올때 오류가 발생하였습니다:", error);
      }
    };
    fetchProduct();

  }, [productId]);
  ////////////////////////

  const goToReviews = () => {
    navigate(`/product/${productId}/reviews`);
  };
  const goToSolution = () => {
    navigate(`/product/${productId}`);
  };
  const goToPNCR = () => {
    navigate(`/product/${productId}/pncr`);
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/api/reviews/getreview?sol_id=${productId}`);
        setReviewCnt(response.data);
      } catch (error) {
        console.error("댓글 가져올때 오류가 발생했습니다.", error);
      };
    };
    fetchReview();
  }, [productId]);

  // 좋아요 저장하는 구간
  const handleLinkClick = async (e, url) => {
    e.preventDefault();

    if (url) {
      if (currentUser) {
        const logData = {
          sol_id: productId,
          n_id: currentUser.userId,
          n_name: currentUser.name,
          team: currentUser.deptName,
          headqt: currentUser.prntDeptName,
          date: format(new Date(), 'yyyy-MM-dd HH:mm'),
          category: 'connect',
        };

        try {
          await axios.post('/api/solutions/solutionlike', logData);
        } catch (error) {
          console.error('Error logging connection:', error);
        }
      }

      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert("등록된 URL이 없습니다.");
    }
  };

  const goToDetail = (row) => {
    setSelectedRow(row);
    navigate(`/product/${productId}/pncrdetail/${row.id}`);
  };

  const handleImageError = (e) => {
    e.target.src = process.env.PUBLIC_URL + "/image/error/noimage.png";
  };

  return (
    <div className="product" >
      <div className="mainBox">
        <div className="mainBg">
          <div className="innerContainer">
            <div className="leftSide">
              <div className="imgBox">
                {product && product.img && (
                  <img src={process.env.PUBLIC_URL + product.img} alt="newsolution-box"
                    onError={handleImageError}
                  />
                )}
              </div>
              <div className="btnList">
                <Button
                  className="systemBtn"
                  onClick={(e) => handleLinkClick(e, product.url)}
                  style={{ borderRadius: '10px' }}>
                  <img
                    src={`${process.env.PUBLIC_URL}/image/icons/monitor-icon.png`}
                    alt="System Link"
                    style={{ marginRight: 8, verticalAlign: 'middle', height: '26px' }}
                  />
                  시스템 바로가기
                </Button>
                <Button
                  className="githubBtn"
                  onClick={(e) => handleLinkClick(e, product.github_url)}
                  style={{ borderRadius: '10px', textTransform: 'none' }}>
                  <img
                    src={`${process.env.PUBLIC_URL}/image/icons/github-mark.png`}
                    alt="github-link"
                    style={{ marginRight: 8, verticalAlign: 'middle', height: '26px' }}
                  />
                  GitHub Code
                </Button>

              </div>
            </div>

            <div className="rightSide">
              <p className="title">{product.sol_name}</p>
              <p className="fullNm">{product.sol_full_name}</p>
              <p className="titlekr">{product.kor_name}</p>
              <div className="gap-20"></div>
              <div>
                {[...Array(5)].map((_, index) => (
                  <BsFillStarFill key={index} style={{ color: '#EFC42D', margin: '2px' }} />
                ))}
              </div>
              <div className="like">
                Reviews : <span style={{ color: '#f06292' }}>{reviewCnt?.length}</span> 개
              </div>
              <hr />
              <div className="btns">
                <button className="proBtn" onClick={goToSolution}>
                  Solution 안내
                </button>
                <button className="proBtn" onClick={goToReviews}>
                  Reviews 보기
                </button>
                <button className='proBtn' onClick={goToPNCR}>
                  PN/CR
                </button>
              </div>

              <div className="scoreBox">
                <Button variant="contained" className="likeBtn"
                  onClick={handleLike} sx={{ backgroundColor: pink[300] }}>
                  마음에 들면 좋아요
                </Button>
                <IconButton onClick={handleLike} sx={{ color: pink[500] }}>
                  {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <p>{likeCount}</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<ProductContent solutionData={product} productId={productId} getDevelopers={getDevelopers} />} />
        <Route path="/reviews" element={<ProductReviews productId={productId} />} />
        <Route path="/update" element={<ProductUpdate solutionData={product} productId={productId} getDevelopers={getDevelopers} />} />
        <Route path="/pncr" element={<ProductPncr productId={productId} currentUser={currentUser} goToDetail={goToDetail} />} />
        <Route path="/pncrdetail/:id" element={<Detail selectedRow={selectedRow} currentUser={currentUser} />} />
      </Routes>
    </div>
  )
}

export default Product;
