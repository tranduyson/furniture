const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler.middleware');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('[AUTH.MIDDLEWARE] Token from header:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');

  if (!token) {
    return next(new AppError('No token provided. Please authenticate.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    console.log('[AUTH.MIDDLEWARE] Token decoded:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('[AUTH.MIDDLEWARE] Token verification error:', error.message);
    return next(new AppError('Invalid or expired token', 401));
  }
};

// Optional auth: decode token nếu có, nhưng không chặn request nếu không có token
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = decoded;
    } catch (error) {
      // Token không hợp lệ → bỏ qua, coi như khách vãng lai
      req.user = null;
    }
  }
  next();
};

module.exports = { verifyToken, optionalAuth };
