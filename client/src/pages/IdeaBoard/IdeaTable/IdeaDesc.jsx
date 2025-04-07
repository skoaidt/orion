import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import IdeaSelected from "../IdeaModal/IdeaSelected";
import IdeaPilot from "../IdeaModal/IdeaPilot";
import IdeaVerify from "../IdeaModal/IdeaVerify";
import IdeaDevReview from "../IdeaModal/IdeaDevReview";
import IdeaDeveloping from "../IdeaModal/IdeaDeveloping";
import IdeaCompleted from "../IdeaModal/IdeaCompleted";
import IdeaDrop from "../IdeaModal/IdeaDrop";
import IdeaRegister from "../IdeaModal/IdeaRegister";
import "./ideaDesc.scss";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import StreetviewIcon from "@mui/icons-material/Streetview";
import ChatIcon from "@mui/icons-material/Chat";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScienceIcon from "@mui/icons-material/Science";
import VerifiedIcon from "@mui/icons-material/Verified";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";

const IdeaDesc = () => {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ideaData, setIdeaData] = useState({
    id: "",
    project_type: "",
    title: "",
    business_field: "",
    job_field: "",
    name: "",
    dept_name: "",
    updated_at: "",
    background: "",
    progress: "",
    quantitative_effect: "",
    qualitative_effect: "",
    views: 0,
    likes: 0,
    comments: [],
  });
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  // 아이디어 데이터 가져오기 함수 - 외부에서도 호출할 수 있도록 수정
  const fetchIdeaData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/ideas/${id}`);
      setIdeaData(response.data);
    } catch (error) {
      console.error("아이디어 상세 정보 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 조회 로그 기록 함수 추가
  const logIdeaView = async () => {
    if (!currentUser) return; // 로그인하지 않은 사용자는 기록하지 않음

    try {
      // 동일 아이디어에 대한 중복 조회 로그 방지 (1분 제한)
      const viewLogKey = `viewed_idea_${id}_${currentUser.userId}`;
      const lastViewTime = sessionStorage.getItem(viewLogKey);

      if (lastViewTime) {
        const now = new Date().getTime();
        const lastTime = parseInt(lastViewTime);
        const ONE_MINUTE = 60 * 1000; // 1분(밀리초)

        // 마지막 조회 시간이 1분 이내인 경우 로그 기록 중단
        if (now - lastTime < ONE_MINUTE) {
          console.log("1분 이내 중복 조회 - 로그 기록 건너뜀");
          return;
        }
      }

      // 현재 정확한 시간을 사용하기 위해 클라이언트에서 직접 시간 정보를 보내지 않음
      await axios.post("/api/ideas/log-view", {
        idea_id: id,
        n_id: currentUser.userId || "unknown",
        name: currentUser.name || "사용자",
        team: currentUser.deptName || "팀 정보 없음",
      });

      // 현재 시간을 세션 스토리지에 기록
      sessionStorage.setItem(viewLogKey, new Date().getTime().toString());
    } catch (error) {
      console.error("조회 로그 기록 오류:", error);
      // 로그 기록 실패해도 사용자 경험에 영향을 주지 않도록 조용히 처리
    }
  };

  // 댓글 목록 조회 함수 추가
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await axios.get(`/api/ideas/comments/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error("댓글 조회 오류:", error);
    } finally {
      setLoadingComments(false);
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

  // 조회수 가져오기 함수 추가
  const fetchViewCount = async () => {
    try {
      const response = await axios.get(`/api/ideas/viewcount/${id}`);
      setViewCount(response.data.viewcount);
    } catch (error) {
      console.error("조회수 가져오기 오류:", error);
      // 오류 발생시 기존 조회수 유지
    }
  };

  // 컴포넌트 마운트 및 id 변경 시 데이터 로드
  useEffect(() => {
    if (id) {
      fetchIdeaData();
      fetchComments(); // 댓글도 함께 로드
      fetchViewCount(); // 조회수도 함께 로드
    }
  }, [id]);

  // 로그 기록은 별도 useEffect로 분리하여 한 번만 실행되도록 함
  useEffect(() => {
    if (id && currentUser) {
      // 컴포넌트가 마운트된 후에만 로그 기록
      logIdeaView();
    }
  }, [id, currentUser]); // id와 currentUser가 변경될 때만 실행

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
  };

  // 댓글 날짜 포맷 함수 - 하루를 더해서 표시
  const formatCommentDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    // 날짜에 하루 추가
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
  };

  const handleBoxClick = (modalType) => {
    setOpenModal(modalType);
  };

  const handleGanttNavigate = () => {
    navigate(`/ideaboard/gantt/${id}`);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // 삭제 버튼 클릭 핸들러 추가
  const handleDeleteClick = async () => {
    // 삭제 확인
    if (window.confirm("정말 이 아이디어를 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(`/api/ideas/${id}`);
        console.log("아이디어 삭제 성공:", response.data);
        alert("아이디어가 성공적으로 삭제되었습니다.");
        // 아이디어 목록 페이지로 이동
        navigate("/ideaboard");
      } catch (error) {
        console.error("아이디어 삭제 오류:", error);
        alert(
          `삭제 중 오류가 발생했습니다: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    }
  };

  // 모달 닫기 및 데이터 새로고침 처리
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    // 수정 모달이 닫힐 때 데이터 다시 불러오기
    fetchIdeaData();
  };

  if (loading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="ideaDesc">
      <div className="ideaDescWrap">
        <div className="ideaDescBtn">
          <div className="left">
            <button onClick={handleEditClick}>수정</button>
            <button onClick={handleDeleteClick}>삭제</button>
          </div>
          <div className="right">
            <Link to="/ideaboard">
              <button>목록</button>
            </Link>
          </div>
        </div>
        <div className="contentHead">
          <div className="devCategory">[{ideaData.project_type}]</div>
          <div className="headTitle">
            <div className="title">{ideaData.title}</div>
            <div className="subTitle">
              <div className="idNo">
                <span>[ID]</span>
                <span>{id}</span>
              </div>
              <div className="category">
                <span>[사업분야]</span>
                <span>{ideaData.business_field}</span>
              </div>
              <div className="category">
                <span>[업무분야]</span>
                <span>{ideaData.job_field}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="userInfo">
          <div className="userInfoWrap">
            <div className="userInfoLeft">
              <img
                src={`${process.env.PUBLIC_URL}/image/icons/noavatar.png`}
                alt="avatar"
              />
            </div>
            <div className="userInfoRight">
              <div className="user">
                <div className="name">{ideaData.name}</div>
                <div className="team">{ideaData.dept_name}</div>
              </div>
              <div className="date">{formatDate(ideaData.updated_at)}</div>
            </div>
          </div>

          <div className="likeWrap">
            <div className="like">
              <ThumbUpOffAltIcon size={24} />
            </div>
            <div className="likeCount">{ideaData.likes || 0}</div>
          </div>
        </div>
        <hr style={{ margin: "20px 0", color: "#8c8c8c" }} />

        <div className="contentBox">
          <div className="title">추진 배경</div>
          <div
            className="description"
            dangerouslySetInnerHTML={{
              __html: ideaData.background || "정보가 없습니다.",
            }}
          />

          <div className="title">추진 방안</div>
          <div
            className="description"
            dangerouslySetInnerHTML={{
              __html: ideaData.progress || "정보가 없습니다.",
            }}
          />

          <div className="title">정량적 효과</div>
          <div
            className="desEffect"
            dangerouslySetInnerHTML={{
              __html: ideaData.quantitative_effect || "정보가 없습니다.",
            }}
          />

          <div className="title">정성적 효과</div>
          <div
            className="desEffect"
            dangerouslySetInnerHTML={{
              __html: ideaData.qualitative_effect || "정보가 없습니다.",
            }}
          />
        </div>
        <hr style={{ margin: "20px 0 10px 0", color: "#8c8c8c" }} />

        <div className="hitsWrap">
          <div className="Box">
            <StreetviewIcon style={{ fontSize: "16px" }} />
            <div className="hits">조회수</div>
            <div className="hitsCount">{viewCount}</div>
          </div>
          <div className="Box">
            <ChatIcon style={{ fontSize: "16px" }} />
            <div className="comments">댓글</div>
            <div className="commentsCount">{comments.length || 0}</div>
          </div>
        </div>
        <div className="gap-20"></div>
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
        <div className="gap-20"></div>
        <div className="ideaDescBtn">
          <div className="left">
            <button onClick={handleEditClick}>수정</button>
            <button onClick={handleDeleteClick}>삭제</button>
          </div>
          <div className="right">
            <Link to="/ideaboard">
              <button>목록</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="ideaProcess">
        <div className="processTitle">진행 현황</div>
        <hr style={{ margin: "10px 0", width: "100%", color: "#8c8c8c" }} />
        {/* 과제 관리 Process : 진행 현황 */}
        <div className="processBox">
          <div className="processItem">
            <div className="processItemTitle active">등록</div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <AssignmentIcon className="icons" />
                </div>
              </div>
            </div>
            <div className="processItemContent active">
              <div className="userInfo">
                <div
                  className="processItemContentTitle"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {ideaData.name}
                </div>
                <div
                  className="processItemContentTeam"
                  style={{ fontSize: "10px" }}
                >
                  {ideaData.dept_name}
                </div>
              </div>
              <div
                className="processItemContentDate"
                style={{ fontSize: "10px" }}
              >
                {formatDate(ideaData.created_at)}
              </div>
            </div>
          </div>
        </div>
        <div className="processBox">
          <div
            className="processItem"
            onClick={() => handleBoxClick("ideaSelected")}
          >
            <div className="processItemTitle">선정</div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <CheckCircleIcon className="icons" />
                </div>
              </div>
            </div>
            <div className="processItemContent">
              <div className="itemcontentWrap">
                <div className="left">
                  <div className="userInfo">
                    <div
                      className="processItemContentTitle"
                      style={{
                        fontSize: "13px",
                        fontWeight: "300",
                        marginBottom: "3px",
                      }}
                    >
                      {`${ideaData.VerifyDepartment} 검증 필요`}
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="dDay">D-9</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="processBox">
          <div
            className="processItem"
            onClick={() => handleBoxClick("ideaPiloted")}
          >
            <div className="processItemTitle">Pilot</div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <ScienceIcon className="icons" />
                </div>
              </div>
            </div>
            <div className="processItemContent">
              <div className="itemcontentWrap">
                <div className="left">
                  <div className="userInfo">
                    <div
                      className="processItemContentTitle"
                      style={{ fontSize: "13px", fontWeight: "300" }}
                    >
                      {ideaData.dept_name} 검증 필요
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="dDay">D-6</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="processBox">
          <div
            className="processItem"
            onClick={() => handleBoxClick("ideaVerify")}
          >
            <div className="processItemTitle">검증</div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <VerifiedIcon className="icons" />
                </div>
              </div>
            </div>
            <div className="processItemContent">
              <div className="itemcontentWrap">
                <div className="left">
                  <div
                    className="userInfo"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      className="processItemContentTitle"
                      style={{
                        fontSize: "13px",
                        fontWeight: "300",
                        marginBottom: "0",
                        display: "block",
                        width: "100%",
                      }}
                    >
                      {`${ideaData.VerifyDepartment} 검증 필요`}
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="dDay">D-3</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="processBox">
          <div
            className="processItem"
            onClick={() => handleBoxClick("ideaDevReview")}
          >
            <div className="processItemTitle">개발심의</div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <RateReviewIcon className="icons" />
                </div>
              </div>
            </div>
            <div className="processItemContent">
              <div className="itemcontentWrap">
                <div className="left">
                  <div className="userInfo">
                    <div
                      className="processItemContentTitle"
                      style={{ fontSize: "13px", fontWeight: "300" }}
                    >
                      준비중
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="processBox">
          <div className="processItem" onClick={handleGanttNavigate}>
            <div className="processItemTitle">개발중</div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <DeveloperModeIcon className="icons" />
                </div>
              </div>
            </div>
            <div className="processItemContent">
              <div className="itemcontentWrap">
                <div className="left">
                  <div className="userInfo">
                    <div
                      className="processItemContentTitle"
                      style={{ fontSize: "13px", fontWeight: "300" }}
                    >
                      준비중
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="processBox">
          <div
            className="processItem"
            onClick={() => handleBoxClick("ideaCompleted")}
          >
            <div className="processItemTitle">완료</div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <TaskAltIcon className="icons" />
                </div>
              </div>
            </div>
            <div className="processItemContent">
              <div className="itemcontentWrap">
                <div className="left">
                  <div className="userInfo">
                    <div
                      className="processItemContentTitle"
                      style={{ fontSize: "13px", fontWeight: "300" }}
                    >
                      준비중
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr style={{ margin: "20px 0", color: "#8c8c8c" }} />
        <div className="processBox">
          <div
            className="processItem"
            onClick={() => handleBoxClick("ideaDrop")}
          >
            <div className="processItemTitle">Drop</div>
            <div className="lineBox dropLineBox">
              <div className="line dropLine">
                <div className="circle">
                  <CancelIcon className="icons" />
                </div>
              </div>
            </div>
            <div className="processItemContent">
              <div className="itemcontentWrap">
                <div className="left">
                  <div className="userInfo">
                    <div
                      className="processItemContentTitle"
                      style={{ fontSize: "13px", fontWeight: "300" }}
                    >
                      -
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 모달 컴포넌트 렌더링 */}
        {openModal === "ideaSelected" && (
          <IdeaSelected onClose={() => setOpenModal(null)} ideaId={id} />
        )}
        {openModal === "ideaPiloted" && (
          <IdeaPilot onClose={() => setOpenModal(null)} ideaId={id} />
        )}
        {openModal === "ideaVerify" && (
          <IdeaVerify onClose={() => setOpenModal(null)} ideaId={id} />
        )}
        {openModal === "ideaDevReview" && (
          <IdeaDevReview onClose={() => setOpenModal(null)} ideaId={id} />
        )}
        {openModal === "ideaDeveloping" && (
          <IdeaDeveloping onClose={() => setOpenModal(null)} ideaId={id} />
        )}
        {openModal === "ideaCompleted" && (
          <IdeaCompleted onClose={() => setOpenModal(null)} ideaId={id} />
        )}
        {openModal === "ideaDrop" && (
          <IdeaDrop onClose={() => setOpenModal(null)} ideaId={id} />
        )}

        {/* 수정 모달 추가 */}
        {showEditModal && (
          <IdeaRegister
            onClose={handleCloseEditModal}
            editMode={true}
            ideaData={ideaData}
            onUpdate={fetchIdeaData}
          />
        )}
      </div>
    </div>
  );
};

export default IdeaDesc;
