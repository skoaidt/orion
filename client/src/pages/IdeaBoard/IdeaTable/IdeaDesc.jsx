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
              <div className="idNo">NO: {id}</div>
              <div className="bizCategory">[사업분야] Access </div>
              <div className="workflCategory">[업무분야] RM </div>
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
            이수시간 관리 등 건강도 체크기능 고도화필요(모바일화)
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
      </div>
      <div className="ideaProcess">
        <div className="processTitle">진행 현황</div>
        <hr style={{ margin: "10px 0", width: "100%", color: "#8c8c8c" }} />

        <div className="register">등록</div>

        <div
          className="processBox"
          onClick={() => handleBoxClick("ideaSelected")}
        >
          선정
        </div>
        <div
          className="processBox"
          onClick={() => handleBoxClick("ideaPiloted")}
        >
          Pilot
        </div>
        <div
          className="processBox"
          onClick={() => handleBoxClick("ideaVerify")}
        >
          검증
        </div>
        <div
          className="processBox"
          onClick={() => handleBoxClick("ideaDevReview")}
        >
          개발심의
        </div>
        <div
          className="processBox"
          onClick={() => handleBoxClick("ideaDeveloping")}
        >
          개발중
        </div>
        <div
          className="processBox"
          onClick={() => handleBoxClick("ideaCompleted")}
        >
          완료
        </div>
        <div className="processBox" onClick={() => handleBoxClick("ideaDrop")}>
          Drop
        </div>
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
