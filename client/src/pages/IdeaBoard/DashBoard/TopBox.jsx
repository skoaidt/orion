import "./topBox.scss";
import { useState, useEffect } from "react";
import axios from "axios";

const TopBox = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/analytics/top-users");
        setTopUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("상위 사용자 데이터 로딩 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <div className="topBox">
      <h1>플랫폼 활용 순위 Top 5</h1>
      {loading ? (
        <div className="loading">데이터 로딩 중...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="list">
          {topUsers.length > 0 ? (
            topUsers.map((user, index) => (
              <div className="listItem" key={user.n_id}>
                <div className="no">{index + 1}.</div>
                <div className="team">{user.team}</div>
                <div className="user">{user.name}</div>
                <div className="connectCnt">{user.connectCnt}</div>
              </div>
            ))
          ) : (
            <div className="no-data">활동 데이터가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopBox;
