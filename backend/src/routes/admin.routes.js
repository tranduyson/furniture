const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { verifyAdmin } = require('../middlewares/admin.middleware');

// All admin routes require auth + admin role
router.use(verifyToken, verifyAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Users
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.patch('/users/:id/password', adminController.resetUserPassword);
router.delete('/users/:id', adminController.deleteUser);

// Products
router.get('/products', adminController.getAllProducts);
router.get('/products/:id', adminController.getProductById);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Attribute Types
router.get('/attribute-types', adminController.getAttributeTypes);
router.post('/attribute-types', adminController.createAttributeType);
router.delete('/attribute-types/:id', adminController.deleteAttributeType);

// Attribute Values
router.get('/attribute-values', adminController.getAttributeValues);
router.post('/attribute-values', adminController.createAttributeValue);
router.put('/attribute-values/:id', adminController.updateAttributeValue);
router.delete('/attribute-values/:id', adminController.deleteAttributeValue);

// Product Variants
router.post('/products/:productId/variants', adminController.createVariant);
router.put('/variants/:id', adminController.updateVariant);
router.delete('/variants/:id', adminController.deleteVariant);

// Variant Attributes (gán thuộc tính cho variant)
router.get('/variants/:variantId/attributes', adminController.getVariantAttributes);
router.put('/variants/:variantId/attributes', adminController.setVariantAttributes);

// Orders
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderById);
router.patch('/orders/:id/status', adminController.updateOrderStatus);
router.delete('/orders/:id', adminController.deleteOrder);

module.exports = router;

