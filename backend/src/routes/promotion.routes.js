const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotion.controller');

/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Quản lý khuyến mãi và ưu đãi
 */

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Lấy trang khuyến mãi (sản phẩm giảm giá, chương trình KM, mã giảm giá)
 *     tags: [Promotions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Thông tin khuyến mãi
 */
router.get('/', promotionController.getPromotions);

module.exports = router;
