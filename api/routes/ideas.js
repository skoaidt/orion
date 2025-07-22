import express from "express";
import {
  registerIdea,
  getIdeas,
  getIdeaById,
  registerSelectedIdea,
  getSelectedIdea,
  registerIdeaVerify,
  getIdeaVerifyById,
  registerDepartmentVerify,
  registerAIVerify,
  registerIdeaPilot,
  getPilotDataById,
  getTeam,
  updateIdea,
  deleteIdea,
  addComment,
  getComments,
  deleteComment,
  logIdeaView,
  getIdeaViewCount,
  getAllIdeaViewCounts,
  updateIdeaStatus,
  registerSecurityCode,
  registerSecurityInfra,
  getSecurityData,
} from "../controllers/idea.js";

import {
  getIdeaDevelopers,
  registerIdeaDevReview,
  getIdeaDevReviewById,
  debugMssqlConnection,
} from "../controllers/ideaDevelopers.js";

const router = express.Router();

router.post("/register", registerIdea);
router.put("/:id", updateIdea);
router.delete("/:id", deleteIdea);
router.post("/selection/:idea_id", registerSelectedIdea);
router.get("/selection/:idea_id", getSelectedIdea);
router.post("/verify", registerIdeaVerify);
router.post("/verify/department", registerDepartmentVerify);
router.post("/verify/ai", registerAIVerify);
router.post("/pilot/:idea_id", registerIdeaPilot);
router.post("/devreview", registerIdeaDevReview);
router.get("/devreview/:idea_id", getIdeaDevReviewById);
router.get("/pilot/:id", getPilotDataById);
router.get("/verify/:id", getIdeaVerifyById);
router.get("/developers", getIdeaDevelopers);
router.get("/debug-mssql", debugMssqlConnection);
router.get("/teams", getTeam);

// 보안진단 관련 라우트 추가
router.post("/security-code/:idea_id", registerSecurityCode);
router.post("/security-infra/:idea_id", registerSecurityInfra);
router.get("/security/:idea_id", getSecurityData);

// 댓글 관련 라우트 추가
router.post("/comments", addComment);
router.get("/comments/:ideaId", getComments);
router.delete("/comments/:commentId", deleteComment);

// 조회 로그 관련 라우트 추가
router.post("/log-view", logIdeaView);

// 조회수 관련 라우트 추가
router.get("/viewcount/:ideaId", getIdeaViewCount);
router.get("/viewcounts", getAllIdeaViewCounts);

router.get("/", getIdeas);
router.get("/:id", getIdeaById);
router.put("/status/:id", updateIdeaStatus);

router.post("/api/ideas/devreview", async (req, res) => {
  try {
    const {
      ideaID,
      developers,
      startDate,
      endDate,
      priority,
      isUpdate,
      deleteExistingData,
    } = req.body;

    // isUpdate와 deleteExistingData가 true인 경우 기존 데이터 삭제 로직은 별도 API로 처리
    // 여기서는 새로운 데이터 등록에 집중

    // 성공한 등록 개수 추적
    let successCount = 0;

    // 각 개발자에 대해 레코드 추가
    for (const developer of developers) {
      await db.query(
        "INSERT INTO ITAsset_ideaDevReview (idea_id, n_id, name, team, headqt, devScheduleStart, devScheduleEnd, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          ideaID,
          developer.no, // n_id
          developer.name,
          developer.team,
          developer.headqt,
          startDate,
          endDate,
          priority,
        ]
      );
      successCount++;
    }

    res.status(200).json({
      success: true,
      message: `${
        isUpdate ? "업데이트" : "등록"
      } 성공: ${successCount}명의 개발자가 추가되었습니다.`,
    });
  } catch (error) {
    console.error("개발심의 등록 오류:", error);
    res.status(500).json({
      success: false,
      error: "개발심의 정보 등록 중 오류가 발생했습니다.",
    });
  }
});

export default router; //test
