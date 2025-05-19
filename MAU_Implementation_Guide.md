# MAU(Monthly Active Users) 로직 구현 가이드

본 문서는 Dashboard와 IdeaBoard 페이지에 접속하는 사용자를 추적하고, MAU를 집계하는 로직 구현에 대한 가이드입니다.

## 1. 클라이언트 코드 수정 사항

### Main.jsx에 추가된 트래킹 코드

사용자가 Dashboard나 IdeaBoard 페이지에 접근할 때마다 활동을 기록하는 코드가 추가되었습니다:

```javascript
// MAU 로직: Dashboard 또는 IdeaBoard 접속 시 유저 활동 기록
useEffect(() => {
  const trackUserActivity = async () => {
    // 사용자가 로그인되어 있고, N10으로 시작하는 ID를 가진 경우만 추적
    if (
      currentUser &&
      currentUser.userId &&
      currentUser.userId.toString().startsWith("N10") &&
      (isIdeaBoardPage || isDashboardPage)
    ) {
      try {
        await axios.post("/api/analytics/track-activity", {
          userId: currentUser.userId,
          page: location.pathname,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("활동 추적 오류:", error);
      }
    }
  };

  trackUserActivity();
}, [location.pathname, currentUser, isIdeaBoardPage, isDashboardPage]);
```

### ConnectCnt.jsx 수정

정적 데이터 대신 실제 API에서 MAU 데이터를 가져오도록 수정되었습니다:

```javascript
import React, { useState, useEffect } from "react";
import "./connectCnt.scss";
import axios from "axios";

const ConnectCnt = () => {
  const [mauData, setMauData] = useState({
    totalCnt: 0, // 월 전체 활성 사용자 수
    thisWeek: 0, // 이번 주 활성 사용자 수
    lastWeek: 0, // 지난 주 활성 사용자 수
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMAUData = async () => {
      try {
        setLoading(true);
        // MAU 통계 데이터 가져오기
        const response = await axios.get("/api/analytics/mau-stats");
        setMauData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("MAU 데이터 가져오기 오류:", err);
        setError("MAU 데이터를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchMAUData();
  }, []);

  // ... 컴포넌트 렌더링 부분
};
```

## 2. 서버 측 구현 사항

서버 측에는 아래 두 개의 API 엔드포인트가 필요합니다:

1. `POST /api/analytics/track-activity`: 사용자 활동을 기록
2. `GET /api/analytics/mau-stats`: MAU 통계 데이터 조회

### MongoDB 스키마 정의

```javascript
const UserActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  page: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

const UserActivity = mongoose.model("UserActivity", UserActivitySchema);
```

### 사용자 활동 기록 엔드포인트

```javascript
// 사용자 활동 기록 엔드포인트
router.post("/track-activity", async (req, res) => {
  try {
    const { userId, page, timestamp } = req.body;

    // N10으로 시작하는 ID만 추적
    if (!userId || !userId.toString().startsWith("N10")) {
      return res.status(400).json({ message: "유효하지 않은 사용자 ID" });
    }

    // /dashboard 또는 /ideaboard로 시작하는 페이지만 추적
    if (
      !page ||
      !(page.startsWith("/dashboard") || page.startsWith("/ideaboard"))
    ) {
      return res.status(400).json({ message: "추적 대상이 아닌 페이지" });
    }

    // 활동 기록 저장
    const activity = new UserActivity({
      userId,
      page,
      timestamp: timestamp || new Date(),
    });

    await activity.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("사용자 활동 기록 오류:", error);
    res.status(500).json({ message: "서버 오류", error: error.message });
  }
});
```

### MAU 통계 조회 엔드포인트

```javascript
// MAU 통계 조회 엔드포인트
router.get("/mau-stats", async (req, res) => {
  try {
    const now = new Date();

    // 30일 전 날짜 계산 (롤링 30일)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // 이번 주 시작일 계산 (일요일 기준)
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay()); // 이번 주 일요일로 설정
    thisWeekStart.setHours(0, 0, 0, 0);

    // 지난 주 시작일과 종료일 계산
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);

    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setMilliseconds(lastWeekEnd.getMilliseconds() - 1);

    // 롤링 30일 동안의 고유 사용자 수 집계
    const totalMauResult = await UserActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo },
          userId: { $regex: /^N10/ },
        },
      },
      {
        $group: {
          _id: "$userId",
        },
      },
      {
        $count: "count",
      },
    ]);

    // 이번 주 고유 사용자 수 집계
    const thisWeekResult = await UserActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: thisWeekStart },
          userId: { $regex: /^N10/ },
        },
      },
      {
        $group: {
          _id: "$userId",
        },
      },
      {
        $count: "count",
      },
    ]);

    // 지난 주 고유 사용자 수 집계
    const lastWeekResult = await UserActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: lastWeekStart, $lt: thisWeekStart },
          userId: { $regex: /^N10/ },
        },
      },
      {
        $group: {
          _id: "$userId",
        },
      },
      {
        $count: "count",
      },
    ]);

    const totalCnt = totalMauResult[0]?.count || 0;
    const thisWeek = thisWeekResult[0]?.count || 0;
    const lastWeek = lastWeekResult[0]?.count || 0;

    res.json({
      totalCnt,
      thisWeek,
      lastWeek,
    });
  } catch (error) {
    console.error("MAU 통계 조회 오류:", error);
    res.status(500).json({ message: "서버 오류", error: error.message });
  }
});
```

### 라우터 등록

서버 메인 파일(app.js, server.js 또는 index.js)에 다음과 같이 라우터를 등록합니다:

```javascript
// 분석 라우터 등록
const analyticsRoutes = require("./routes/analytics");
app.use("/api/analytics", analyticsRoutes);
```

## 3. 구현 세부 사항

- **집계 기준**: /dashboard 또는 /ideaboard로 들어오는 사용자를 1count로 집계
- **고유 사용자**: N10으로 시작하는 ID만 대상으로 함
- **집계 방식**: 롤링 30일 방식 (현재 날짜로부터 30일 이내)
- **주간 지표**: 현재 주(일요일~토요일)와 이전 주의 집계 데이터 제공

## 4. 테스트

구현 후 다음을 확인하세요:

1. Dashboard나 IdeaBoard 페이지 방문 시 활동 기록이 데이터베이스에 잘 저장되는지 확인
2. N10으로 시작하지 않는 ID의 사용자는 집계에서 제외되는지 확인
3. 롤링 30일, 이번 주, 지난 주 데이터가 정확히 집계되는지 확인
4. Dashboard의 접속자 수 위젯에 데이터가 올바르게 표시되는지 확인
