import React, { useContext, useEffect } from "react";
import Main from "./pages/Main";
import Login from "./pages/Login";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";

function App() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login"); // currentUser가 null이면 로그인 페이지로 이동
    }
  }, [currentUser, navigate]);

  return <div className="app">{currentUser ? <Main /> : <Login />}</div>;
}

export default App;
