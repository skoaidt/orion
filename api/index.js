import cors from "cors";
import express from "express";
import solutionRoutes from "./routes/solutions.js";
import reviewRoutes from "./routes/reviews.js";
import developerRoutes from "./routes/developers.js";
import dataTableRoutes from "./routes/dataTables.js";
import typingRoutes from "./routes/typings.js";
import multer from "multer";
import { loginOpark } from "./opark.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import redis from "redis";
import "dotenv/config";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://itasset.skons.co.kr"],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

////////////////////////
// 이미지 파일 업로드 로직
// Solution 저장 로직
// const solutionsStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // 개발용
//     cb(null, path.join(__dirname, '../client/public/upload/solutions'));
//     // 서버용
//     // cb(null, path.join(__dirname, '../client/upload/solutions'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });
const solutionsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath =
      process.env.NODE_ENV === "production"
        ? process.env.PROD_SOLUTIONS_PATH
        : process.env.DEV_SOLUTIONS_PATH;

    const fullPath = path.join(__dirname, `../${uploadPath}`);

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`디렉토리 생성됨: ${fullPath}`);
    }

    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadSolutions = multer({ storage: solutionsStorage });
// Solution 저장 로직
app.post(
  "/api/upload/solutions",
  uploadSolutions.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(`File uploaded: ${req.file.path}, ${req.file.originalname}`);

      // 웹에서 접근 가능한 경로 생성
      // 서버 경로: /var/www/asset/client/public/upload/solutions/filename
      // 웹 경로: /upload/solutions/filename
      const filePath = req.file.path;
      let webPath = "";

      if (filePath.includes("/upload/solutions/")) {
        // 경로에서 /upload/solutions/ 이후 부분 추출
        webPath =
          "/upload/solutions/" + filePath.split("/upload/solutions/")[1];
      } else {
        // 경로 추출에 실패한 경우 원본 파일명만 사용
        webPath = "/upload/solutions/" + req.file.filename;
      }

      console.log(`Web accessible path: ${webPath}`);

      res.status(200).json({
        message: "File uploaded successfully",
        filePath: webPath, // 웹 접근 가능한 경로 반환
        originalName: req.file.originalname,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res
        .status(500)
        .json({ error: "Error uploading file", details: error.message });
    }
  }
);
////////////////////////

////////////////////////
// Developer 저장 로직
// const developersStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // 개발용
//     cb(null, path.join(__dirname, '../client/public/upload/developers'));
//     // 서버용
//     // cb(null, path.join(__dirname, '../client/upload/developers'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });
const developersStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath =
      process.env.NODE_ENV === "production"
        ? process.env.PROD_DEVELOPERS_PATH
        : process.env.DEV_DEVELOPERS_PATH;

    const fullPath = path.join(__dirname, `../${uploadPath}`);

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`디렉토리 생성됨: ${fullPath}`);
    }

    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const uploadDevelopers = multer({ storage: developersStorage });
// Developer 저장 로직
app.post(
  "/api/upload/developers",
  uploadDevelopers.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(`File uploaded: ${req.file.path}, ${req.file.originalname}`);

      // 웹에서 접근 가능한 경로 생성
      // 서버 경로: /var/www/asset/client/public/upload/developers/filename
      // 웹 경로: /upload/developers/filename
      const filePath = req.file.path;
      let webPath = "";

      if (filePath.includes("/upload/developers/")) {
        // 경로에서 /upload/developers/ 이후 부분 추출
        webPath =
          "/upload/developers/" + filePath.split("/upload/developers/")[1];
      } else {
        // 경로 추출에 실패한 경우 원본 파일명만 사용
        webPath = "/upload/developers/" + req.file.filename;
      }

      console.log(`Web accessible path: ${webPath}`);

      res.status(200).json({
        message: "File uploaded successfully",
        filePath: webPath, // 웹 접근 가능한 경로 반환
        originalName: req.file.originalname,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res
        .status(500)
        .json({ error: "Error uploading file", details: error.message });
    }
  }
);
//////////////////////////////

////////////////////////
// Opark 로그인 로직

// Redis 클라이언트 생성
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => {
  console.log("Redis 접속 성공");
});
redisClient
  .connect()
  .then(() => {
    console.log("Redis 서버에 대한 연결이 설정되었습니다.");
  })
  .catch((error) => {
    console.error("Redis에 연결하지 못했습니다. :", error);
  });
//// redis ////

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  console.log(`로그인 시도: ${username}`);
  const key = `login_attempts_${username}`; // redis 추가
  let attempts;

  try {
    //////  Redis 로그인 시도 횟수 확인
    attempts = (await redisClient.get(key)) || 0;
    console.log(`${username} 로그인 시도 횟수 : ${attempts}번`); // 현재 로그인 시도 횟수 로그
    console.log("redis key: ", key);
    if (parseInt(attempts) >= 5) {
      console.log(`${username} login attempt blocked due to too many attempts`);
      // return res.status(429).json({ success: false, message: '로그인 시도 횟수 초과' });
      return res.status(429).json({
        success: false,
        message: "로그인 시도 횟수 초과",
        attempts: parseInt(attempts),
      });
    }
    ///// redis 추가///

    const loginResult = await loginOpark(username, password);
    // 여기서 loginResult의 success와 userDetails를 확인합니다.
    if (loginResult.success && loginResult.authUserValue === "Y") {
      // 로그인 성공
      // 성공시 로그인 시도횟수 초기화
      await redisClient.del(key); // redis 추가
      console.log(`로그인 성공: ${username}`);
      res
        .status(200)
        .json({ success: true, message: "로그인 성공", data: loginResult });
    } else {
      //로그인 실패
      //실패시 로그인 시도 횟수 증가 및 30분 정도 저장
      attempts = parseInt(attempts) + 1;
      await redisClient.setEx(key, 1800, attempts.toString());
      console.log(`로그인 실패: ${username}`);
      console.log(`${username} login failed, attempt ${attempts}`); // 새로운 로그인 시도 횟수 로그

      res.status(401).json({
        success: false,
        message: "로그인 인증 실패",
        attempts: parseInt(attempts),
      });
    }
  } catch (error) {
    // //로그인 처리 중 에러
    attempts = parseInt(attempts) + 1;
    await redisClient.setEx(key, 1800, attempts.toString()); // 실패 시 로그인 시도 횟수 증가 및 30분 동안 저장
    console.error(`로그인 처리 중 에러: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "로그인 실패",
      error: error.message,
      attempts: parseInt(attempts),
    });
  }
});
////////////////////////

app.use("/api/solutions", solutionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/developers", developerRoutes);
app.use("/api/datatables", dataTableRoutes);
app.use("/api/typings", typingRoutes);

// 파일 업로드를 위한 저장소 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(
      __dirname,
      "../client/public/upload",
      req.body.path || "Completed"
    );

    // 디렉토리가 없으면 생성
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 파일명 중복 방지를 위해 타임스탬프 추가
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 파일 업로드 라우트
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "업로드된 파일이 없습니다." });
    }

    // 파일 경로 반환
    const relativePath = `/upload/${req.body.path || "Completed"}/${
      req.file.filename
    }`;
    return res.status(200).json({
      message: "파일 업로드 성공",
      filePath: relativePath,
    });
  } catch (error) {
    console.error("파일 업로드 오류:", error);
    return res
      .status(500)
      .json({ message: "파일 업로드 중 오류가 발생했습니다." });
  }
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}번에서 실행 중입니다.`);
});

app.get("/api/someEndpoint", (req, res) => {
  res.send("someEndpoint의 응답입니다!!");
});
