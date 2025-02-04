import "./productComponents.scss";
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from "../../context/authContext";
import { Button, TextField } from '@mui/material';
import { BsTrashFill } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns';
import axios from 'axios';


export const ProductReviews = ({ productId }) => {
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const sol_id = productId;

  // 댓글 등록 함수
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = {
      uuid: uuidv4(),
      n_id: currentUser.userId,
      n_name: currentUser.name,
      team: currentUser.deptName,
      headqt: currentUser.prntDeptName,
      content: commentInput,
      date: format(new Date(), 'yyyy-MM-dd HH:mm'),
      sol_id
    };
    try {
      const response = await fetch("/api/reviews/reviewreg", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });
      if (response.ok) {
        const data = await response.json();
        // 서버에서 반환된 댓글 데이터로 댓글 목록 업데이트
        // console.log('서버로 받은 data: ', data);
        setComments((prevComments) => [...prevComments, data]);
        setCommentInput('');
      } else {
        throw new Error('댓글을 저장하는데 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 추가 에러:', error);
    }
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (uuid) => {
    try {
      await axios.delete(`/api/reviews/deletereview/${uuid}`);
      setComments(comments.filter(comment => comment.uuid !== uuid));
    } catch (error) {
      console.error("댓글 삭제 에러", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get(`/api/reviews/getreview?sol_id=${sol_id}`);
        setComments(response.data);
      } catch (error) {
        console.error("댓글 가져올때 오류가 발생했습니다.", error);
      };
    };
    fetchComment();
  }, [sol_id]);


  return (
    <div className="productReviews">
      <div className="contentBox">
        <div className="container">
          <div className="gap-60"></div>
          <div className="titleText">Reviews 보기</div>

          <form className="commentForm" onSubmit={handleAddComment}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="댓글을 입력하세요."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <Button className="commentBtn" type="submit" variant="contained" color="primary">
              댓글 달기
            </Button>
          </form>
          {
            [...comments].sort((a, b) => new Date(b.date) - new Date(a.date)).map((comment) => (
              <div key={comment.uuid}>
                <div className="reviewBox">
                  <div className="reviewHeader">
                    <div>
                      <p className="reviewNm">{comment.n_name} </p>
                      <p className="reviewTeam">{comment.team}</p>
                    </div>
                    <p className="reviewDate">{comment.date}</p>
                  </div>
                  <div className="reviewContent">
                    {comment.content}
                  </div>
                  <div className="reviewActions">
                    {currentUser.userId === comment.n_id && (
                      <Button className="reviewActionsBtn" onClick={() => handleDeleteComment(comment.uuid)}>
                        <BsTrashFill /> 삭제하기
                      </Button>
                    )}

                  </div>
                </div>
              </div>
            ))}
          <div className="gap-30"></div>


          <div className="gap-60"></div>
        </div>
      </div>
      <div className="gap-60"></div>
    </div>
  )
}


export default ProductReviews;