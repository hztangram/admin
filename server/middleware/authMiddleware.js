const dotenv = require('dotenv');
dotenv.config({
  path: './.env',
});
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

exports.auth = (req, res, next) => {
  // 인증 완료
  try {
    // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
    // req.decoded = jwt.verify(req.headers.authorization, jwtSecret);
    // 쿠키에 user 이름으로 JWT 저장
    req.decoded = jwt.verify(req.cookies.user, jwtSecret);
    return next();
  } catch (error) {
    // 인증 실패
    // 유효시간이 초과된 경우
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.',
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        message: '유효하지 않은 토큰입니다.',
      });
    }
  }
};
