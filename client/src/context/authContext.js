import React, { createContext, useCallback, useEffect, useState } from 'react'
import axios from 'axios';
export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  const [loginAttempts, setLoginAttempts] = useState(0); // 로그인 시도 횟수 상태 추가 

  const login = async ({ username, password }) => {
    try {
      const response = await axios.post("/api/login", { username, password });
      console.log("서버 응답:", response.data);
      const { data } = response;

      console.log("data.success:", data.success);
      console.log("data.data", data.data);

      if (data.success && data.data.authUserValue === "Y") {
        const userDetails = {};
        data.data.keyValuePairs.forEach(pair => {
          switch (pair[0]) {
            case 'USER_ID':
              userDetails.userId = pair[1];
              break;
            case 'Name':
              userDetails.name = pair[1];
              break;
            case 'PrntDeptName':
              userDetails.prntDeptName = pair[1];
              break;
            case 'DeptName':
              userDetails.deptName = pair[1];
              break;
            default:
              break;
          }
        });

        // Admin 여부 확인 요청 추가
        const adminResponse = await axios.get("/api/developers/getadmin");
        userDetails.isAdmin = adminResponse.data.some(admin => admin.n_id === userDetails.userId);


        setCurrentUser(userDetails);
        sessionStorage.setItem("user", JSON.stringify(userDetails));

        // 로그인 시간을 저장합니다. 
        const loginTime = new Date().getTime();
        sessionStorage.setItem("loginTime", loginTime.toString());

        // 로그인 성공시 
        console.log("로그인 성공 - 로그인 시도 횟수 초기화");
        setLoginAttempts(0); //로그인 성공시 시도 횟수 초기화

      } else {
        // setLoginAttempts(prev => {
        //   console.log(`로그인 실패 - 시도 횟수 증가 전: ${prev}`);
        //   return prev + 1;
        // });
        console.log(`로그인 실패 - 현재 시도 횟수: ${loginAttempts}`);
        throw new Error("로그인 실패");
      }
    } catch (error) {
      // if (error.response && error.response.status === 429) {
      //   // 백엔드에서 로그인 시도 제한 오류를 받은 경우
      //   alert(`로그인 시도 횟수 초과. 잠시 후 다시 시도하세요.`);
      //   setLoginAttempts(error.response.data.attempts);
      //   console.log(`로그인 시도 횟수 초과 - 서버에서 반환된 시도 횟수: ${error.response.data.attempts}`);
      // }
      // console.error(error);
      if (error.response) {
        console.log("받은 데이터:", error.response.data);
        const attempts = parseInt(error.response.data.attempts); // 문자열을 숫자로 변환
        setLoginAttempts(attempts);
        console.log(`로그인 실패 - 서버에서 반환된 시도 횟수: ${attempts}`);

        switch (error.response.status) {
          case 429:
            console.error("로그인 5회 이상 실패: ", error);
            alert(`로그인 시도 횟수 초과. 잠시 후 다시 시도하세요.`);
            break;
          case 500:
            console.error("서버 오류(500) 발생:", error);
            alert(`로그인 정보 및 서버 오류 등으로 로그인에 실패했습니다. (${attempts}회 실패)`);
            break;
          case 401:
            console.error("로그인 인증(401) 실패:", error);
            break;
          default:
            console.error("예상치 못한 오류 발생:", error);
            break;
        }
      } else {
        console.error("네트워크 오류 또는 예상치 못한 오류:", error);
      }
      throw error;
    }
  };

  const checkSessionTimeout = useCallback(() => {
    const loginTime = sessionStorage.getItem("loginTime");
    const currentTime = new Date().getTime();

    // 30분을 밀리초로 환산합니다.
    const timeout = 30 * 60 * 1000;

    if (loginTime && (currentTime - loginTime > timeout)) {
      logout();
    }
  }, []); // useCallback 의존성 배열이 비어 있으므로, 컴포넌트가 마운트될 때 한 번만 생성됩니다.\


  // 사용자 활동 감시 : session timeout reset
  const resetSessionTimeout = () => {
    const currentTime = new Date().getTime();
    sessionStorage.setItem("loginTime", currentTime.toString());
  };


  const logout = () => {
    try {
      setCurrentUser(null);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("loginTime");
    } catch (error) {
      console.error("로그아웃 과정에서 오류 발생:", error);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    checkSessionTimeout();
    const interval = setInterval(checkSessionTimeout, 5 * 60 * 1000); // 5분마다 세션 타임아웃을 확인합니다.
    return () => clearInterval(interval);
  }, [checkSessionTimeout]); // useEffect 의존성 배열에 checkSessionTimeout를 추가합니다.



  // 사용자 활동 감시 : session timeout reset
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const handleUserActivity = () => resetSessionTimeout();

    events.forEach(event => window.addEventListener(event, handleUserActivity));
    return () => {
      events.forEach(event => window.removeEventListener(event, handleUserActivity));
    };
  }, []);


  return (
    // <AuthContext.Provider value={{ currentUser, login, logout }}>  // 로그인 횟수 추가 
    <AuthContext.Provider value={{ currentUser, login, logout, loginAttempts }}>
      {children}
    </AuthContext.Provider>
  );
}


