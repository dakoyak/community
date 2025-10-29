// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; // Fallback for local development

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // 앱 로딩 상태

  useEffect(() => {
    // 앱이 처음 로드될 때 localStorage에 토큰이 있으면 사용자 정보를 복원합니다.
    const loadUserFromStorage = () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } 
      setLoading(false);
    };
    loadUserFromStorage();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/api/v1/auth/login`, { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const register = async (email, password, username) => {
    await axios.post(`${API_URL}/api/v1/auth/register', { email, password, username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // 인증 상태 로딩이 끝나기 전까지는 앱의 나머지 부분을 렌더링하지 않습니다.
  if (loading) {
    return <div className="container mt-5 text-center">애플리케이션 로딩 중...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
