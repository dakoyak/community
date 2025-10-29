// middleware/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // 기본 에러 상태 코드와 메시지
  let statusCode = err.statusCode || 500;
  let message = err.message || '서버 내부 오류가 발생했습니다.';

  // Sequelize 에러 처리 (선택적)
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409; // Conflict
    message = '이미 존재하는 데이터입니다.';
  }

  res.status(statusCode).json({ message });
};

module.exports = errorMiddleware;
