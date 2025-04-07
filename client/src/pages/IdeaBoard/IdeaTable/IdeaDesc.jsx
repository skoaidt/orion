import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import IdeaSelected from "../IdeaModal/IdeaSelected";
import IdeaPilot from "../IdeaModal/IdeaPilot";
import IdeaVerify from "../IdeaModal/IdeaVerify";
import IdeaDevReview from "../IdeaModal/IdeaDevReview";
import IdeaDeveloping from "../IdeaModal/IdeaDeveloping";
import IdeaCompleted from "../IdeaModal/IdeaCompleted";
import IdeaDrop from "../IdeaModal/IdeaDrop";
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

const IdeaDesc = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(null);
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

  // 아이디어 데이터 가져오기
  useEffect(() => {
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

    if (id) {
      fetchIdeaData();
    }
  }, [id]);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
  };

  const handleBoxClick = (modalType) => {
    setOpenModal(modalType);
  };

  const handleGanttNavigate = () => {
    navigate(`/ideaboard/gantt/${id}`);
  };

  if (loading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="ideaDesc">
      <div className="ideaDescWrap">
        <div className="ideaDescBtn">
          <div className="left">
            <button>수정</button>
            <button>삭제</button>
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
            <div className="hitsCount">{ideaData.views || 0}</div>
          </div>
          <div className="Box">
            <ChatIcon style={{ fontSize: "16px" }} />
            <div className="comments">댓글</div>
            <div className="commentsCount">
              {ideaData.comments?.length || 0}
            </div>
          </div>
        </div>
        <div className="gap-20"></div>
        <div className="commentsContent">
          {ideaData.comments && ideaData.comments.length > 0 ? (
            ideaData.comments.map((comment, index) => (
              <div className="commentItem" key={index}>
                <div className="commentAuthor">
                  <div className="commentAuthorNm">{comment.name}</div>
                  <div className="commentAuthorTeam">{comment.dept_name}</div>
                </div>
                <div className="commentText">{comment.content}</div>
                <div className="commentDownWrap">
                  <div className="commentDate">
                    {formatDate(comment.created_at)}
                  </div>
                  <Button startIcon={<DeleteIcon />} sx={{ color: "tomato" }}>
                    삭제
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="commentItem">
              <div className="commentText">아직 댓글이 없습니다.</div>
            </div>
          )}
          <div className="addWrap">
            <div className="commentNm">사용자</div>
            <div className="addComment">
              <form style={{ width: "100%", margin: "5px 10px" }}>
                <textarea
                  placeholder="댓글을 남겨보세요"
                  rows="4"
                  style={{
                    width: "100%",
                    border: "none",
                    boxSizing: "border-box",
                  }}
                />
                <div className="btnGroup">
                  <Button startIcon={<SendIcon />}>등록</Button>
                </div>
              </form>
            </div>
          </div>
          <div className="gap-20"></div>
        </div>
        <div className="gap-20"></div>
        <div className="ideaDescBtn">
          <div className="left">
            <button>수정</button>
            <button>삭제</button>
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
                      style={{ fontSize: "13px", fontWeight: "300" }}
                    >
                      {ideaData.business_field}기술팀 검증 필요
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
                  <div className="userInfo">
                    <div
                      className="processItemContentTitle"
                      style={{ fontSize: "13px", fontWeight: "300" }}
                    >
                      Access기술팀 검증 필요
                    </div>
                  </div>
                  {/* <div className="processItemContentDate">2025-03-14</div> */}
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
                  {/* <div className="processItemContentDate">2025-03-14</div> */}
                </div>
                {/* <div className="right">
                  <div className="dDay">D-3</div>
                </div> */}
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
                  {/* <div className="processItemContentDate">2025-03-14</div> */}
                </div>
                {/* <div className="right">
                  <div className="dDay">D-3</div>
                </div> */}
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
                  {/* <div className="processItemContentDate">2025-03-14</div> */}
                </div>
                {/* <div className="right">
                  <div className="dDay">D-3</div>
                </div> */}
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
                  {/* <div className="processItemContentDate">2025-03-14</div> */}
                </div>
                {/* <div className="right">
                  <div className="dDay">D-3</div>
                </div> */}
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
      </div>
    </div>
  );
};

export default IdeaDesc;
