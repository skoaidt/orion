import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../../../utils/dateUtils";
import IdeaSelected from "../IdeaModal/IdeaSelected";
import IdeaPilot from "../IdeaModal/IdeaPilot";
import IdeaVerify from "../IdeaModal/IdeaVerify";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScienceIcon from "@mui/icons-material/Science";
import VerifiedIcon from "@mui/icons-material/Verified";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import "./ideaDesc.scss";

const IdeaProcess = () => {
  return (
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
                    style={{
                      fontSize: "13px",
                      fontWeight: "300",
                      marginBottom: "3px",
                    }}
                  >
                    {getVerifyStatusText(
                      "선정",
                      ideaData.VerifyDepartment || "부서"
                    )}
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
          onClick={() => handleBoxClick("ideaPiloted")}
        >
          <div className={`processItemTitle ${getStageClass("pilot")}`}>
            Pilot
          </div>
          <div className="lineBox">
            <div className="line">
              <div className="circle">
                <ScienceIcon className="icons" />
              </div>
            </div>
          </div>
          <div className={`processItemContent ${getStageClass("pilot")}`}>
            <div className="itemcontentWrap">
              <div className="left">
                <div className="userInfo">
                  <div
                    className="processItemContentTitle"
                    style={{ fontSize: "13px", fontWeight: "300" }}
                  >
                    {getVerifyStatusText(
                      "pilot",
                      ideaData.dept_name || "소속부서"
                    )}
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
                    {getVerifyStatusText(
                      "verified",
                      ideaData.VerifyDepartment || "검증부서"
                    )}
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
          <div className={`processItemContent ${getStageClass("devReviewed")}`}>
            <div className="itemcontentWrap">
              <div className="left">
                <div className="userInfo">
                  <div
                    className="processItemContentTitle"
                    style={{ fontSize: "13px", fontWeight: "300" }}
                  >
                    {getVerifyStatusText("devReviewed", "개발심의")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="processBox">
        <div className="processItem" onClick={handleKanbanNavigate}>
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
          <div className={`processItemContent ${getStageClass("developing")}`}>
            <div className="itemcontentWrap">
              <div className="left">
                <div className="userInfo">
                  <div
                    className="processItemContentTitle"
                    style={{ fontSize: "13px", fontWeight: "300" }}
                  >
                    {getVerifyStatusText("developing", "개발")}
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
                    {getVerifyStatusText("completed", "서비스")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr style={{ margin: "20px 0", color: "#8c8c8c" }} />
      <div className="processBox">
        <div className="processItem" onClick={() => handleBoxClick("ideaDrop")}>
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
          isViewMode={getStageIndex(ideaData.status) > STAGE_ORDER["pilot"]}
        />
      )}
      {openModal === "ideaVerify" && (
        <IdeaVerify
          onClose={() => setOpenModal(null)}
          ideaId={id}
          ideaData={ideaData}
          isViewMode={getStageIndex(ideaData.status) > STAGE_ORDER["verified"]}
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
      {openModal === "ideaCompleted" && (
        <IdeaCompleted
          onClose={() => setOpenModal(null)}
          ideaId={id}
          ideaData={ideaData}
          isViewMode={getStageIndex(ideaData.status) > STAGE_ORDER["completed"]}
        />
      )}
      {openModal === "ideaDrop" && (
        <IdeaDrop
          onClose={() => setOpenModal(null)}
          ideaId={id}
          ideaData={ideaData}
        />
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
  );
};

export default IdeaProcess;
