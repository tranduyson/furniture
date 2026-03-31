const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Quản lý Giỏ hàng (hỗ trợ khách vãng lai & user đăng nhập)
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Lấy giỏ hàng hiện tại
 *     tags: [Cart]
 *     parameters:
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Session ID cho khách chưa đăng nhập
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách sản phẩm trong giỏ và tổng tiền
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variant_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Thêm vào giỏ hàng thành công
 *       400:
 *         description: Sản phẩm không đủ số lượng trong kho
 */
router.post('/add', cartController.addToCart);

/**
 * @swagger
 * /api/cart/apply-coupon:
 *   post:
 *     summary: Áp dụng mã giảm giá vào giỏ hàng
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coupon_code:
 *                 type: string
 *                 example: SONTD2026
 *     responses:
 *       200:
 *         description: Áp dụng mã thành công, trả về giỏ hàng đã cập nhật
 *       400:
 *         description: Mã giảm giá không hợp lệ hoặc chưa đạt giá trị tối thiểu
 */
router.post('/apply-coupon', cartController.applyCoupon);

module.exports = router;
