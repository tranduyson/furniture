const { AppError } = require('./errorHandler.middleware');

/**
 * Middleware kiểm tra role = 'admin'
 * Phải dùng SAU verifyToken (req.user đã có)
 */
const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Chưa xác thực', 401));
  }
  if (req.user.role !== 'admin') {
    return next(new AppError('Bạn không có quyền truy cập trang quản trị', 403));
  }
  next();
};

module.exports = { verifyAdmin };
