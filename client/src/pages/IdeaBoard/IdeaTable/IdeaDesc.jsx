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

// 상태값 상수 정의
const STAGES = {
  INITIAL: "", // 초기 상태
  REGISTER: "등록", // 등록 완료
  SELECTION: "선정", // 선정 완료
  PILOT: "piloted", // 파일럿 완료
  VERIFY: "verified", // 검증 완료
  DEV_REVIEW: "devReviewed", // 개발자 검토 완료
  DEVELOPING: "developing", // 개발 진행 중
  COMPLETED: "completed", // 완료
  DROP: "drop", // Drop 상태
};

// 단계 순서 정의 (인덱스가 작을수록 먼저 진행되는 단계)
const STAGE_ORDER = {
  등록: 0,
  선정: 1,
  piloted: 2,
  verified: 3,
  devReviewed: 4,
  developing: 5,
  completed: 6,
};

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
    status: "",
  });
  const [loading, setLoading] = useState(true);

  // 아이디어 데이터 가져오기
  useEffect(() => {
    const fetchIdeaData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/ideas/${id}`);
        setIdeaData(response.data);
        console.log("아이디어 상태:", response.data.status); // 상태 로깅
      } catch (error) {
        console.error("아이디어 상세 정보 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIdeaData();
    }
  }, [id, openModal]); // openModal 종료 시에도 데이터 새로고침

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
  };

  // 단계 진행 가능 여부 확인 함수
  const canProceedToStage = (stage) => {
    console.log(
      "canProceedToStage 호출:",
      stage,
      "현재 상태:",
      ideaData.status
    );

    // Drop 상태인 경우, 어떤 단계도 진행 불가
    if (ideaData.status === STAGES.DROP) {
      console.log("Drop 상태이므로 진행 불가");
      return false;
    }

    // 파일럿 상태를 확인하기 위한 정규 표현식 패턴
    const isPilotStatus =
      ideaData.status === "piloted" ||
      ideaData.status === "ideaPilot" ||
      /pilot/i.test(ideaData.status);

    console.log("Pilot 상태 체크:", isPilotStatus);

    // 각 단계별 진행 가능 조건 정의
    switch (stage) {
      case "ideaSelected": // 선정 단계
        // 등록 상태거나 선정/검증 단계를 이미 거친 경우 선정 단계 진행 가능
        // Pilot, 검증 단계를 거친 아이디어도 다시 선정 단계 진행 가능하도록 함
        return true; // 선정 단계는 언제든지 접근 가능하도록 설정

      case "ideaPiloted": // Pilot 단계
        // 선정 단계를 거쳤거나 이미 Pilot 또는 그 이후 단계인 경우 진행 가능
        console.log(
          "Pilot 단계 접근 검사:",
          ideaData.status === "선정" ||
            isPilotStatus ||
            ideaData.status === "verified" ||
            ideaData.status.includes("선정") ||
            ideaData.status.includes("verif")
        );
        return (
          ideaData.status === "선정" ||
          isPilotStatus ||
          ideaData.status === "verified" ||
          ideaData.status.includes("선정") ||
          ideaData.status.includes("verif")
        );

      case "ideaVerify": // 검증 단계
        // Pilot 단계를 거쳤거나 이미 검증 단계인 경우 진행 가능
        console.log(
          "검증 단계 접근 검사:",
          isPilotStatus ||
            ideaData.status === "verified" ||
            ideaData.status.includes("verif")
        );
        return (
          isPilotStatus ||
          ideaData.status === "verified" ||
          ideaData.status.includes("verif")
        );

      case "ideaDevReview": // 개발자 검토 단계
        // 검증 단계를 거친 경우 진행 가능
        console.log(
          "개발자 검토 단계 접근 검사:",
          ideaData.status === "verified" ||
            ideaData.status === "devReviewed" ||
            ideaData.status.includes("verif") ||
            ideaData.status.includes("review")
        );
        return (
          ideaData.status === "verified" ||
          ideaData.status === "devReviewed" ||
          ideaData.status.includes("verif") ||
          ideaData.status.includes("review")
        );

      case "ideaDeveloping": // 개발 진행 단계
        // 개발자 검토 단계를 거친 경우 진행 가능
        console.log(
          "개발 진행 단계 접근 검사:",
          ideaData.status === "devReviewed" ||
            ideaData.status === "developing" ||
            ideaData.status.includes("review") ||
            ideaData.status.includes("develop")
        );
        return (
          ideaData.status === "devReviewed" ||
          ideaData.status === "developing" ||
          ideaData.status.includes("review") ||
          ideaData.status.includes("develop")
        );

      case "ideaCompleted": // 완료 단계
        // 개발 진행 단계를 거친 경우 진행 가능
        console.log(
          "완료 단계 접근 검사:",
          ideaData.status === "developing" ||
            ideaData.status === "completed" ||
            ideaData.status.includes("develop") ||
            ideaData.status.includes("complete")
        );
        return (
          ideaData.status === "developing" ||
          ideaData.status === "completed" ||
          ideaData.status.includes("develop") ||
          ideaData.status.includes("complete")
        );

      case "ideaDrop": // Drop 단계
        return true; // Drop은 언제든지 가능

      default:
        return false;
    }
  };

  // 단계 클릭 처리 함수
  const handleBoxClick = (modalType) => {
    console.log(
      "handleBoxClick 호출:",
      modalType,
      "현재 상태:",
      ideaData.status
    );

    // STAGES 상수에서 정의한 상태값과 모달 타입 매핑
    const modalToStageMap = {
      ideaSelected: "선정",
      ideaPiloted: "piloted",
      ideaVerify: "verified",
      ideaDevReview: "devReviewed",
      ideaDeveloping: "developing",
      ideaCompleted: "completed",
      ideaDrop: "drop",
    };

    // 현재 단계의 스테이지 값 가져오기
    const currentStage = modalToStageMap[modalType];

    // 현재 상태와 요청 단계 비교
    const isCompletedStage =
      STAGE_ORDER[currentStage] < getStageIndex(ideaData.status);

    // 이미 완료된 단계인 경우 모달을 바로 열어 저장된 값 확인
    if (isCompletedStage) {
      console.log(`${modalType} 단계는 이미 완료된 단계입니다. 모달을 엽니다.`);
      setOpenModal(modalType);
      return;
    }

    // 특별 처리: Pilot 관련 상태를 일관적으로 관리
    if (modalType === "ideaPiloted" && /pilot/i.test(ideaData.status)) {
      console.log("Pilot 단계 특별 처리: 이미 Pilot 상태이므로 진행 허용");
      setOpenModal(modalType);
      return;
    }

    // 진행 가능 여부 확인
    if (!canProceedToStage(modalType)) {
      if (ideaData.status === STAGES.DROP) {
        alert(
          "해당 아이디어는 Drop 상태입니다. 다음 단계로 진행할 수 없습니다."
        );
      } else {
        // 현재 단계와 요청된 단계를 로그에 남겨 디버깅하기 쉽게 함
        console.log(`진행 불가: 현재=${ideaData.status}, 요청=${modalType}`);
        alert(
          "이전 단계가 완료되지 않았습니다. 단계별로 순차적으로 진행해야 합니다."
        );
      }
      return;
    }

    setOpenModal(modalType);
  };

  // 아이디어 상태에 따른 스테이지 인덱스 확인 함수
  const getStageIndex = (status) => {
    // 직접적인 상태 매핑 확인
    const statusStageMap = {
      null: -1, // 초기 상태
      "": -1, // 초기 상태
      등록: 0, // 등록 완료
      선정: 1, // 선정 완료
      piloted: 2, // Pilot 완료
      ideaPilot: 2, // 이전 Pilot 상태값 (하위 호환성)
      verified: 3, // 검증 완료
      devReviewed: 4, // 개발자 검토 완료
      developing: 5, // 개발 진행 중
      completed: 6, // 완료
      drop: -2, // Drop 상태 (모든 진행 불가)
    };

    if (statusStageMap[status] !== undefined) {
      return statusStageMap[status];
    }
    // 추가적인 상태 문자열 확인 (부분 일치)
    else if (status.includes("선정")) {
      return 1;
    } else if (/pilot/i.test(status)) {
      return 2;
    } else if (/verif/i.test(status)) {
      return 3;
    } else if (/review/i.test(status)) {
      return 4;
    } else if (/develop/i.test(status)) {
      return 5;
    } else if (/complete/i.test(status)) {
      return 6;
    }

    return -1; // 알 수 없는 상태
  };

  // 간트 차트 페이지로 이동
  const handleGanttNavigate = () => {
    // 진행 가능 여부 확인
    if (!canProceedToStage("ideaDeveloping")) {
      if (ideaData.status === STAGES.DROP) {
        alert(
          "해당 아이디어는 Drop 상태입니다. 다음 단계로 진행할 수 없습니다."
        );
      } else {
        alert(
          "이전 단계가 완료되지 않았습니다. 단계별로 순차적으로 진행해야 합니다."
        );
      }
      return;
    }

    navigate(`/ideaboard/gantt/${id}`);
  };

  // 단계별 스타일 클래스 결정 함수
  const getStageClass = (stage) => {
    console.log("현재 아이디어 상태:", ideaData.status, "요청 단계:", stage);

    // 아이디어가 Drop 상태인 경우
    if (ideaData.status === STAGES.DROP) {
      return "disabled";
    }

    // 상태에 따른 진행 단계 매핑
    const statusStageMap = {
      null: -1, // 초기 상태
      "": -1, // 초기 상태
      등록: 0, // 등록 완료
      선정: 1, // 선정 완료
      piloted: 2, // Pilot 완료
      ideaPilot: 2, // 이전 Pilot 상태값 (하위 호환성)
      verified: 3, // 검증 완료
      devReviewed: 4, // 개발자 검토 완료
      developing: 5, // 개발 진행 중
      completed: 6, // 완료
      drop: -2, // Drop 상태 (모든 진행 불가)
    };

    // 현재 상태의 단계 인덱스 찾기
    let currentStageIndex = 0;

    // 직접적인 상태 매핑 확인
    if (statusStageMap[ideaData.status] !== undefined) {
      currentStageIndex = statusStageMap[ideaData.status];
    }
    // 추가적인 상태 문자열 확인 (부분 일치)
    else if (ideaData.status.includes("선정")) {
      currentStageIndex = 1;
    } else if (/pilot/i.test(ideaData.status)) {
      currentStageIndex = 2;
    } else if (/verif/i.test(ideaData.status)) {
      currentStageIndex = 3;
    } else if (/review/i.test(ideaData.status)) {
      currentStageIndex = 4;
    } else if (/develop/i.test(ideaData.status)) {
      currentStageIndex = 5;
    } else if (/complete/i.test(ideaData.status)) {
      currentStageIndex = 6;
    }

    console.log(
      "현재 단계 인덱스:",
      currentStageIndex,
      "요청 단계 인덱스:",
      STAGE_ORDER[stage]
    );

    // 주어진 단계가 현재 상태보다 이전 단계인 경우 (이미 완료된 단계)
    if (
      STAGE_ORDER[stage] !== undefined &&
      STAGE_ORDER[stage] < currentStageIndex
    ) {
      console.log(`${stage} 단계는 완료된 단계입니다. 'active' 클래스 적용`);
      return "active"; // 완료된 단계는 등록 단계와 같은 색상(active)으로 표시
    }

    // 현재 상태와 같은 단계인 경우 active 클래스 반환
    if (
      (STAGE_ORDER[stage] !== undefined &&
        STAGE_ORDER[stage] === currentStageIndex) ||
      ideaData.status === stage ||
      (stage === "piloted" && /pilot/i.test(ideaData.status)) || // Pilot 단계 특별 처리
      (ideaData.status && ideaData.status.includes(stage))
    ) {
      console.log(`${stage} 단계는 현재 단계입니다. 'active' 클래스 적용`);
      return "active";
    }

    // 현재 상태보다 이후 단계이면서 진행 불가능한 단계
    const stageMap = {
      선정: "ideaSelected",
      piloted: "ideaPiloted",
      verified: "ideaVerify",
      devReviewed: "ideaDevReview",
      developing: "ideaDeveloping",
      completed: "ideaCompleted",
    };

    if (stageMap[stage] && !canProceedToStage(stageMap[stage])) {
      console.log(
        `${stage} 단계는 아직 진행할 수 없는 단계입니다. 'disabled' 클래스 적용`
      );
      return "disabled";
    }

    console.log(`${stage} 단계는 기본 스타일을 적용합니다.`);
    return "";
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
            <div className={`processItemTitle ${getStageClass("선정")}`}>
              선정
            </div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <CheckCircleIcon className="icons" />
                </div>
              </div>
            </div>
            <div className={`processItemContent ${getStageClass("선정")}`}>
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
            <div className={`processItemTitle ${getStageClass("piloted")}`}>
              Pilot
            </div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <ScienceIcon className="icons" />
                </div>
              </div>
            </div>
            <div className={`processItemContent ${getStageClass("piloted")}`}>
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
            <div className={`processItemTitle ${getStageClass("verified")}`}>
              검증
            </div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <VerifiedIcon className="icons" />
                </div>
              </div>
            </div>
            <div className={`processItemContent ${getStageClass("verified")}`}>
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
            <div className={`processItemTitle ${getStageClass("devReviewed")}`}>
              개발심의
            </div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <RateReviewIcon className="icons" />
                </div>
              </div>
            </div>
            <div
              className={`processItemContent ${getStageClass("devReviewed")}`}
            >
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
            <div className={`processItemTitle ${getStageClass("developing")}`}>
              개발중
            </div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <DeveloperModeIcon className="icons" />
                </div>
              </div>
            </div>
            <div
              className={`processItemContent ${getStageClass("developing")}`}
            >
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
            <div className={`processItemTitle ${getStageClass("completed")}`}>
              완료
            </div>
            <div className="lineBox">
              <div className="line">
                <div className="circle">
                  <TaskAltIcon className="icons" />
                </div>
              </div>
            </div>
            <div className={`processItemContent ${getStageClass("completed")}`}>
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
          <IdeaSelected
            onClose={() => setOpenModal(null)}
            ideaId={id}
            ideaData={ideaData}
            isViewMode={getStageIndex(ideaData.status) > STAGE_ORDER["선정"]}
          />
        )}
        {openModal === "ideaPiloted" && (
          <IdeaPilot
            onClose={() => setOpenModal(null)}
            ideaId={id}
            ideaData={ideaData}
            isViewMode={getStageIndex(ideaData.status) > STAGE_ORDER["piloted"]}
          />
        )}
        {openModal === "ideaVerify" && (
          <IdeaVerify
            onClose={() => setOpenModal(null)}
            ideaId={id}
            ideaData={ideaData}
            isViewMode={
              getStageIndex(ideaData.status) > STAGE_ORDER["verified"]
            }
          />
        )}
        {openModal === "ideaDevReview" && (
          <IdeaDevReview
            onClose={() => setOpenModal(null)}
            ideaId={id}
            ideaData={ideaData}
            isViewMode={
              getStageIndex(ideaData.status) > STAGE_ORDER["devReviewed"]
            }
          />
        )}
        {openModal === "ideaDeveloping" && (
          <IdeaDeveloping
            onClose={() => setOpenModal(null)}
            ideaId={id}
            ideaData={ideaData}
            isViewMode={
              getStageIndex(ideaData.status) > STAGE_ORDER["developing"]
            }
          />
        )}
        {openModal === "ideaCompleted" && (
          <IdeaCompleted
            onClose={() => setOpenModal(null)}
            ideaId={id}
            ideaData={ideaData}
            isViewMode={
              getStageIndex(ideaData.status) > STAGE_ORDER["completed"]
            }
          />
        )}
        {openModal === "ideaDrop" && (
          <IdeaDrop
            onClose={() => setOpenModal(null)}
            ideaId={id}
            ideaData={ideaData}
          />
        )}
      </div>
    </div>
  );
};

export default IdeaDesc;
