import cors from 'cors';
import express from "express";
import solutionRoutes from "./routes/solutions.js";
import reviewRoutes from "./routes/reviews.js";
import developerRoutes from "./routes/developers.js";
import dataTableRoutes from "./routes/dataTables.js";
import multer from "multer";
import { loginOpark } from './opark.js';
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import redis from "redis";
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'https://itasset.skons.co.kr']
}));

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
    const uploadPath = process.env.NODE_ENV === 'production'
      ? process.env.PROD_SOLUTIONS_PATH
      : process.env.DEV_SOLUTIONS_PATH;

    cb(null, path.join(__dirname, `../${uploadPath}`));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadSolutions = multer({ storage: solutionsStorage });
// Solution 저장 로직
app.post("/api/upload/solutions", uploadSolutions.single("file"), function (req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "파일이 업로드되지 않았습니다. 파일을 첨부해주세요." });
  }
  console.log("업로드된 파일 정보:", req.file);
  try {
    const filePath = req.file.path;
    const fileName = req.file.filename;
    console.log("file path: ", filePath);
    console.log("file name: ", fileName);
    res.status(200).json({ filePath });
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    res.status(500).json({ message: "파일 업로드 처리 중 서버에서 오류가 발생했습니다." });
  }
});
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
    const uploadPath = process.env.NODE_ENV === 'production'
      ? process.env.PROD_DEVELOPERS_PATH // 서버용 경로
      : process.env.DEV_DEVELOPERS_PATH; // 개발용 경로

    cb(null, path.join(__dirname, `../${uploadPath}`));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // 파일명에 타임스탬프 추가
  },
});
const uploadDevelopers = multer({ storage: developersStorage });
// Developer 저장 로직
app.post("/api/upload/developers", uploadDevelopers.single("file"), function (req, res) {
  console.log("index req.body : ", req.body);
  console.log("index req.file : ", req.file);
  if (!req.file) {
    return res.status(400).json({ message: "파일이 업로드되지 않았습니다. 파일을 첨부해주세요." });
  }
  console.log("업로드된 파일 정보:", req.file);
  try {
    const filePath = req.file.path;
    const fileName = req.file.filename;
    console.log("file path: ", filePath);
    console.log("file name: ", fileName);
    res.status(200).json({ filePath });
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    res.status(500).json({ message: "파일 업로드 처리 중 서버에서 오류가 발생했습니다." });
  }
});
//////////////////////////////


////////////////////////
// Opark 로그인 로직 

// Redis 클라이언트 생성
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => { console.log("Redis 접속 성공"); });
redisClient.connect().then(() => {
  console.log('Redis 서버에 대한 연결이 설정되었습니다.');
}).catch((error) => {
  console.error('Redis에 연결하지 못했습니다. :', error);
});
//// redis ////

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  console.log(`로그인 시도: ${username}`);
  const key = `login_attempts_${username}`;  // redis 추가
  let attempts;

  try {
    //////  Redis 로그인 시도 횟수 확인
    attempts = await redisClient.get(key) || 0;
    console.log(`${username} 로그인 시도 횟수 : ${attempts}번`); // 현재 로그인 시도 횟수 로그
    console.log("redis key: ", key)
    if (parseInt(attempts) >= 5) {
      console.log(`${username} login attempt blocked due to too many attempts`);
      // return res.status(429).json({ success: false, message: '로그인 시도 횟수 초과' });
      return res.status(429).json({ success: false, message: '로그인 시도 횟수 초과', attempts: parseInt(attempts) });
    }
    ///// redis 추가/// 

    const loginResult = await loginOpark(username, password);
    // 여기서 loginResult의 success와 userDetails를 확인합니다.
    if (loginResult.success && loginResult.authUserValue === 'Y') {
      // 로그인 성공
      // 성공시 로그인 시도횟수 초기화
      await redisClient.del(key);  // redis 추가
      console.log(`로그인 성공: ${username}`);
      res.status(200).json({ success: true, message: '로그인 성공', data: loginResult });
    } else {
      //로그인 실패
      //실패시 로그인 시도 횟수 증가 및 30분 정도 저장
      attempts = parseInt(attempts) + 1;
      await redisClient.setEx(key, 1800, attempts.toString());
      console.log(`로그인 실패: ${username}`);
      console.log(`${username} login failed, attempt ${attempts}`); // 새로운 로그인 시도 횟수 로그

      res.status(401).json({ success: false, message: '로그인 인증 실패', attempts: parseInt(attempts) });
    }
  } catch (error) {
    // //로그인 처리 중 에러
    attempts = parseInt(attempts) + 1;
    await redisClient.setEx(key, 1800, attempts.toString()); // 실패 시 로그인 시도 횟수 증가 및 30분 동안 저장
    console.error(`로그인 처리 중 에러: ${error.message}`);
    res.status(500).json({ success: false, message: '로그인 실패', error: error.message, attempts: parseInt(attempts) });
  }
});
////////////////////////

app.use("/api/solutions", solutionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/developers", developerRoutes);
app.use("/api/datatables", dataTableRoutes);


app.listen(8800, () => {
  console.log("API 8800 Port 접속완료!")
});

app.get('/api/someEndpoint', (req, res) => {
  res.send("someEndpoint의 응답입니다!!");
});



