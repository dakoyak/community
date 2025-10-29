// src/pages/EditPostPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

const EditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/posts/${postId}`);
        // Author check
        if (!user || user.id !== data.post.UserId) {
          alert('수정 권한이 없습니다.');
          navigate(`/posts/${postId}`);
          return;
        }
        setTitle(data.post.title);
        setContent(data.post.content);
      } catch (err) {
        setError('게시글 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/v1/posts/${postId}`, { title, content });
      navigate(`/posts/${postId}`);
    } catch (err) {
      setError(err.response?.data?.message || '글 수정에 실패했습니다.');
    }
  };

  if (loading) return <div className="text-center">로딩 중...</div>;

  return (
    <div>
      <h1 className="mb-4">게시글 수정</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">제목</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">내용</label>
          <textarea
            className="form-control"
            id="content"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary me-2">수정 완료</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>취소</button>
      </form>
    </div>
  );
};

export default EditPostPage;
