// src/pages/PostDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

const PostDetailPage = () => {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');

  // For comment editing
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const postRes = await axios.get(`${API_URL}/api/v1/posts/${postId}`);
      const commentsRes = await axios.get(`${API_URL}/api/v1/posts/${postId}/comments`);
      setPost(postRes.data.post);
      setComments(commentsRes.data.comments);
    } catch (err) {
      setError('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/api/v1/posts/${postId}/comments`, { content: newComment });
      setComments([...comments, res.data.comment]);
      setNewComment('');
    } catch (err) {
      alert('댓글 작성에 실패했습니다. 로그인했는지 확인해주세요.');
    }
  };

  const handlePostDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${API_URL}/api/v1/posts/${postId}`);
        navigate('/');
      } catch (err) {
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/posts/${postId}/like`);
      // Optimistically update the UI
      setPost(prevPost => ({ ...prevPost, likeCount: parseInt(prevPost.likeCount) + 1 }));
      alert('게시글을 추천했습니다!');
    } catch (err) {
      alert(err.response?.data?.message || '추천에 실패했습니다.');
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${API_URL}/api/v1/comments/${commentId}`);
        setComments(comments.filter(c => c.id !== commentId));
      } catch (err) {
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  const handleCommentEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
  };

  const handleCommentUpdate = async (commentId) => {
    try {
      const res = await axios.put(`${API_URL}/api/v1/comments/${commentId}`, { content: editingCommentText });
      setComments(comments.map(c => c.id === commentId ? res.data.comment : c));
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (err) {
      alert('댓글 수정에 실패했습니다.');
    }
  };

  if (loading) return <div className="text-center">로딩 중...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (!post) return <div className="text-center">게시글을 찾을 수 없습니다.</div>;

  const isPostAuthor = user && user.id === post.UserId;

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <h1 className="card-title">{post.title}</h1>
          <div className="text-muted mb-2"><small><span>작성자: {post.User?.username}</span> |<span> 작성일: {new Date(post.createdAt).toLocaleString()}</span> |<span> 조회수: {post.views}</span> |<span> 추천: {post.likeCount}</span></small></div>
          <hr />
          <div className="card-text" style={{ minHeight: '200px' }}>{post.content.split('\n').map((line, index) => (<React.Fragment key={index}>{line}<br /></React.Fragment>))}</div>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div>{user && (<button className="btn btn-success" onClick={handleLike}>👍 추천</button>)}</div>
          <div>{isPostAuthor && (<><Link to={`/posts/${postId}/edit`} className="btn btn-secondary me-2">수정</Link><button className="btn btn-danger" onClick={handlePostDelete}>삭제</button></>)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">댓글 ({comments.length})</h5>
          {user && (
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <div className="input-group"><textarea className="form-control" rows="3" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요..." required></textarea><button className="btn btn-primary" type="submit">등록</button></div>
            </form>
          )}
          <hr />
          {comments.length > 0 ? comments.map(comment => {
            const isCommentAuthor = user && user.id === comment.UserId;
            return (
              <div key={comment.id} className="mb-3 pb-2 border-bottom">
                <div className="d-flex justify-content-between">
                  <strong>{comment.User?.username}</strong>
                  <div className="d-flex align-items-center">
                    <small className="text-muted me-3">{new Date(comment.createdAt).toLocaleString()}</small>
                    {isCommentAuthor && (
                      <div>
                        {editingCommentId === comment.id ? (
                          <><button className="btn btn-sm btn-primary me-1">저장</button><button className="btn btn-sm btn-light" onClick={() => setEditingCommentId(null)}>취소</button></>
                        ) : (
                          <><button className="btn btn-sm btn-secondary me-1" onClick={() => handleCommentEdit(comment)}>수정</button><button className="btn btn-sm btn-danger" onClick={() => handleCommentDelete(comment.id)}>삭제</button></>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {editingCommentId === comment.id ? (
                  <textarea className="form-control mt-2" value={editingCommentText} onChange={(e) => setEditingCommentText(e.target.value)} rows="2"></textarea>
                ) : (
                  <p className="mt-2 mb-1">{comment.content}</p>
                )}
              </div>
            )
          }) : (
            <p>작성된 댓글이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Link to="/" className="btn btn-outline-secondary">목록으로</Link>
      </div>
    </div>
  );
};

export default PostDetailPage;
