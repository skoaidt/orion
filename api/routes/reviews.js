import express from "express";
import { reviewReg, getReview, deleteReview } from "../controllers/review.js"

const router = express.Router();

router.post("/reviewreg", reviewReg);
router.get("/getreview", getReview);
router.delete("/deletereview/:uuid", deleteReview);

export default router;