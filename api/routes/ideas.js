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
} from "../controllers/idea.js";

import {
  getIdeaDevelopers,
  registerIdeaDevReview,
  getIdeaDevReviewById,
  debugMssqlConnection,
} from "../controllers/ideaDevelopers.js";

const router = express.Router();

router.post("/register", registerIdea);
router.post("/selection/:idea_id", registerSelectedIdea);
router.post("/verify", registerIdeaVerify);
router.post("/verify/department", registerDepartmentVerify);
router.post("/verify/ai", registerAIVerify);
router.post("/pilot/:idea_id", registerIdeaPilot);
router.post("/devreview", registerIdeaDevReview);
router.get("/devreview/:idea_id", getIdeaDevReviewById);
router.get("/pilot/:id", getPilotDataById);
router.get("/selection/:idea_id", getSelectedIdea);
router.get("/verify/:id", getIdeaVerifyById);
router.get("/developers", getIdeaDevelopers);
router.get("/debug-mssql", debugMssqlConnection);
router.get("/", getIdeas);
router.get("/:id", getIdeaById);

export default router; //test
