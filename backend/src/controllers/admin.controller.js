const adminService = require('../services/admin.service');

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

module.exports = {
  getDashboardStats,
  getAllUsers, getUserById, updateUser, deleteUser,
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct,
  getAllOrders, getOrderById, updateOrderStatus
};
