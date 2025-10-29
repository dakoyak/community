// controllers/authController.js

const bcrypt = require('bcrypt'); // 비밀번호 암호화/비교 라이브러리
const jwt = require('jsonwebtoken'); // JWT 라이브러리
const { User } = require('../models'); // User 모델 가져오기
const { Sequelize } = require('../models'); // Sequelize 인스턴스/라이브러리 가져오기 (Op 사용 위해)
const Op = Sequelize.Op; // Sequelize 연산자(Operator) 사용 설정

// --- 회원가입 로직 (이전 단계에서 구현 완료) ---
exports.register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: '이메일, 비밀번호, 닉네임을 모두 입력해주세요.' });
    }
    const existingUser = await User.findOne({ where: { [Op.or]: [{ email: email }, { username: username }] } });
    if (existingUser) {
      const field = existingUser.email === email ? '이메일' : '닉네임';
      return res.status(409).json({ message: `이미 사용 중인 ${field}입니다.` });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ email, password: hashedPassword, username });
    res.status(201).json({
      message: '회원가입 성공!',
      user: { id: newUser.id, email: newUser.email, username: newUser.username, createdAt: newUser.createdAt },
    });
  } catch (error) {
    next(error);
  }
};

// --- 로그인 로직 구현 ---
exports.login = async (req, res, next) => {
  try {
    // 1. 요청 본문에서 이메일, 비밀번호 가져오기
    const { email, password } = req.body;

    // 2. 입력값 검증
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
    }

    // 3. 사용자 찾기 (이메일 기준)
    const user = await User.findOne({ where: { email } });

    // 4. 사용자가 없는 경우 -> 401 Unauthorized 응답
    if (!user) {
      // 보안 상 "이메일이 없습니다" 보다는 "이메일 또는 비밀번호 불일치"가 더 좋음
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 5. 비밀번호 비교 (bcrypt.compare 사용)
    // bcrypt.compare(사용자가 입력한 평문 비밀번호, DB에 저장된 암호화된 비밀번호)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 6. 비밀번호가 틀린 경우 -> 401 Unauthorized 응답
    if (!isPasswordValid) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // --- 여기까지 왔다면 로그인 성공! ---

    // 7. JWT 생성
    // jwt.sign(payload, secretKey, options)
    const token = jwt.sign(
      { userId: user.id },      // 페이로드(Payload): 토큰에 담을 정보 (여기서는 사용자 ID)
      process.env.JWT_SECRET,   // 비밀키 (.env 파일에서 가져옴)
      { expiresIn: '1h' }       // 옵션(Options): 토큰 유효 기간 설정 (예: 1시간)
    );

    // 8. 로그인 성공 응답 (200 OK) - JWT 토큰 포함
    res.status(200).json({
      message: '로그인 성공!',
      token: token, // 생성된 JWT 토큰
      user: { // 프론트엔드 편의를 위해 사용자 정보 일부 포함 (선택 사항)
        id: user.id,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    next(error);
  }
};

