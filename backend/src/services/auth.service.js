const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userRepository = require('../repositories/user.repository');
const { AppError } = require('../middlewares/errorHandler.middleware');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret123';

const registerUser = async (userData) => {
  const { full_name, email, phone, password } = userData;
  if (!email && !phone) throw new AppError('Cần cung cấp Email hoặc Số điện thoại', 400);

  const existingUser = await userRepository.findByEmailOrPhone(email, phone);
  if (existingUser) throw new AppError('Email hoặc SĐT đã được sử dụng', 409);

  const password_hash = await bcrypt.hash(password, 10);
  const userId = await userRepository.createUser({ full_name, email, phone, password_hash });

  return { userId, full_name, email, phone };
};

const loginUser = async (credentials) => {
  const { email, phone, password } = credentials;
  if (!email && !phone) throw new AppError('Cần Email hoặc Số điện thoại', 400);

  const user = await userRepository.findByEmailOrPhone(email, phone);
  if (!user || user.is_active === 0) throw new AppError('Tài khoản không tồn tại hoặc bị khóa', 401);

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new AppError('Mật khẩu không chính xác', 401);

  // Generate tokens
  const payload = { id: user.id, email: user.email, name: user.full_name, role: user.role || 'customer' };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

  // Lấy User Agent
  const deviceInfo = JSON.stringify({ device: 'web' });

  // Store refresh token
  await userRepository.storeRefreshToken(user.id, refreshToken, deviceInfo);

  return {
    user: { id: user.id, full_name: user.full_name, email: user.email, avatar: user.avatar_url, role: user.role || 'customer' },
    accessToken,
    refreshToken
  };
};

const getUserProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  delete user.password_hash;
  return user;
};

const refreshAccessToken = async (rToken) => {
  if (!rToken) throw new AppError('Refresh token required', 400);

  try {
    const decoded = jwt.verify(rToken, REFRESH_SECRET);
    const session = await userRepository.findSession(decoded.id, rToken);
    if (!session) throw new AppError('Session expired or invalid', 401);

    const payload = { id: decoded.id, email: decoded.email, name: decoded.name };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return { accessToken };
  } catch (err) {
    throw new AppError('Invalid refresh token', 401);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  refreshAccessToken
};
