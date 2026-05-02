const adminRepo = require('../repositories/admin.repository');
const { AppError } = require('../middlewares/errorHandler.middleware');

// ======================== DASHBOARD ========================
const getDashboardStats = async () => adminRepo.getDashboardStats();

// ======================== USERS ========================
const getAllUsers = async (query) => adminRepo.getAllUsers(query);
const getUserById = async (id) => {
  const user = await adminRepo.getUserById(id);
  if (!user) throw new AppError('Không tìm thấy người dùng', 404);
  return user;
};
const updateUser = async (id, body) => {
  const rows = await adminRepo.updateUser(id, body);
  if (!rows) throw new AppError('Không tìm thấy người dùng', 404);
  return { success: true };
};
const deleteUser = async (id) => {
  const rows = await adminRepo.deleteUser(id);
  if (!rows) throw new AppError('Không tìm thấy người dùng', 404);
  return { success: true };
};

// ======================== PRODUCTS ========================
const getAllProducts = async (query) => adminRepo.getAllProductsAdmin(query);
const getProductById = async (id) => {
  const p = await adminRepo.getProductAdminById(id);
  if (!p) throw new AppError('Không tìm thấy sản phẩm', 404);
  return p;
};
const createProduct = async (body) => {
  const id = await adminRepo.createProduct(body);
  return { id };
};
const updateProduct = async (id, body) => {
  const rows = await adminRepo.updateProduct(id, body);
  if (!rows) throw new AppError('Không tìm thấy sản phẩm', 404);
  return { success: true };
};
const deleteProduct = async (id) => {
  const rows = await adminRepo.deleteProduct(id);
  if (!rows) throw new AppError('Không tìm thấy sản phẩm', 404);
  return { success: true };
};

// ======================== ORDERS ========================
const getAllOrders = async (query) => adminRepo.getAllOrdersAdmin(query);
const getOrderById = async (id) => {
  const order = await adminRepo.getOrderAdminById(id);
  if (!order) throw new AppError('Không tìm thấy đơn hàng', 404);
  return order;
};
const updateOrderStatus = async (id, status) => {
  const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) throw new AppError('Trạng thái không hợp lệ', 400);
  const rows = await adminRepo.updateOrderStatus(id, status);
  if (!rows) throw new AppError('Không tìm thấy đơn hàng', 404);
  return { success: true };
};

module.exports = {
  getDashboardStats,
  getAllUsers, getUserById, updateUser, deleteUser,
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct,
  getAllOrders, getOrderById, updateOrderStatus
};
