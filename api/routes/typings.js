import express from "express";
import { getTypingData } from "../controllers/typing.js";

const router = express.Router();

router.get("/typingdata", getTypingData);

export default router;
