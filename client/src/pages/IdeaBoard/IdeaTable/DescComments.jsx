import React, { useState, useContext, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./ideaDesc.scss";
import { AuthContext } from "../../../context/authContext";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const DescComments = ({ onCommentsUpdate }) => {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [loadingComments, setLoadingComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // 댓글 날짜 포맷 함수 - 하루를 더해서 표시
  const formatCommentDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    // 날짜에 하루 추가
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
  };

  // useCallback으로 fetchComments 함수를 메모이제이션
  const fetchComments = useCallback(async () => {
    try {
      setLoadingComments(true);
      const response = await axios.get(`/api/ideas/comments/${id}`);
      const fetchedComments = response.data;
      setComments(fetchedComments);

      // 댓글 갯수를 부모 컴포넌트로 전달
      if (onCommentsUpdate) {
        onCommentsUpdate(fetchedComments.length);
      }
    } catch (error) {
      console.error("댓글 조회 오류:", error);
    } finally {
      setLoadingComments(false);
    }
  }, [id, onCommentsUpdate]); // id와 onCommentsUpdate가 변경될 때만 함수를 재생성

  // 컴포넌트가 마운트될 때 댓글 목록을 가져오도록 useEffect 추가
  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // fetchComments가 변경될 때만 실행

  // 댓글 삭제 함수 추가
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/ideas/comments/${commentId}`);
        fetchComments(); // 댓글 목록 다시 불러오기
      } catch (error) {
        console.error("댓글 삭제 오류:", error);
        alert("댓글을 삭제하는 중 오류가 발생했습니다.");
      }
    }
  };

  // 댓글 등록 함수 추가
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    if (!currentUser) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    try {
      const commentData = {
        idea_id: id,
        n_id: currentUser.userId || "unknown",
        name: currentUser.name || "사용자",
        team: currentUser.deptName || "팀 정보 없음",
        comment: commentText,
      };

      await axios.post("/api/ideas/comments", commentData);
      setCommentText(""); // 입력창 초기화
      fetchComments(); // 댓글 목록 다시 불러오기
    } catch (error) {
      console.error("댓글 등록 오류:", error);
      alert("댓글을 등록하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="commentsContent">
      {loadingComments ? (
        <div className="commentItem">
          <div className="commentText">댓글을 불러오는 중입니다...</div>
        </div>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div className="commentItem" key={comment.comment_id}>
            <div className="commentAuthor">
              <div className="commentAuthorTeam">{comment.team}</div>
              <div className="commentAuthorNm">{comment.name}</div>
            </div>
            <div className="commentText">{comment.comment}</div>
            <div className="commentDownWrap">
              <div className="commentDate">
                {formatCommentDate(comment.date)}
              </div>
              {currentUser?.userId === comment.n_id && (
                <Button
                  startIcon={<DeleteIcon />}
                  sx={{ color: "tomato" }}
                  onClick={() => handleDeleteComment(comment.comment_id)}
                >
                  삭제
                </Button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="commentItem">
          <div className="commentText">아직 댓글이 없습니다.</div>
        </div>
      )}
      <div className="addWrap">
        <div className="commentNm">
          {currentUser?.deptName || "팀"} {currentUser?.name || "사용자"}
        </div>
        <div className="addComment">
          <form
            style={{ width: "100%", margin: "5px 10px" }}
            onSubmit={handleCommentSubmit}
          >
            <textarea
              placeholder="댓글을 남겨보세요"
              rows="4"
              style={{
                width: "100%",
                border: "none",
                boxSizing: "border-box",
              }}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="btnGroup">
              <Button
                startIcon={<SendIcon />}
                type="submit"
                disabled={!commentText.trim()}
              >
                등록
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="gap-20"></div>
    </div>
  );
};

export default DescComments;
