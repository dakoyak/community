// src/components/common/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // AuthContext가 로딩 중일 때는 아무것도 렌더링하지 않거나 로딩 스피너를 보여줍니다.
    return <div>인증 상태 확인 중...</div>;
  }

  // 사용자가 있으면 자식 라우트(Outlet)를 렌더링하고, 없으면 로그인 페이지로 리디렉션합니다.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
