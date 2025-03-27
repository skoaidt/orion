import express from "express";
import {
  registerIdea,
  getIdeas,
  getIdeaById,
  registerSelectedIdea,
  registerIdeaVerify,
  getIdeaVerifyById,
  registerDepartmentVerify,
  registerAIVerify,
  registerIdeaPilot,
  getIdeaDevelopers,
  registerIdeaDevReview,
} from "../controllers/idea.js";

const router = express.Router();

router.post("/register", registerIdea);
router.post("/selection", registerSelectedIdea);
router.post("/verify", registerIdeaVerify);
router.post("/verify/department", registerDepartmentVerify);
router.post("/verify/ai", registerAIVerify);
router.post("/pilot", registerIdeaPilot);
router.post("/devreview", registerIdeaDevReview);
router.get("/verify/:id", getIdeaVerifyById);
router.get("/developers", getIdeaDevelopers);
router.get("/", getIdeas);
router.get("/:id", getIdeaById);

export default router;
