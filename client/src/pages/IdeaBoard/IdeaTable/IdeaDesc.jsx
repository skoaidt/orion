import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import IdeaSelected from "../IdeaModal/IdeaSelected";
import IdeaPilot from "../IdeaModal/IdeaPilot";
import IdeaVerify from "../IdeaModal/IdeaVerify";
import IdeaDevReview from "../IdeaModal/IdeaDevReview";
import IdeaDeveloping from "../IdeaModal/IdeaDeveloping";
import IdeaCompleted from "../IdeaModal/IdeaCompleted";
import IdeaDrop from "../IdeaModal/IdeaDrop";
import "./ideaDesc.scss";
import { Button, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import StreetviewIcon from "@mui/icons-material/Streetview";
import ChatIcon from "@mui/icons-material/Chat";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScienceIcon from "@mui/icons-material/Science";
import VerifiedIcon from "@mui/icons-material/Verified";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";

const IdeaDesc = () => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(null);

  const handleBoxClick = (modalType) => {
    setOpenModal(modalType);
  };

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
          <div className="devCategory">[신규개발]</div>
          <div className="headTitle">
            <div className="title">대형 사업자 관리 시스템</div>
            <div className="subTitle">
              <div className="idNo">
                <span>[ID]</span>
                <span>{id}</span>
              </div>
              <div className="category">
                <span>[사업분야]</span>
                <span>Access</span>
              </div>
              <div className="category">
                <span>[업무분야]</span>
                <span>RM</span>
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
                <div className="name">전다현</div>
                <div className="team">종로품질개선팀</div>
              </div>
              <div className="date">2025-03-12</div>
            </div>
          </div>
          <div className="likeWrap">
            <div className="like">
              <ThumbUpOffAltIcon size={24} />
            </div>
            <div className="likeCount">100</div>
          </div>
        </div>
        <hr style={{ margin: "20px 0", color: "#8c8c8c" }} />

        <div className="contentBox">
          <div className="title">추진 배경</div>
          <div className="description">
            - 기존 DPRS에 적용중인 대형사업장 현황정보 다운로드 기능에 이어
            사업장별 담당자 변경정보 및 연락처, 사업자 출입 관련 필수교육
            이수시간 관리 등 건강도 체크기능 고도화필요(모바일화) - 기존 DPRS에
            적용중인 대형사업장 현황정보 다운로드 기능에 이어 사업장별 담당자
            변경정보 및 연락처, 사업자 출입 관련 필수교육 이수시간 관리 등
            건강도 체크기능 고도화필요(모바일화) - 기존 DPRS에 적용중인
            대형사업장 현황정보 다운로드 기능에 이어 사업장별 담당자 변경정보 및
            연락처, 사업자 출입 관련 필수교육 이수시간 관리 등 건강도 체크기능
            고도화필요(모바일화) - 기존 DPRS에 적용중인 대형사업장 현황정보
            다운로드 기능에 이어 사업장별 담당자 변경정보 및 연락처, 사업자 출입
            관련 필수교육 이수시간 관리 등 건강도 체크기능 고도화필요(모바일화)
          </div>
          <div className="title">추진 방안</div>
          <div className="description">
            1. 지역별 PPT작성 담당자를 1명으로 지정 취합 후 업데이트하여
            관리(24년완료_DPRS) <br></br>
            2. 업데이트 된 대형사업장 Tool활용 간편하게 사업장 현황 및 건강도
            체크(noti) 등 효율화(진행필요)
          </div>
          <div className="title">정량적 효과</div>
          <div className="desEffect">
            1. 지역별 PPT작성 담당자를 1명으로 지정 취합 후 업데이트하여
            관리(24년완료_DPRS) <br></br>
            2. 업데이트 된 대형사업장 Tool활용 간편하게 사업장 현황 및 건강도
            체크(noti) 등 효율화(진행필요)
          </div>
          <div className="title">정성적 효과</div>
          <div className="desEffect">
            1. 지역별 PPT작성 담당자를 1명으로 지정 취합 후 업데이트하여
            관리(24년완료_DPRS) <br></br>
            2. 업데이트 된 대형사업장 Tool활용 간편하게 사업장 현황 및 건강도
            체크(noti) 등 효율화(진행필요)
          </div>
        </div>
        <hr style={{ margin: "20px 0 10px 0", color: "#8c8c8c" }} />

        <div className="hitsWrap">
          <div className="Box">
            <StreetviewIcon style={{ fontSize: "16px" }} />
            <div className="hits">조회수</div>
            <div className="hitsCount">100</div>
          </div>
          <div className="Box">
            <ChatIcon style={{ fontSize: "16px" }} />
            <div className="comments">댓글</div>
            <div className="commentsCount">100</div>
          </div>
        </div>

        <div className="commentsContent">
          <div className="commentItem">
            <div className="commentAuthor">
              <div className="commentAuthorNm">전다현</div>
              <div className="commentAuthorTeam">종로품질개선팀</div>
            </div>
            <div className="commentText">
              아이디어가 특출나네요. 과제가 잘 진행되면 좋을 것 같습니다.
            </div>
            <div className="commentDownWrap">
              <div className="commentDate">2025-03-12</div>
              <Button startIcon={<DeleteIcon />} sx={{ color: "tomato" }}>
                삭제
              </Button>
            </div>
          </div>
          <div className="commentItem">
            <div className="commentAuthor">
              <div className="commentAuthorNm">전다현</div>
              <div className="commentAuthorTeam">종로품질개선팀</div>
            </div>
            <div className="commentText">
              아이디어가 특출나네요. 과제가 잘 진행되면 좋을 것 같습니다.
            </div>
            <div className="commentDownWrap">
              <div className="commentDate">2025-03-12</div>
              <Button startIcon={<DeleteIcon />} sx={{ color: "tomato" }}>
                삭제
              </Button>
            </div>
          </div>
          <div className="addWrap">
            <div className="commentNm">전다현</div>
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

        <Timeline position="right">
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              등록
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <AssignmentIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className="timelineContentBox">
                <div className="timelineContent">
                  <div className="userInfo">
                    <div className="timelineUser">전다현</div>
                    <div className="timelineTeam">종로품질개선팀</div>
                  </div>
                  <div className="timelineDate">2025-03-14</div>
                </div>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              선정
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined">
                <CheckCircleIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                elevation={3}
                className="timelineContentBox"
                onClick={() => handleBoxClick("ideaSelected")}
              >
                <div className="timelineContent">
                  <div className="team">Access계획팀 선정 필요</div>
                </div>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              Pilot
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined">
                <ScienceIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                elevation={3}
                className="timelineContentBox"
                onClick={() => handleBoxClick("ideaPiloted")}
              >
                <div className="timelineContent">
                  <div className="timelineUser">박지민</div>
                  <div className="timelineTeam">품질관리팀</div>
                  <div className="timelineDate">2025-03-25</div>
                </div>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              검증
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined">
                <VerifiedIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                elevation={3}
                className="timelineContentBox"
                onClick={() => handleBoxClick("ideaVerify")}
              >
                <div className="timelineContent">
                  <div className="timelineUser">이영희</div>
                  <div className="timelineTeam">검증팀</div>
                  <div className="timelineDate">2025-04-02</div>
                </div>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              개발심의
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined">
                <RateReviewIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                elevation={3}
                className="timelineContentBox"
                onClick={() => handleBoxClick("ideaDevReview")}
              >
                <div className="timelineContent">
                  <div className="timelineUser">최민수</div>
                  <div className="timelineTeam">개발심의위원회</div>
                  <div className="timelineDate">2025-04-10</div>
                </div>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              개발중
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined">
                <DeveloperModeIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                elevation={3}
                className="timelineContentBox"
                onClick={() => handleBoxClick("ideaDeveloping")}
              >
                <div className="timelineContent">
                  <div className="timelineUser">정성훈</div>
                  <div className="timelineTeam">개발2팀</div>
                  <div className="timelineDate">2025-04-15</div>
                </div>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              완료
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined">
                <TaskAltIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                elevation={3}
                className="timelineContentBox"
                onClick={() => handleBoxClick("ideaCompleted")}
              >
                <div className="timelineContent">
                  <div className="timelineUser">한지원</div>
                  <div className="timelineTeam">PM팀</div>
                  <div className="timelineDate">2025-05-20</div>
                </div>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              Drop
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="error">
                <CancelIcon />
              </TimelineDot>
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                elevation={3}
                className="timelineContentBox"
                onClick={() => handleBoxClick("ideaDrop")}
              >
                <div className="timelineContent">
                  <div className="timelineUser">오민지</div>
                  <div className="timelineTeam">심사팀</div>
                  <div className="timelineDate">2025-06-01</div>
                </div>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      {/* 모달 컴포넌트 렌더링 */}
      {openModal === "ideaSelected" && (
        <IdeaSelected onClose={() => setOpenModal(null)} />
      )}
      {openModal === "ideaPiloted" && (
        <IdeaPilot onClose={() => setOpenModal(null)} />
      )}
      {openModal === "ideaVerify" && (
        <IdeaVerify onClose={() => setOpenModal(null)} />
      )}
      {openModal === "ideaDevReview" && (
        <IdeaDevReview onClose={() => setOpenModal(null)} />
      )}
      {openModal === "ideaDeveloping" && (
        <IdeaDeveloping onClose={() => setOpenModal(null)} />
      )}
      {openModal === "ideaCompleted" && (
        <IdeaCompleted onClose={() => setOpenModal(null)} />
      )}
      {openModal === "ideaDrop" && (
        <IdeaDrop onClose={() => setOpenModal(null)} />
      )}
    </div>
  );
};

export default IdeaDesc;
