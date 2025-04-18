import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { TextField } from "@mui/material";

export const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [showDadaBox, setShowDadaBox] = useState(false);
  const navigate = useNavigate();

  const { login, loginAttempts } = useContext(AuthContext); // 로그인 횟수 loginAttempts 변수 추가

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      console.log("로그인 성공", username);
      // onLogin(true); // 로그인 상태를 true로 설정
      navigate("/"); // 사용자를 홈 페이지로 리디렉션
    } catch (error) {
      console.error("Login - 로그인 요청 중 에러 발생:", error);
      setLoginError(true); // 로그인 실패 처리
    }
  };

  return (
    <div className="loginContainer">
      <div className="leftSide">
        <div className="logoBox">
          <img
            src={`${process.env.PUBLIC_URL}/image/logo/skonsWhite.png`}
            alt="logo"
          />
        </div>
        <div className="imgBox">
          <img
            src={`${process.env.PUBLIC_URL}/image/login/loginSide2.png`}
            alt="loginBG"
          />
        </div>
        <div className={`dadaBox ${showDadaBox ? "show" : ""}`}>
          <img
            src={`${process.env.PUBLIC_URL}/image/login/dada.png`}
            alt="loginBG"
          />
          <p className="dadaText">Coding 요정은 언제나 당신의 곁에 있습니다.</p>
          <div className={`codingElf ${showDadaBox ? "show" : ""}`}>
            <img
              src={`${process.env.PUBLIC_URL}/image/login/codingElf.png`}
              alt="codingElf"
            />
          </div>
          <div className={`elf ${showDadaBox ? "show" : ""}`}>
            <img
              className="animation-updown"
              src={`${process.env.PUBLIC_URL}/image/login/elf.png`}
              alt="elf"
            />
          </div>
        </div>
        <div
          className="circle"
          onMouseEnter={() => setShowDadaBox(true)}
          onMouseLeave={() => setShowDadaBox(false)}
        ></div>
      </div>

      <div className="rightSide">
        <div className="logoBox">
          <img
            src={`${process.env.PUBLIC_URL}/image/logo/OrionWhite.png`}
            alt="logo"
          />
        </div>
        <div className="loginBox">
          <div className="titleBox">
            <div className="loginTitle">Sign in</div>
            <div className="subTitle">
              Welcome to the AI/DT Platform. <br />
              All members who have logged in here will experience the very best.
            </div>
          </div>
          <form onSubmit={handleLogin}>
            <TextField
              label="사번"
              variant="outlined"
              placeholder="N+사번을 입력하세요."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="비밀번호"
              variant="outlined"
              placeholder="i-net 비밀번호를 입력하세요."
              value={password}
              type="password"
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            {loginError && (
              <div className="errorMessageWrap">
                로그인 정보가 올바르지 않습니다.
                {loginAttempts > 0 && (
                  <div className="loginAttemptsMessage">
                    로그인 시도 {loginAttempts}회 실패했습니다. 5회 이상 실패 시
                    로그인이 제한됩니다.
                  </div>
                )}
              </div>
            )}
            <button type="submit" className="loginBtn">
              Login
            </button>
          </form>
        </div>
        <div className="loginFooter">
          <div className="loginFooterText">
            © 2024 SK ons. All rights reserved. | Developer : 전다현 / 김민영
          </div>
          <div className="loginFooterText textRight">
            Design by AI/DT Planning
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
