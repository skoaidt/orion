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

export default router; //test
