const adminService = require('../services/admin.service');
const adminRepository = require('../repositories/admin.repository');
const productRepository = require('../repositories/product.repository');

// Dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardStats();
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

// Users
const getAllUsers = async (req, res, next) => {
  try {
    const data = await adminService.getAllUsers(req.query);
    res.json({ success: true, ...data });
  } catch (e) { next(e); }
};
const getUserById = async (req, res, next) => {
  try {
    const data = await adminService.getUserById(req.params.id);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};
const updateUser = async (req, res, next) => {
  try {
    const data = await adminService.updateUser(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};
const deleteUser = async (req, res, next) => {
  try {
    const data = await adminService.deleteUser(req.params.id);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const data = await adminService.updateUserPassword(req.params.id, newPassword);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

// Products
const getAllProducts = async (req, res, next) => {
  try {
    const data = await adminService.getAllProducts(req.query);
    res.json({ success: true, ...data });
  } catch (e) { next(e); }
};
const getProductById = async (req, res, next) => {
  try {
    const data = await adminService.getProductById(req.params.id);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const normalizeProductPayload = (req) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.primary_image = `/uploads/products/${req.file.filename}`;
  }
  return payload;
};

const normalizeProductImagePayload = (req) => {
  const payload = { ...req.body };
  payload.is_primary = payload.is_primary === '1' || payload.is_primary === 'true' || payload.is_primary === true ? 1 : 0;
  if (req.files && req.files.length > 0) {
    payload.image_urls = req.files.map(file => `/uploads/products/${file.filename}`);
  }
  if (payload.image_url && typeof payload.image_url === 'string') {
    payload.image_url = payload.image_url.trim();
  }
  return payload;
};

const createProduct = async (req, res, next) => {
  try {
    const payload = normalizeProductPayload(req);
    const data = await adminService.createProduct(payload);
    if (payload.primary_image) {
      await adminRepository.setPrimaryProductImage(data.id, payload.primary_image);
    }
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
};
const updateProduct = async (req, res, next) => {
  try {
    const payload = normalizeProductPayload(req);
    const data = await adminService.updateProduct(req.params.id, payload);
    if (payload.primary_image) {
      await adminRepository.setPrimaryProductImage(req.params.id, payload.primary_image);
    }
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const uploadProductImages = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const payload = normalizeProductImagePayload(req);
    const urls = payload.image_urls || (payload.image_url ? [payload.image_url] : []);
    if (!urls.length) {
      throw new Error('Không có ảnh để lưu');
    }

    const created = [];
    for (let i = 0; i < urls.length; i += 1) {
      const imageUrl = urls[i];
      const isPrimary = payload.is_primary && i === 0 ? 1 : 0;
      const id = await adminRepository.createProductImage(productId, imageUrl, isPrimary);
      if (isPrimary) {
        await adminRepository.setPrimaryProductImageById(id);
      }
      created.push({ id, image_url: imageUrl, is_primary: isPrimary });
    }
    res.status(201).json({ success: true, data: created });
  } catch (e) { next(e); }
};

const updateProductImage = async (req, res, next) => {
  try {
    const { is_primary, alt_text } = req.body;
    const payload = {};
    if (typeof alt_text !== 'undefined') payload.alt_text = alt_text;
    if (typeof is_primary !== 'undefined') payload.is_primary = is_primary;
    const data = await adminRepository.updateProductImage(req.params.id, payload);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const deleteProductImage = async (req, res, next) => {
  try {
    const data = await adminRepository.deleteProductImage(req.params.id);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const data = await adminService.deleteProduct(req.params.id);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

// ======================== ATTRIBUTE TYPES ========================
const getAttributeTypes = async (req, res, next) => {
  try {
    const data = await productRepository.findAllAttributeTypes();
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const createAttributeType = async (req, res, next) => {
  try {
    const { name } = req.body;
    const id = await productRepository.createAttributeType(name);
    res.status(201).json({ success: true, data: { id, name } });
  } catch (e) { next(e); }
};

const deleteAttributeType = async (req, res, next) => {
  try {
    await productRepository.deleteAttributeType(req.params.id);
    res.json({ success: true });
  } catch (e) { next(e); }
};

// ======================== ATTRIBUTE VALUES ========================
const getAttributeValues = async (req, res, next) => {
  try {
    const { type_id } = req.query;
    let data;
    if (type_id) {
      data = await productRepository.findAttributeValuesByTypeId(type_id);
    } else {
      data = await productRepository.findAllAttributeValues();
    }
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const createAttributeValue = async (req, res, next) => {
  try {
    const id = await productRepository.createAttributeValue(req.body);
    res.status(201).json({ success: true, data: { id } });
  } catch (e) { next(e); }
};

const updateAttributeValue = async (req, res, next) => {
  try {
    await productRepository.updateAttributeValue(req.params.id, req.body);
    res.json({ success: true });
  } catch (e) { next(e); }
};

const deleteAttributeValue = async (req, res, next) => {
  try {
    await productRepository.deleteAttributeValue(req.params.id);
    res.json({ success: true });
  } catch (e) { next(e); }
};

// ======================== VARIANTS ========================
const normalizeVariantPayload = (req) => {
  const payload = { ...req.body };

  if (req.file) {
    payload.image_url = `/uploads/variants/${req.file.filename}`;
  }

  if (typeof payload.attribute_value_ids === 'string') {
    try {
      payload.attribute_value_ids = JSON.parse(payload.attribute_value_ids);
    } catch {
      payload.attribute_value_ids = payload.attribute_value_ids ? payload.attribute_value_ids.split(',').map(v => v.trim()).filter(Boolean) : [];
    }
  }

  if (payload.attribute_value_ids && !Array.isArray(payload.attribute_value_ids)) {
    payload.attribute_value_ids = [payload.attribute_value_ids];
  }

  return payload;
};

const createVariant = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const payload = normalizeVariantPayload(req);
    const id = await productRepository.createVariant({ ...payload, product_id: productId });
    if (payload.attribute_value_ids && payload.attribute_value_ids.length > 0) {
      await productRepository.setVariantAttributes(id, payload.attribute_value_ids);
    }
    res.status(201).json({ success: true, data: { id } });
  } catch (e) { next(e); }
};

const updateVariant = async (req, res, next) => {
  try {
    const payload = normalizeVariantPayload(req);
    await productRepository.updateVariant(req.params.id, payload);
    if (payload.attribute_value_ids) {
      await productRepository.setVariantAttributes(req.params.id, payload.attribute_value_ids);
    }
    res.json({ success: true });
  } catch (e) { next(e); }
};

const deleteVariant = async (req, res, next) => {
  try {
    await productRepository.deleteVariant(req.params.id);
    res.json({ success: true });
  } catch (e) { next(e); }
};

// ======================== VARIANT ATTRIBUTES ========================
const getVariantAttributes = async (req, res, next) => {
  try {
    const data = await productRepository.findVariantAttributes(req.params.variantId);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const setVariantAttributes = async (req, res, next) => {
  try {
    const { attr_value_ids } = req.body;
    await productRepository.setVariantAttributes(req.params.variantId, attr_value_ids || []);
    res.json({ success: true });
  } catch (e) { next(e); }
};

// Orders
const getAllOrders = async (req, res, next) => {
  try {
    const data = await adminService.getAllOrders(req.query);
    res.json({ success: true, ...data });
  } catch (e) { next(e); }
};
const getOrderById = async (req, res, next) => {
  try {
    const data = await adminService.getOrderById(req.params.id);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const data = await adminService.updateOrderStatus(req.params.id, status);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const deleteOrder = async (req, res, next) => {
  try {
    const data = await adminService.deleteOrder(req.params.id);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

module.exports = {
  getDashboardStats,
  getAllUsers, getUserById, updateUser, deleteUser, resetUserPassword,
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct,
  uploadProductImages, updateProductImage, deleteProductImage,
  // Attribute Types
  getAttributeTypes, createAttributeType, deleteAttributeType,
  // Attribute Values
  getAttributeValues, createAttributeValue, updateAttributeValue, deleteAttributeValue,
  // Variants
  createVariant, updateVariant, deleteVariant,
  // Variant Attributes
  getVariantAttributes, setVariantAttributes,
  // Orders
  getAllOrders, getOrderById, updateOrderStatus, deleteOrder
};

