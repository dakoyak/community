const express = require('express');
const router = express.Router(); // Express 라우터 객체 생성
const authController = require('../controllers/authController'); // 컨트롤러 불러오기

// POST /api/v1/auth/register - 회원가입 요청 처리
router.post('/register', authController.register);

// POST /api/v1/auth/login - 로그인 요청 처리
router.post('/login', authController.login);

// (추후 추가될 라우트: 예: GET /me - 내 정보 조회 등)

module.exports = router; // 라우터 객체 내보내기
