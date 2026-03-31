const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Đặt hàng, Lịch sử và Chi tiết Đơn hàng
 */

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Đặt hàng (Checkout) từ giỏ hàng hiện tại
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipient_name
 *               - recipient_phone
 *               - shipping_address
 *               - payment_method
 *             properties:
 *               recipient_name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               recipient_phone:
 *                 type: string
 *                 example: "0912345678"
 *               shipping_address:
 *                 type: string
 *                 example: 123 Điện Biên Phủ, Quận 3, TP.HCM
 *               payment_method:
 *                 type: string
 *                 enum: [cod, bank_transfer, vnpay, momo]
 *                 example: cod
 *               note:
 *                 type: string
 *                 example: Giao hàng buổi sáng
 *     responses:
 *       201:
 *         description: Đặt hàng thành công (kèm order_id và order_code)
 *       400:
 *         description: Giỏ hàng trống hoặc thiếu thông tin giao hàng
 *       401:
 *         description: Chưa đăng nhập
 */
router.post('/checkout', verifyToken, orderController.checkout);

/**
 * @swagger
 * /api/orders/history:
 *   get:
 *     summary: Lấy lịch sử đơn hàng của người dùng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng đã đặt
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/history', verifyToken, orderController.getOrderHistory);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Xem chi tiết một đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng (kèm order_items, status_history)
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get('/:id', verifyToken, orderController.getOrderDetails);

module.exports = router;
