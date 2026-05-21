const adminService = require('../services/admin.service');
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
const createProduct = async (req, res, next) => {
  try {
    const data = await adminService.createProduct(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
};
const updateProduct = async (req, res, next) => {
  try {
    const data = await adminService.updateProduct(req.params.id, req.body);
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
const createVariant = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const id = await productRepository.createVariant({ ...req.body, product_id: productId });
    // Nếu có attribute_value_ids, gán luôn
    if (req.body.attribute_value_ids && req.body.attribute_value_ids.length > 0) {
      await productRepository.setVariantAttributes(id, req.body.attribute_value_ids);
    }
    res.status(201).json({ success: true, data: { id } });
  } catch (e) { next(e); }
};

const updateVariant = async (req, res, next) => {
  try {
    await productRepository.updateVariant(req.params.id, req.body);
    // Nếu có attribute_value_ids, cập nhật lại
    if (req.body.attribute_value_ids) {
      await productRepository.setVariantAttributes(req.params.id, req.body.attribute_value_ids);
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

