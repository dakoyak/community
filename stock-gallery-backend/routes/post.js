// routes/post.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); // 게시글 컨트롤러
const commentController = require('../controllers/commentController'); // 댓글 컨트롤러
const likeController = require('../controllers/likeController'); // 추천 컨트롤러
const authMiddleware = require('../middleware/authMiddleware'); // 인증 미들웨어

// --- 게시글 CRUD API 정의 ---

// 1. 게시글 생성 (POST /api/v1/posts) - 로그인 필요
router.post('/', authMiddleware, postController.createPost);

// 2. 게시글 목록 조회 (GET /api/v1/posts) - 로그인 불필요
router.get('/', postController.getAllPosts);

// 3. 특정 게시글 상세 조회 (GET /api/v1/posts/:postId) - 로그인 불필요
router.get('/:postId', postController.getPostById);

// 4. 특정 게시글 수정 (PUT /api/v1/posts/:postId) - 로그인 필요 + 본인 확인 필요
router.put('/:postId', authMiddleware, postController.updatePost);

// 5. 특정 게시글 삭제 (DELETE /api/v1/posts/:postId) - 로그인 필요 + 본인 확인 필요
router.delete('/:postId', authMiddleware, postController.deletePost);


// --- 댓글 API (Nested Routes) ---

// 6. 특정 게시글에 댓글 생성 (POST /api/v1/posts/:postId/comments)
router.post('/:postId/comments', authMiddleware, commentController.createComment);

// 7. 특정 게시글의 댓글 목록 조회 (GET /api/v1/posts/:postId/comments)
router.get('/:postId/comments', commentController.getCommentsForPost);


// --- 추천 API (Nested Routes) ---

// 8. 게시글 추천 (POST /api/v1/posts/:postId/like)
router.post('/:postId/like', authMiddleware, likeController.likePost);

// 9. 게시글 추천 취소 (DELETE /api/v1/posts/:postId/like)
router.delete('/:postId/like', authMiddleware, likeController.unlikePost);


module.exports = router;
