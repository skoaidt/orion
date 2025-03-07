import express from "express";
import {
  getTypingData,
  saveTypingResult,
  getTypingResults,
} from "../controllers/typing.js";

const router = express.Router();

router.get("/typingdata", getTypingData);
router.post("/saveresult", saveTypingResult);
router.get("/getresults", getTypingResults);
export default router;
