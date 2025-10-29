// controllers/postController.js

const { Post, User, Like, Sequelize } = require('../models'); // Like, Sequelize 추가
const Op = Sequelize.Op;

// --- 1. 게시글 생성 로직 ---
exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: '제목과 내용을 모두 입력해주세요.' });
    }

    const newPost = await Post.create({
      title,
      content,
      UserId: userId,
    });

    const postWithUser = await Post.findByPk(newPost.id, {
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });

    res.status(201).json({
      message: '게시글이 성공적으로 생성되었습니다.',
      post: postWithUser,
    });

  } catch (error) {
    next(error);
  }
};

// --- 2. 게시글 목록 조회 로직 ---
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const { count, rows: posts } = await Post.findAndCountAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "Likes"
              WHERE
                "Likes"."PostId" = "Post"."id"
            )`),
            'likeCount'
          ]
        ]
      },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
      distinct: true,
    });

    res.status(200).json({
      message: '게시글 목록 조회 성공',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      posts: posts,
    });

  } catch (error) {
    next(error);
  }
};

// --- 3. 특정 게시글 상세 조회 로직 ---
exports.getPostById = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    // 조회수 먼저 증가
    await Post.increment('views', { where: { id: postId } });

    const post = await Post.findByPk(postId, {
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "Likes"
              WHERE
                "Likes"."PostId" = "Post"."id"
            )`),
            'likeCount'
          ]
        ]
      },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json({
      message: '게시글 상세 조회 성공',
      post: post
    });

  } catch (error) {
    next(error);
  }
};

// --- 4. 특정 게시글 수정 로직 ---
exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title && !content) {
      return res.status(400).json({ message: '수정할 제목이나 내용을 입력해주세요.' });
    }

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    if (post.UserId !== userId) {
      return res.status(403).json({ message: '게시글 수정 권한이 없습니다.' });
    }

    const updatedPostData = {};
    if (title) updatedPostData.title = title;
    if (content) updatedPostData.content = content;

    await post.update(updatedPostData);

    const updatedPost = await Post.findByPk(postId, {
       include: [{ model: User, attributes: ['id', 'username'] }]
    });

    res.status(200).json({
      message: '게시글이 성공적으로 수정되었습니다.',
      post: updatedPost
    });

  } catch (error) {
    next(error);
  }
};

// --- 5. 특정 게시글 삭제 로직 ---
exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    if (post.UserId !== userId) {
      return res.status(403).json({ message: '게시글 삭제 권한이 없습니다.' });
    }

    await post.destroy();

    res.status(204).send();

  } catch (error) {
    next(error);
  }
};