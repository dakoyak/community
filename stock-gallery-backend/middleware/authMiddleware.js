// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  // 1. 요청 헤더에서 토큰 추출
  const { authorization } = req.headers;

  // 'Authorization' 헤더가 없거나 'Bearer '로 시작하지 않으면 에러
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 정보가 유효하지 않습니다. 로그인이 필요합니다.' });
  }

  const token = authorization.split(' ')[1];

  try {
    // 2. 토큰 검증
    //    - JWT_SECRET을 사용하여 토큰을 디코딩하고 유효성을 검사합니다.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. 디코딩된 사용자 ID로 데이터베이스에서 사용자 정보 조회
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 4. req 객체에 사용자 정보(user)를 추가하여 다음 미들웨어 또는 라우트 핸들러로 전달
    req.user = user;
    next(); // 다음 미들웨어로 제어 전달

  } catch (error) {
    // 토큰 검증 실패 시 에러 처리
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '토큰이 만료되었습니다.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
    // 기타 에러
    console.error('인증 미들웨어 에러:', error);
    return res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
  }
};

module.exports = authMiddleware;
