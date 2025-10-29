// controllers/likeController.js

const { Like, Post } = require('../models');

// 1. 게시글 추천 (POST /api/v1/posts/:postId/like)
exports.likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    const [like, created] = await Like.findOrCreate({
      where: {
        UserId: userId,
        PostId: postId,
      },
      defaults: {
        UserId: userId,
        PostId: postId,
      }
    });

    if (created) {
      return res.status(201).json({ message: '게시글을 추천했습니다.' });
    } else {
      return res.status(200).json({ message: '이미 추천한 게시글입니다.' });
    }
  } catch (error) {
    next(error);
  }
};

// 2. 게시글 추천 취소 (DELETE /api/v1/posts/:postId/like)
exports.unlikePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const deleted = await Like.destroy({
      where: {
        UserId: userId,
        PostId: postId,
      },
    });

    if (deleted) {
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: '추천 기록을 찾을 수 없습니다.' });
    }
  } catch (error) {
    next(error);
  }
};
