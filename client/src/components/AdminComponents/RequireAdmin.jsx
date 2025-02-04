
import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { Navigate, useLocation } from 'react-router-dom';

const RequireAdmin = ({ children }) => {

  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser || !currentUser.isAdmin) {
    alert("허가된 계정만 접근이 가능합니다. 관리자에게 문의하세요.");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAdmin;