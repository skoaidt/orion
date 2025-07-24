import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ideaDesc.scss";

import IdeaSelected from "../IdeaModal/IdeaSelected";
import IdeaPilot from "../IdeaModal/IdeaPilot";
import IdeaVerify from "../IdeaModal/IdeaVerify";
import IdeaDevReview from "../IdeaModal/IdeaDevReview";
import IdeaCompleted from "../IdeaModal/IdeaCompleted";
import IdeaDrop from "../IdeaModal/IdeaDrop";
import IdeaRegister from "../IdeaModal/IdeaRegister";
import SecurityCode from "../IdeaModal/SecurityCode";
import SecurityInfra from "../IdeaModal/SecurityInfra";
import PropTypes from "prop-types";

import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScienceIcon from "@mui/icons-material/Science";
import VerifiedIcon from "@mui/icons-material/Verified";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import SecurityIcon from "@mui/icons-material/Security";
import HttpsIcon from "@mui/icons-material/Https";

// formatDate 함수 직접 정의
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
};

// 상태값 상수 정의
const STAGES = {
  INITIAL: "", // 초기 상태
  REGISTER: "등록", // 등록 완료
  SELECTION: "선정", // 선정 완료
  PILOT: "pilot", // 파일럿 완료
  VERIFY: "verified", // 검증 완료
  DEV_REVIEW: "devReviewed", // 개발자 검토 완료
  DEVELOPING: "developing", // 개발 진행 중
  DEV_COMPLETE: "devComplete", // 개발 완료
  SECURITY_CODE: "securityCode", // 소스코드 보안진단 완료
  SECURITY_INFRA: "securityInfra", // 인프라 보안 진단 완료
  COMPLETED: "sol등록완료", // 완료
  DROP: "Drop", // Drop 상태 (첫 글자 대문자로 수정)
};

// 단계 순서 정의 (인덱스가 작을수록 먼저 진행되는 단계)
const STAGE_ORDER = {
  등록: 0,
  선정: 1,
  pilot: 2,
  verified: 3,
  devReviewed: 4,
  developing: 5,
  devComplete: 6,
  securityCode: 7,
  securityInfra: 8,
  sol등록완료: 9,
};

const DescProcess = ({ ideaData: propIdeaData, onStatusChange }) => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ideaData, setIdeaData] = useState(propIdeaData || null);
  const [loading, setLoading] = useState(!propIdeaData);
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false);
  const [showSecurityInfraModal, setShowSecurityInfraModal] = useState(false);
  const navigate = useNavigate();

  // API 호출하는 함수를 useCallback으로 감싸기
  const fetchIdeaData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/ideas/${id}`);
      setIdeaData(response.data);
    } catch (error) {
      console.error("아이디어 상세 정보 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // propIdeaData 변경 시 상태 업데이트
  useEffect(() => {
    if (propIdeaData) {
      setIdeaData(propIdeaData);
      setLoading(false);
    }
  }, [propIdeaData]);

  // 컴포넌트가 마운트되었을 때 데이터가 없는 경우에만 가져오기
  useEffect(() => {
    if (!propIdeaData && id) {
      fetchIdeaData();
    }
  }, [fetchIdeaData, propIdeaData, id]);

  // 아이디어 상태에 따른 스테이지 인덱스 확인 함수
  const getStageIndex = (status) => {
    // 상태에 따른 스테이지 매핑 수정
    const statusStageMap = {
      null: 0, // 초기 상태
      "": 0, // 초기 상태
      등록: 0, // 등록 완료
      선정: 1,
      파일럿: 2,
      검증: 3,
      개발심의: 4,
      개발중: 5,
      개발완료: 6,
      소스코드보안진단완료: 7,
      인프라보안진단완료: 8,
      sol등록완료: 9,
      Drop: -1,
      // 이전 영문 상태값도 호환성을 위해 유지
      selected: 1,
      pilot: 2,
      verified: 3,
      devReviewed: 4,
      developing: 5,
      devComplete: 6,
      securityCode: 7,
      securityInfra: 8,
      complete: 9,
    };

    if (statusStageMap[status] !== undefined) {
      return statusStageMap[status];
    }
    // 추가적인 상태 문자열 확인 (부분 일치)
    else if (status && status.includes("선정")) {
      return 1;
    } else if (status && /pilot/i.test(status)) {
      return 2;
    } else if (status && /verif/i.test(status)) {
      return 3;
    } else if (status && /review/i.test(status)) {
      return 4;
    } else if (status && /develop/i.test(status)) {
      return 5;
    } else if (status && /devComplete/i.test(status)) {
      return 6;
    } else if (status && /securityCode/i.test(status)) {
      return 7;
    } else if (status && /securityInfra/i.test(status)) {
      return 8;
    } else if (status && /sol/i.test(status)) {
      return 9;
    }

    return -1; // 알 수 없는 상태
  };

  // 단계 클릭 처리 함수
  const handleBoxClick = (modalType) => {
    if (!ideaData) return;

    // STAGES 상수에서 정의한 상태값과 모달 타입 매핑
    const modalToStageMap = {
      ideaSelected: "선정",
      ideaPiloted: "pilot",
      ideaVerify: "verified",
      ideaDevReview: "devReviewed",
      ideaDeveloping: "developing",
      ideaDevComplete: "devComplete",
      ideaSecurityCode: "securityCode",
      ideaSecurityInfra: "securityInfra",
      ideaCompleted: "sol등록완료",
      ideaDrop: "drop",
    };

    // 현재 단계의 스테이지 값 가져오기
    const currentStage = modalToStageMap[modalType];

    // 현재 상태와 요청 단계 비교
    const isCompletedStage =
      STAGE_ORDER[currentStage] < getStageIndex(ideaData.status);

    // 이미 완료된 단계인 경우 모달을 바로 열어 저장된 값 확인
    if (isCompletedStage) {
      setOpenModal(modalType);
      return;
    }

    // 특별 처리: 선정 단계는 언제든지 접근 가능
    if (modalType === "ideaSelected") {
      setOpenModal(modalType);
      return;
    }

    // 특별 처리: Pilot 단계 접근 - 선정 단계 이상
    if (modalType === "ideaPiloted" && getStageIndex(ideaData.status) >= 1) {
      setOpenModal(modalType);
      return;
    }

    // 특별 처리: 검증 단계 접근 - Pilot 단계 이상
    if (modalType === "ideaVerify" && getStageIndex(ideaData.status) >= 2) {
      setOpenModal(modalType);
      return;
    }

    // 특별 처리: 개발심의 단계 접근 - 검증 단계 이상
    if (modalType === "ideaDevReview" && getStageIndex(ideaData.status) >= 3) {
      setOpenModal(modalType);
      return;
    }

    // 특별 처리: 개발중 단계 접근 - 개발심의 단계 이상
    if (modalType === "ideaDeveloping" && getStageIndex(ideaData.status) >= 4) {
      setOpenModal(modalType);
      return;
    }

    // 특별 처리: 완료 단계 접근 - 개발중 단계 이상
    if (
      (modalType === "ideaDevComplete" || modalType === "ideaCompleted") &&
      getStageIndex(ideaData.status) >= 5
    ) {
      setOpenModal(modalType);
      return;
    }

    // 특별 처리: Drop 단계는 언제든지 접근 가능
    if (modalType === "ideaDrop") {
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
        alert(
          "이전 단계가 완료되지 않았습니다. 단계별로 순차적으로 진행해야 합니다."
        );
      }
      return;
    }

    setOpenModal(modalType);
  };

  // 단계 진행 가능 여부 확인 함수
  const canProceedToStage = (stage) => {
    // 필요한 데이터가 없을 경우 진행 불가
    if (!ideaData) return false;

    // Drop 상태인 경우, 특별 처리
    if (ideaData.status === STAGES.DROP) {
      // Drop 단계는 항상 접근 가능
      if (stage === "ideaDrop") return true;

      // 이전 단계를 로컬 스토리지에서 가져오기
      const dropStageIndex = parseInt(
        localStorage.getItem("dropStageIndex") || "0"
      );

      // STAGES 상수에서 정의한 상태값과 모달 타입 매핑
      const modalToStageMap = {
        ideaSelected: 1, // 선정
        ideaPiloted: 2, // pilot
        ideaVerify: 3, // 검증
        ideaDevReview: 4, // 개발심의
        ideaDeveloping: 5, // 개발중
        ideaDevComplete: 6, // 개발완료
        ideaSecurityCode: 7, // 소스코드 보안진단 완료
        ideaSecurityInfra: 8, // 인프라 보안 진단 완료
        ideaCompleted: 9, // 최종완료
      };

      // 요청된 단계의 인덱스
      const requestedStageIndex = modalToStageMap[stage];

      // Drop 이전 단계까지만 접근 가능
      if (requestedStageIndex && requestedStageIndex <= dropStageIndex) {
        return true;
      }
      return false;
    }

    // 현재 상태의 단계 인덱스 구하기
    const currentStageIndex = getStageIndex(ideaData.status);
    // console.log("현재 단계 인덱스:", currentStageIndex);

    // 각 단계별 진행 가능 조건 정의
    switch (stage) {
      case "ideaSelected": // 선정 단계
        // 선정 단계는 언제든지 접근 가능하도록 설정 (등록 상태 이상)
        return true;

      case "ideaPiloted": // Pilot 단계
        // 선정 단계를 거친 경우 또는 이미 그 이상 단계인 경우 진행 가능
        return currentStageIndex >= 1; // 선정 이상

      case "ideaVerify": // 검증 단계
        // Pilot 단계를 거친 경우 또는 이미 그 이상 단계인 경우 진행 가능
        return currentStageIndex >= 2; // 파일럿 이상

      case "ideaDevReview": // 개발 심의 단계
        // 검증 단계를 거친 경우 또는 이미 그 이상 단계인 경우 진행 가능
        return currentStageIndex >= 3; // 검증 이상

      case "ideaDeveloping": // 개발중 단계
        // 개발 심의 단계를 거친 경우 또는 이미 그 이상 단계인 경우 진행 가능
        return currentStageIndex >= 4; // 개발심의 이상

      case "ideaDevComplete": // 개발완료 단계
        // 개발중 단계를 거친 경우 또는 이미 그 이상 단계인 경우 진행 가능
        return currentStageIndex >= 5; // 개발중 이상

      case "ideaCompleted": // 최종 완료 단계
        // 개발중 단계를 거친 경우 또는 이미 그 이상 단계인 경우 진행 가능
        return currentStageIndex >= 6; // 개발완료 이상

      case "ideaSecurityCode": // 소스코드 보안진단 완료 단계
        // 개발완료 단계를 거친 경우 또는 이미 그 이상 단계인 경우 진행 가능
        return currentStageIndex >= 7; // 소스코드 보안진단 완료 이상

      case "ideaSecurityInfra": // 인프라 보안 진단 완료 단계
        // 소스코드 보안진단 완료 단계를 거친 경우 또는 이미 그 이상 단계인 경우 진행 가능
        return currentStageIndex >= 8; // 웹 보안 진단 완료 이상

      case "ideaDrop": // Drop 단계
        return true; // Drop은 언제든지 가능

      default:
        return false;
    }
  };

  // 단계별 스타일 클래스 결정 함수
  const getStageClass = (stage) => {
    if (!ideaData) return "";

    // 현재 단계의 인덱스 (0-7)
    const currentStageIndex = getStageIndex(ideaData.status);

    // 요청된 단계의 인덱스 (0-7)
    const requestedStageIndex = STAGE_ORDER[stage];

    // Drop 상태일 때 특별 처리
    if (ideaData.status === STAGES.DROP) {
      // 이전 단계 정보 가져오기
      const dropStageIndex = parseInt(
        localStorage.getItem("dropStageIndex") || "0"
      );

      // Drop 단계는 항상 활성화
      if (stage === "drop") {
        return "active";
      }

      // Drop 이전 단계까지는 활성화
      if (
        requestedStageIndex !== undefined &&
        requestedStageIndex <= dropStageIndex
      ) {
        return "active";
      }

      // Drop 이후 단계는 비활성화
      return "disabled";
    }

    // 이미 완료된 단계 (현재 단계보다 이전 단계)
    if (
      requestedStageIndex !== undefined &&
      requestedStageIndex < currentStageIndex
    ) {
      return "active"; // 완료된 단계는 active로 표시
    }

    // 현재 진행 중인 단계
    if (
      requestedStageIndex !== undefined &&
      requestedStageIndex === currentStageIndex
    ) {
      return "active"; // 현재 단계도 active로 표시
    }

    // 다음에 진행할 수 있는 단계 (현재 단계 바로 다음 단계)
    if (
      requestedStageIndex !== undefined &&
      requestedStageIndex === currentStageIndex + 1
    ) {
      // 특별 케이스: Drop은 항상 접근 가능
      if (stage === "drop") {
        return ""; // 기본 스타일 (접근 가능)
      }
      return ""; // 기본 스타일 (접근 가능)
    }

    // 아직 진행할 수 없는 단계 (현재 단계보다 2개 이상 앞선 단계)
    if (
      requestedStageIndex !== undefined &&
      requestedStageIndex > currentStageIndex + 1
    ) {
      return "disabled"; // 비활성화된 스타일
    }

    // 그 외 상태
    return "";
  };

  // 상태에 따른 검증 상태 텍스트 반환 함수
  const getVerifyStatusText = (stage, stageText) => {
    if (!ideaData) return "";

    // 특별 단계에 대한 처리 (개발심의, 개발중, 개발완료, 최종완료)
    if (stage === "devReviewed") {
      const currentStageIndex = getStageIndex(ideaData.status);
      if (currentStageIndex >= STAGE_ORDER["devReviewed"]) {
        return "개발 심의 완료";
      } else {
        return "개발 심의 필요";
      }
    }

    if (stage === "developing") {
      const currentStageIndex = getStageIndex(ideaData.status);
      if (currentStageIndex >= STAGE_ORDER["developing"]) {
        if (currentStageIndex >= STAGE_ORDER["devComplete"]) {
          return "개발 완료";
        }
        return "개발 진행중";
      } else {
        return "개발 대기중";
      }
    }

    if (stage === "securityCode") {
      const currentStageIndex = getStageIndex(ideaData.status);
      if (currentStageIndex >= STAGE_ORDER["securityCode"]) {
        return "1차 보안 : 소스코드 보안진단 완료";
      }
      return "1차 보안 : 소스코드 보안진단 필요";
    }

    if (stage === "securityInfra") {
      const currentStageIndex = getStageIndex(ideaData.status);
      if (currentStageIndex >= STAGE_ORDER["securityInfra"]) {
        return "2차 보안 : Infra 보안진단 완료";
      }
      return "2차 보안 : Infra 보안진단 필요";
    }

    if (stage === "completed") {
      const currentStageIndex = getStageIndex(ideaData.status);
      if (currentStageIndex >= STAGE_ORDER["sol등록완료"]) {
        return "Solution 등록 완료";
      } else if (currentStageIndex >= STAGE_ORDER["devComplete"]) {
        return "Solution 등록 필요";
      } else {
        return "개발 완료된 Solution 등록필요";
      }
    }

    // 나머지 단계들에 대한 기존 처리 로직
    const currentStageIndex = getStageIndex(ideaData.status);
    const stageIndex = STAGE_ORDER[stage];

    // 현재 상태의 인덱스가 해당 단계의 인덱스보다 크거나 같으면 해당 단계는 완료된 상태
    if (currentStageIndex >= stageIndex) {
      return `${stageText} 검증 완료`;
    } else {
      return `${stageText} 검증 필요`;
    }
  };

  // 칸반 보드 페이지로 이동 (원래의 handleKanbanNavigate 역할 복원)
  const handleKanbanNavigate = () => {
    if (!ideaData) return;

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

    navigate(`/ideaboard/kanban/${id}`);
  };

  // 모달 닫기 및 데이터 새로고침 처리
  const handleCloseModal = (viewModeState) => {
    // 현재 열린 모달이 ideaPiloted 일 때 viewMode 상태를 로컬 스토리지에 저장
    if (openModal === "ideaPiloted" && viewModeState !== undefined) {
      localStorage.setItem(
        `ideaPilot_viewMode_${id}`,
        viewModeState.toString()
      );
      // console.log(`파일럿 viewMode 상태 저장: ${viewModeState}`);
    }

    // Drop 모달이 닫힐 때 이전 단계 정보 저장
    if (openModal === "ideaDrop") {
      // 아이디어가 Drop 상태로 변경되기 전의 상태 단계 저장
      const currentStageIndex = getStageIndex(ideaData.status);
      if (currentStageIndex >= 0) {
        // -1이 아닌 경우만 저장 (이미 Drop이 아닌 경우만)
        localStorage.setItem("dropStageIndex", currentStageIndex.toString());
        console.log("Drop 전 단계 저장:", currentStageIndex);
      }
    }

    setOpenModal(null);

    // 모달이 닫힐 때 부모 컴포넌트에 상태 변경 알림
    if (onStatusChange) {
      onStatusChange();
    }

    // 자체적으로도 데이터 다시 가져오기
    fetchIdeaData();
  };

  // 수정 모달 닫기 처리
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    // 수정 모달이 닫힐 때 데이터 다시 불러오기
    fetchIdeaData();

    // 부모 컴포넌트에 상태 변경 알림
    if (onStatusChange) {
      onStatusChange();
    }
  };

  // 보안진단 모달 닫기 및 데이터 새로고침 처리
  const handleCloseSecurityCodeModal = (shouldRefresh) => {
    setShowSecurityCodeModal(false);

    // 등록이 완료된 경우 데이터 새로고침
    if (shouldRefresh) {
      console.log("소스코드 보안진단 완료 - 데이터 새로고침");
      fetchIdeaData();

      // 부모 컴포넌트에 상태 변경 알림
      if (onStatusChange) {
        onStatusChange();
      }
    }
  };

  const handleCloseSecurityInfraModal = (shouldRefresh) => {
    setShowSecurityInfraModal(false);

    // 등록이 완료된 경우 데이터 새로고침
    if (shouldRefresh) {
      console.log("인프라 보안진단 완료 - 데이터 새로고침");
      fetchIdeaData();

      // 부모 컴포넌트에 상태 변경 알림
      if (onStatusChange) {
        onStatusChange();
      }
    }
  };

  if (loading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  if (!ideaData) {
    return <div>아이디어 정보를 가져올 수 없습니다.</div>;
  }

  return (
    <div className="ideaProcess">
      <div className="processTitle">진행 현황</div>
      <hr style={{ margin: "10px 0", width: "100%", color: "#8c8c8c" }} />

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
            {getStageIndex(ideaData.status) >= 6 ? "개발완료" : "개발중"}
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
          onClick={() => setShowSecurityCodeModal(true)}
          style={{ cursor: "pointer" }}
        >
          <div className={`processItemTitle ${getStageClass("securityCode")}`}>
            {getStageIndex(ideaData.status) >= 7
              ? "소스코드\n진단완료"
              : "소스코드\n진단필요"}
          </div>
          <div className="lineBox">
            <div className="line">
              <div className="circle">
                <SecurityIcon className="icons" />
              </div>
            </div>
          </div>
          <div
            className={`processItemContent ${getStageClass("securityCode")}`}
          >
            <div className="itemcontentWrap">
              <div className="left">
                <div className="userInfo">
                  <div
                    className="processItemContentTitle"
                    style={{ fontSize: "13px", fontWeight: "300" }}
                  >
                    {getVerifyStatusText("securityCode", "소스코드보안진단")}
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
          onClick={() => setShowSecurityInfraModal(true)}
          style={{ cursor: "pointer" }}
        >
          <div className={`processItemTitle ${getStageClass("securityInfra")}`}>
            {getStageIndex(ideaData.status) >= 8
              ? "Infra보안\n진단완료"
              : "Infra보안\n진단필요"}
          </div>
          <div className="lineBox">
            <div className="line">
              <div className="circle">
                <HttpsIcon className="icons" />
              </div>
            </div>
          </div>
          <div
            className={`processItemContent ${getStageClass("securityInfra")}`}
          >
            <div className="itemcontentWrap">
              <div className="left">
                <div className="userInfo">
                  <div
                    className="processItemContentTitle"
                    style={{ fontSize: "13px", fontWeight: "300" }}
                  >
                    {getVerifyStatusText("securityInfra", "인프라보안진단")}
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
            최종완료
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
          <div
            className={`processItemTitle ${
              ideaData.status &&
              ideaData.status.toLowerCase() === STAGES.DROP.toLowerCase()
                ? "active"
                : ""
            }`}
          >
            Drop
          </div>
          <div className="lineBox dropLineBox">
            <div className="line dropLine">
              <div className="circle">
                <CancelIcon className="icons" />
              </div>
            </div>
          </div>
          <div
            className={`processItemContent ${
              ideaData.status &&
              ideaData.status.toLowerCase() === STAGES.DROP.toLowerCase()
                ? "active"
                : ""
            }`}
          >
            <div className="itemcontentWrap">
              <div className="left">
                <div className="userInfo">
                  <div
                    className="processItemContentTitle"
                    style={{ fontSize: "13px", fontWeight: "300" }}
                  >
                    {ideaData.status &&
                    ideaData.status.toLowerCase() === STAGES.DROP.toLowerCase()
                      ? "Drop 사유를 확인하세요"
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal === "ideaSelected" && (
        <IdeaSelected
          onClose={handleCloseModal}
          ideaId={id}
          ideaData={ideaData}
          isViewMode={getStageIndex(ideaData.status) > STAGE_ORDER["선정"]}
        />
      )}
      {openModal === "ideaPiloted" && (
        <IdeaPilot
          onClose={handleCloseModal}
          ideaId={id}
          ideaData={ideaData}
          isViewMode={getStageIndex(ideaData.status) > STAGE_ORDER["pilot"]}
        />
      )}
      {openModal === "ideaVerify" && (
        <IdeaVerify
          onClose={handleCloseModal}
          ideaId={id}
          ideaData={ideaData}
          isViewMode={getStageIndex(ideaData.status) > STAGE_ORDER["verified"]}
        />
      )}
      {openModal === "ideaDevReview" && (
        <IdeaDevReview
          onClose={handleCloseModal}
          ideaId={id}
          ideaData={ideaData}
          isViewMode={
            getStageIndex(ideaData.status) > STAGE_ORDER["devReviewed"]
          }
        />
      )}
      {openModal === "ideaCompleted" && (
        <IdeaCompleted
          onClose={handleCloseModal}
          ideaId={id}
          ideaData={ideaData}
          isViewMode={getStageIndex(ideaData.status) > STAGE_ORDER["completed"]}
        />
      )}
      {openModal === "ideaDrop" && (
        <IdeaDrop onClose={handleCloseModal} ideaId={id} ideaData={ideaData} />
      )}

      {showEditModal && (
        <IdeaRegister
          onClose={handleCloseEditModal}
          editMode={true}
          ideaData={ideaData}
          onUpdate={fetchIdeaData}
        />
      )}

      {/* 코드보안진단 모달 */}
      {showSecurityCodeModal && (
        <SecurityCode
          onClose={handleCloseSecurityCodeModal}
          ideaId={id}
          isViewMode={getStageIndex(ideaData.status) >= 7}
        />
      )}

      {/* 웹보안진단 모달 */}
      {showSecurityInfraModal && (
        <SecurityInfra
          onClose={handleCloseSecurityInfraModal}
          ideaId={id}
          isViewMode={getStageIndex(ideaData.status) >= 8}
        />
      )}
    </div>
  );
};

DescProcess.propTypes = {
  ideaData: PropTypes.object,
  onStatusChange: PropTypes.func,
};

export default DescProcess;
