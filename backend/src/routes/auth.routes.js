const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Xác thực người dùng (Đăng ký, Đăng nhập, JWT)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 example: nva@gmail.com
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       409:
 *         description: Email hoặc SĐT đã tồn tại
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập và lấy Access/Refresh Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: nva@gmail.com
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về accessToken và refreshToken
 *       401:
 *         description: Sai mật khẩu hoặc tài khoản không tồn tại
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng đang đăng nhập
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin User Profile
 *       401:
 *         description: Chưa xác thực (Token không hợp lệ)
 */
router.get('/me', verifyToken, authController.getMe);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Làm mới Access Token bằng Refresh Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access Token mới
 *       401:
 *         description: Refresh Token không hợp lệ hoặc đã hết hạn
 */
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
