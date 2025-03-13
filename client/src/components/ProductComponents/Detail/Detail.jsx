import React, { useEffect, useState } from "react";
import { Button, Slider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import DOMPurify from "dompurify";
import "./detail.scss";
import Update from "../Update/Update";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import EmojiPicker from "emoji-picker-react";
// import axios from 'axios';

// HTML 변환 작업 ///
const DisplayStyledText = ({ htmlContent }) => {
  const cleanHTML = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};
///////////////////

const Detail = ({ selectedRow, currentUser }) => {
  const navigate = useNavigate();
  const [updateOpen, setUpdateOpen] = useState(false);
  // const [completeStatus, setCompleteStatus] = useState(selectedRow.complete);
  const [completeStatus, setCompleteStatus] = useState(
    selectedRow?.complete || null
  );
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const isAuthorized =
    currentUser?.isAdmin || currentUser?.userId === selectedRow.n_id;
  const isOwner = currentUser?.userId === selectedRow?.n_id;

  const handleCompleteChange = (event, newValue) => {
    setCompleteStatus(newValue);
  };

  useEffect(() => {
    if (selectedRow) {
      setCompleteStatus(selectedRow.complete);
    }
  }, [selectedRow]);

  useEffect(() => {
    const fetchComments = async () => {
      if (selectedRow) {
        try {
          const response = await axios.get(
            `/api/datatables/pncrgetComments/${selectedRow.id}`
          );
          setComments(response.data);
        } catch (error) {
          console.error("댓글 가져오기 실패", error);
        }
      }
    };
    fetchComments();
  }, [selectedRow]);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await axios.get(
          `/api/datatables/countComments/${selectedRow.id}`
        );
        setCommentCount(response.data.count);
      } catch (error) {
        console.error("댓글 갯수 가져오기 실패", error);
      }
    };

    if (selectedRow) {
      fetchCommentCount();
    }
  }, [selectedRow]);

  const updateRow = () => {
    if (selectedRow) {
      setUpdateOpen(true);
    }
  };
  const deleteRow = async () => {
    try {
      await axios.delete(`/api/datatables/pncr/${selectedRow.id}`);
      alert("게시글이 삭제되었습니다.");
      navigate(`/product/${selectedRow.sol_id}/pncr`);
    } catch (error) {
      console.error("게시글 삭제에 실패", error);
    }
  };

  const saveCompleteStatus = async () => {
    try {
      await axios.put("/api/datatables/pncrcomplete/", {
        id: selectedRow.id,
        complete: completeStatus,
      });
      alert("Complete(진행률) 변경 성공!!");
      selectedRow.complete = completeStatus;
    } catch (error) {
      console.error("Complete 업데이트에 실패", error);
    }
  };

  const handleLinkClick = () => {
    navigate(`/product/${selectedRow.sol_id}/pncr`);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!selectedRow || !currentUser) {
      alert("유효하지 않은 접근입니다.");
      return;
    }
    try {
      const response = await axios.post("/api/datatables/addComment", {
        pncr_id: selectedRow.id,
        n_id: currentUser.userId,
        n_name: currentUser.name,
        team: currentUser.deptName,
        comment: newComment,
        date: format(new Date(), "yyyy-MM-dd HH:mm"),
      });
      setComments([
        ...comments,
        {
          id: response.data.id,
          n_id: currentUser.userId,
          n_name: currentUser.name,
          team: currentUser.deptName,
          comment: newComment,
          date: format(new Date(), "yyyy-MM-dd HH:mm"),
        },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 추가에 실패", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/datatables/pncrComment/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제에 실패", error);
    }
  };

  const handleEmojiClick = (emojiObject, event) => {
    setNewComment((prevComment) => prevComment + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="detail">
      <div className="gap-60"></div>
      <div className="articleTopBtns">
        {isOwner && (
          <div className="actionButtons">
            <Button
              onClick={updateRow}
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{ color: "$blueColor", width: "120px" }}
            >
              수정하기
            </Button>
            <Button
              onClick={deleteRow}
              variant="outlined"
              startIcon={<DeleteIcon />}
              sx={{ color: "tomato", width: "120px" }}
            >
              삭제하기
            </Button>
          </div>
        )}
        <Button variant="outlined" onClick={handleLinkClick}>
          목록
        </Button>
      </div>
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <div className="inner">
          <div className="linkBoard" onClick={handleLinkClick}>
            PN/CR &gt;
          </div>
          <div className="titleWrap">
            <div className="title">{selectedRow.title}</div>
            <div className="idCategory">
              <div>ID : {selectedRow.id}</div>
              <div>
                {" "}
                분류 [<b>{selectedRow.category}</b>]
              </div>
            </div>
          </div>

          <div className="writeInfo">
            <div className="left">
              <img
                src={`${process.env.PUBLIC_URL}/image/icons/noavatar.png`}
                alt="avatar"
              />
              <div className="write">
                <div className="author">
                  <div className="authorNm">{selectedRow.n_name} </div>
                  <div className="authorTeam"> {selectedRow.team}</div>
                </div>
                <div className="authorDate">
                  <div>{selectedRow.date}</div>
                  <div>조회 {selectedRow.viewCount}</div>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="comment">
                <span>
                  <img
                    src={`${process.env.PUBLIC_URL}/image/icons/comment.png`}
                    alt="avatar"
                  />
                </span>
                <span>댓글 {commentCount}</span>
              </div>
            </div>
          </div>

          <div className="descripContainer">
            <div className="descrip">
              <DisplayStyledText htmlContent={selectedRow.descrip} />
            </div>
          </div>

          {isAuthorized && (
            <div className="completeBox">
              <div className="progressBox">
                <div className="title">진행률</div>
                <Slider
                  defaultValue={completeStatus}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks={[
                    { value: 0, label: "요청" },
                    { value: 1, label: "개발중" },
                    { value: 2, label: "완료" },
                    { value: 3, label: "Drop" },
                  ]}
                  min={0}
                  max={3}
                  value={completeStatus}
                  onChange={handleCompleteChange}
                  sx={{
                    color: completeStatus === 3 ? "grey" : "primary.main",
                    "& .MuiSlider-thumb": {
                      color: completeStatus === 3 ? "grey" : "primary.main",
                    },
                    "& .MuiSlider-track": {
                      color: completeStatus === 3 ? "grey" : "primary.main",
                    },
                    "& .MuiSlider-rail": {
                      color: completeStatus === 3 ? "grey" : "#bfbfbf",
                    },
                  }}
                  className="customSlider"
                />
              </div>
              <Button
                onClick={saveCompleteStatus}
                variant="outlined"
                style={{ marginTop: "10px" }}
              >
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="commentsContent">
          {comments.map((comment) => {
            const isCommentOwner = currentUser?.userId === comment.n_id;
            return (
              <div key={comment.id} className="commentItem">
                <div className="commentAuthor">
                  <div className="commentAuthorNm">{comment.n_name}</div>
                  <div className="commentAuthorTeam">{comment.team}</div>
                </div>
                <div className="commentText">{comment.comment}</div>
                <div className="commentDownWrap">
                  <div className="commentDate">{comment.date}</div>
                  {isCommentOwner && (
                    <Button
                      startIcon={<DeleteIcon />}
                      sx={{ color: "tomato" }}
                      onClick={() => deleteComment(comment.id)}
                    >
                      삭제하기
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="addWrap">
            <div className="commentNm">{currentUser.name}</div>
            <div className="addComment">
              <form onSubmit={handleAddComment}>
                <textarea
                  placeholder="댓글을 남겨보세요"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="4"
                />
                <div className="btnGroup">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <SentimentSatisfiedAltIcon />
                  </button>
                  {showEmojiPicker && (
                    <div className="emojiPickerWrapper">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                  <button type="submit">저장하기</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="downWrap">
        <div className="btnList">
          <Button variant="outlined" onClick={handleLinkClick}>
            목록
          </Button>
          <Button
            variant="outlined"
            startIcon={<KeyboardDoubleArrowUpIcon />}
            onClick={scrollToTop}
          >
            TOP
          </Button>
        </div>
      </div>

      {updateOpen && selectedRow && (
        <div
          className="modalOverlay"
          style={{ zIndex: 110 }}
          onClick={() => setUpdateOpen(false)}
        >
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <Update
              selectedRow={selectedRow}
              closeModals={() => setUpdateOpen(false)}
              fetchData={() => {}}
            />
          </div>
        </div>
      )}
      <div className="gap-60"></div>
    </div>
  );
};

export default Detail;
