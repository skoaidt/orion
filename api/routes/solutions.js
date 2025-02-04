import express from "express";
import {
  register, getsolution, getproduct, getmodifysol,
  getWorkfld,
  updateSolDesc, fileupload, updateSoletc, likes, getLikes,
  solutionLike,
  checkSolutionLike,
  getSolutionLikes,
  getTopLikedSolutions
} from "../controllers/solution.js";


const router = express.Router();

router.post("/register", register);
router.get("/getsolution", getsolution);
router.get("/getmodifysol", getmodifysol);

router.get("/getWorkfld", getWorkfld);
router.get("/getsolution/:id", getproduct);

router.put("/update/:id", updateSolDesc);
router.put("/updatesoletc/:id", updateSoletc);
// router.put("/likes/:id", likes);
router.get("/likes/:id", getLikes);
router.post("/likes/:id", likes);
router.post("/fileupload", fileupload);

router.post("/solutionlike", solutionLike);
router.get("/solutionlike/check", checkSolutionLike);
router.get("/getSolutionLikes", getSolutionLikes);
router.get("/getTopLikedSolutions", getTopLikedSolutions);

export default router;