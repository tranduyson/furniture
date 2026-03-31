const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Quản lý sản phẩm, danh mục và bộ sưu tập
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm (có phân trang & lọc)
 *     tags: [Products]
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
 *           default: 12
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Slug danh mục (ví dụ nem-blog)
 *       - in: query
 *         name: collection
 *         schema:
 *           type: string
 *         description: Slug bộ sưu tập (ví dụ astro)
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm kèm pagination
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Lấy tất cả danh mục sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Danh sách danh mục sản phẩm
 */
router.get('/categories', productController.getCategories);

/**
 * @swagger
 * /api/products/collections:
 *   get:
 *     summary: Lấy tất cả bộ sưu tập
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Danh sách bộ sưu tập
 */
router.get('/collections', productController.getCollections);

/**
 * @swagger
 * /api/products/{slug}:
 *   get:
 *     summary: Xem chi tiết sản phẩm theo slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: nem-foam-moho-sleep-balance
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm (kèm Variants, Ảnh, Thông số)
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get('/:slug', productController.getProductBySlug);

module.exports = router;
