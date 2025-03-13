import React from "react";
import { useParams } from "react-router-dom";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import "./ideaDesc.scss";

const IdeaDesc = () => {
  const { id } = useParams();

  return (
    <div className="ideaDesc">
      <div className="ideaDescWrap">
        <div className="ideaDescBtn">
          <div className="left">
            <button>수정</button>
            <button>삭제</button>
          </div>
          <div className="right">
            <button>목록</button>
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
      </div>
    </div>
  );
};

export default IdeaDesc;
