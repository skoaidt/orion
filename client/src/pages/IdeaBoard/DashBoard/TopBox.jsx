import "./topBox.scss";
import { topUsers } from "./data";
const TopBox = () => {
  return (
    <div className="topBox">
      <h1>플랫폼 활용 순위 Top 5</h1>
      <div className="list">
        {topUsers
          .sort((a, b) => b.connectCnt - a.connectCnt)
          .slice(0, 5) // 상위 5명만 보여주기
          .map((user) => (
            <div className="listItem" key={user.n_id}>
              <div className="no">{topUsers.indexOf(user) + 1}.</div>
              <div className="team">{user.team}</div>
              <div className="user">{user.name}</div>
              <div className="connectCnt">{user.connectCnt}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TopBox;
