// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import EditPostPage from './pages/EditPostPage';
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="container py-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PostListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/posts/new" element={<CreatePostPage />} />
            <Route path="/posts/:postId/edit" element={<EditPostPage />} />
          </Route>
          
        </Routes>
      </main>
    </Router>
  );
}

export default App;