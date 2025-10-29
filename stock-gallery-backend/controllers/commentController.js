// controllers/commentController.js

const { Comment, User, Post } = require('../models');

// 1. 특정 게시글에 대한 댓글 생성 (POST /api/v1/posts/:postId/comments)
exports.createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    const newComment = await Comment.create({
      content,
      UserId: userId,
      PostId: postId,
    });

    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [{
        model: User,
        attributes: ['id', 'username'],
      }],
    });

    res.status(201).json({
      message: '댓글이 성공적으로 생성되었습니다.',
      comment: commentWithUser,
    });
  } catch (error) {
    next(error);
  }
};

// 2. 특정 게시글의 모든 댓글 조회 (GET /api/v1/posts/:postId/comments)
exports.getCommentsForPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    const comments = await Comment.findAll({
      where: { PostId: postId },
      include: [{
        model: User,
        attributes: ['id', 'username'],
      }],
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json({
      message: '댓글 목록 조회 성공',
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// 3. 댓글 수정 (PUT /api/v1/comments/:commentId)
exports.updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: '수정할 내용을 입력해주세요.' });
    }

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    if (comment.UserId !== userId) {
      return res.status(403).json({ message: '댓글 수정 권한이 없습니다.' });
    }

    await comment.update({ content });

    const updatedComment = await Comment.findByPk(commentId, {
        include: [{ model: User, attributes: ['id', 'username'] }]
    });

    res.status(200).json({
      message: '댓글이 성공적으로 수정되었습니다.',
      comment: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// 4. 댓글 삭제 (DELETE /api/v1/comments/:commentId)
exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    if (comment.UserId !== userId) {
      return res.status(403).json({ message: '댓글 삭제 권한이 없습니다.' });
    }

    await comment.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
