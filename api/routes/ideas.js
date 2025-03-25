import express from "express";
import {
  registerIdea,
  getIdeas,
  getIdeaById,
  registerSelectedIdea,
  registerIdeaVerify,
} from "../controllers/idea.js";

const router = express.Router();

router.post("/register", registerIdea);
router.post("/selection", registerSelectedIdea);
router.post("/verify", registerIdeaVerify);
router.get("/", getIdeas);
router.get("/:id", getIdeaById);

export default router;
