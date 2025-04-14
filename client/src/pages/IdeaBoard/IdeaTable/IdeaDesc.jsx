import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import "./ideaDesc.scss";

import IdeaRegister from "../IdeaModal/IdeaRegister";
import DescComments from "./DescComments";
import DescProcess from "./DescProcess";
import StreetviewIcon from "@mui/icons-material/Streetview";
import ChatIcon from "@mui/icons-material/Chat";


const IdeaDesc = () => {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
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
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);

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

  // 상태 변경 후 데이터 갱신을 위한 함수
  const handleIdeaStatusChange = () => {
    console.log("아이디어 상태가 변경되었습니다. 데이터를 다시 불러옵니다.");
    fetchIdeaData();
  };

  // 조회 로그 기록 함수 추가
  const logIdeaView = async () => {
    if (!currentUser) return;
    // 로그인하지 않은 사용자는 기록하지 않음

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
      fetchViewCount(); // 조회수도 함께 로드
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 로그 기록은 별도 useEffect로 분리하여 한 번만 실행되도록 함
  useEffect(() => {
    if (id && currentUser) {
      // 컴포넌트가 마운트된 후에만 로그 기록
      logIdeaView();
    }
  }, [id, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
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

  // 수정, 삭제 버튼 표시 여부를 결정하는 함수 추가
  const isAuthor = () => {
    console.log("현재 로그인한 사용자:", currentUser.userId);
    console.log("아이디어 작성자:", ideaData.user_id);
    // 로그인하지 않았거나 작성자 정보가 없는 경우 false 반환
    if (!currentUser || !ideaData.user_id) return false;

    // 현재 로그인한 사용자의 사번(userId)과 아이디어 작성자의 사번(n_id) 비교
    return currentUser.userId === ideaData.user_id;
  };

  // 댓글 수 업데이트 함수
  const handleCommentsUpdate = (count) => {
    setCommentCount(count);
  };

  if (loading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="ideaDesc">
      <div className="ideaDescWrap">
        <div className="ideaDescBtn">
          <div className="left">
            {isAuthor() && (
              <>
                <button onClick={handleEditClick}>수정</button>
                <button onClick={handleDeleteClick}>삭제</button>
              </>
            )}
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
            <div className="commentsCount">{commentCount}</div>
          </div>
        </div>

        <div className="gap-20"></div>
        <DescComments onCommentsUpdate={handleCommentsUpdate} />

        <div className="gap-20"></div>
        <div className="ideaDescBtn">
          <div className="left">
            {isAuthor() && (
              <>
                <button onClick={handleEditClick}>수정</button>
                <button onClick={handleDeleteClick}>삭제</button>
              </>
            )}
          </div>
          <div className="right">
            <Link to="/ideaboard">
              <button>목록</button>
            </Link>
          </div>
        </div>
      </div>

      <DescProcess
        ideaData={ideaData}
        onStatusChange={handleIdeaStatusChange}
      />
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

export default IdeaDesc;
