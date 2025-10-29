// routes/comment.js

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// 댓글 수정 (PUT /api/v1/comments/:commentId)
router.put('/:commentId', authMiddleware, commentController.updateComment);

// 댓글 삭제 (DELETE /api/v1/comments/:commentId)
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
