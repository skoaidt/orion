import express from "express";
import { getTypingData, saveTypingResult } from "../controllers/typing.js";

const router = express.Router();

router.get("/typingdata", getTypingData);
router.post("/saveresult", saveTypingResult);

export default router;
