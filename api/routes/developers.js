import express from "express";
import { registerDev, getDeveloper, getUser, AdminReg, getAdmin, updateDevIntro, updateDevImg } from "../controllers/developer.js"

const router = express.Router();

router.post("/registerdev", registerDev);
router.get("/getdeveloper", getDeveloper);
router.put("/updatedevimg", updateDevImg);
router.put("/updatedevintro", updateDevIntro);
router.get("/getuser", getUser);

router.post("/adminreg", AdminReg);
router.get("/getadmin", getAdmin);

export default router;