import express from "express";
import {
  addComment, countComments, deleteComment, getComments, getPNCR,
  logPNCRView, pncrCnt,
  pncrComplete, pncrDelete, pncrReg, pncrUpdate
} from "../controllers/dataTable.js";

const router = express.Router();

router.get("/getpncr", getPNCR);
router.post("/pncrreg", pncrReg);
router.put("/pncrcomplete", pncrComplete);
router.put("/pncrupdate/:id", pncrUpdate);
router.delete("/pncr/:id", pncrDelete);
router.post("/logPNCRView", logPNCRView);
router.get("/pncrCnt", pncrCnt);

router.get("/pncrgetComments/:pncr_id", getComments);
router.post("/addComment", addComment);
router.delete("/pncrComment/:id", deleteComment);
router.get("/countComments/:pncr_id", countComments);

export default router;