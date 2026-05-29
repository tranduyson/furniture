const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { verifyAdmin } = require('../middlewares/admin.middleware');

const variantUploadsDir = path.resolve(__dirname, '../../uploads/variants');
const productUploadsDir = path.resolve(__dirname, '../../uploads/products');
fs.mkdirSync(variantUploadsDir, { recursive: true });
fs.mkdirSync(productUploadsDir, { recursive: true });

const sanitizeFilename = (name) => {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
};

const imageStorage = (destinationDir) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, destinationDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const safeName = sanitizeFilename(baseName) || 'image';
    const fileName = `${Date.now()}-${safeName}${ext}`;
    cb(null, fileName);
  }
});

const imageFileFilter = (req, file, cb) => {
  if (/^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Chỉ chấp nhận ảnh (png, jpg, jpeg, webp, gif, svg)'));
};

const productUpload = multer({
  storage: imageStorage(productUploadsDir),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
});

const variantUpload = multer({
  storage: imageStorage(variantUploadsDir),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
});

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
router.post('/products', productUpload.single('primary_image'), adminController.createProduct);
router.put('/products/:id', productUpload.single('primary_image'), adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.post('/products/:productId/images', productUpload.array('product_images', 12), adminController.uploadProductImages);
router.patch('/products/images/:id', adminController.updateProductImage);
router.delete('/products/images/:id', adminController.deleteProductImage);

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
router.post('/products/:productId/variants', variantUpload.single('variant_image'), adminController.createVariant);
router.put('/variants/:id', variantUpload.single('variant_image'), adminController.updateVariant);
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

