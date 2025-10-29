// src/pages/PostListPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/posts');
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        setError('게시글을 불러오는 데 실패했습니다.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>게시글 목록</h1>
        {user && (
          <Link to="/posts/new" className="btn btn-primary">글쓰기</Link>
        )}
      </div>
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th scope="col" style={{ width: '10%' }}>#</th>
            <th scope="col" style={{ width: '50%' }}>제목</th>
            <th scope="col" style={{ width: '15%' }}>작성자</th>
            <th scope="col" style={{ width: '15%' }}>작성일</th>
            <th scope="col" style={{ width: '10%' }}>조회수</th>
            <th scope="col" style={{ width: '10%' }}>추천</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post.id}>
                <th scope="row">{post.id}</th>
                <td>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.User ? post.User.username : '알 수 없음'}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>{post.views}</td>
                <td>{post.likeCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">게시글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default PostListPage;
