import React, { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { format } from "date-fns";

export const SolutionBox = ({
  id,
  solName,
  solFullName,
  korName,
  url,
  img,
}) => {
  const { currentUser } = useContext(AuthContext);

  const handleLog = async () => {
    const logData = {
      sol_id: id,
      n_id: currentUser?.userId,
      n_name: currentUser?.name,
      team: currentUser?.deptName,
      headqt: currentUser?.prntDeptName,
      date: format(new Date(), "yyyy-MM-dd HH:mm"),
      category: "connect",
    };

    try {
      await axios.post("/api/solutions/solutionlike", logData);
    } catch (error) {
      console.error("Error logging connection:", error);
    }
  };

  const handleImageError = (e) => {
    e.target.src = process.env.PUBLIC_URL + "/image/error/noimage.png";
  };

  // 이미지 경로 처리 함수 추가
  const getImagePath = (imgPath) => {
    // imgPath가 없으면 기본 이미지 반환
    if (!imgPath) {
      return process.env.PUBLIC_URL + "/image/error/noimage.png";
    }

    // 절대 경로인 경우 처리 (/var/www/asset/... 형태)
    if (imgPath.startsWith("/var/www/asset/")) {
      // 경로를 웹 접근 가능한 형태로 변환
      // "/var/www/asset/client/public/upload/solutions/1742261739821TEST.png" → "/upload/solutions/1742261739821TEST.png"
      const parts = imgPath.split("/upload/");
      if (parts.length > 1) {
        return process.env.PUBLIC_URL + "/upload/" + parts[1];
      }
      return process.env.PUBLIC_URL + "/image/error/noimage.png";
    }

    // 이미 웹 경로인 경우 (/upload/... 형태)
    if (imgPath.startsWith("/upload/")) {
      return process.env.PUBLIC_URL + imgPath;
    }

    // 기타 경우 (상대 경로 등)
    return process.env.PUBLIC_URL + img;
  };

  return (
    <div className="solutionBox">
      <div className="imgBox">
        <img
          src={getImagePath(img)}
          alt="solutionImg"
          onError={handleImageError}
        />
        <div className="overlayWrap">
          <div className="overlayBox">
            <div className="left">
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                onClick={handleLog}
              >
                <img
                  src={process.env.PUBLIC_URL + "/image/icons/live_preview.png"}
                  alt="solution-link"
                />
                <p>바로가기</p>
              </a>
            </div>
            <div className="right">
              <a href={"/product/" + id}>
                <img
                  src={process.env.PUBLIC_URL + "/image/icons/more_detail.png"}
                  alt="solution-link"
                />
                <p>자세한 설명</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className="solTitle">{solName}</p>
      <p className="solfullNm">{solFullName} </p>
      <p className="solTitleKr">{korName}</p>
    </div>
  );
};

export default SolutionBox;
