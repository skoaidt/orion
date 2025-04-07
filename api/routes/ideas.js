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
  getTeam,
  updateIdea,
  deleteIdea,
  addComment,
  getComments,
  deleteComment,
} from "../controllers/idea.js";

import {
  getIdeaDevelopers,
  registerIdeaDevReview,
  debugMssqlConnection,
} from "../controllers/ideaDevelopers.js";

const router = express.Router();

router.post("/register", registerIdea);
router.put("/:id", updateIdea);
router.delete("/:id", deleteIdea);
router.post("/selection/:ideaId", registerSelectedIdea);
router.get("/selection/:ideaId", getSelectedIdea);
router.post("/verify", registerIdeaVerify);
router.post("/verify/department", registerDepartmentVerify);
router.post("/verify/ai", registerAIVerify);
router.post("/pilot", registerIdeaPilot);
router.post("/devreview", registerIdeaDevReview);
router.get("/verify/:id", getIdeaVerifyById);
router.get("/developers", getIdeaDevelopers);
router.get("/debug-mssql", debugMssqlConnection);
router.get("/teams", getTeam);

// 댓글 관련 라우트 추가
router.post("/comments", addComment);
router.get("/comments/:ideaId", getComments);
router.delete("/comments/:commentId", deleteComment);

router.get("/", getIdeas);
router.get("/:id", getIdeaById);

export default router; //test
