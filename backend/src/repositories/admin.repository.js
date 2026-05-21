const pool = require('../config/db');
const { AppError } = require('../middlewares/errorHandler.middleware');

// ======================== USERS ========================

const getAllUsers = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  let whereClause = '';
  const params = [];

  if (search) {
    whereClause = `WHERE (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  const countQuery = `SELECT COUNT(*) as total FROM users u ${whereClause}`;
  const [countRows] = await pool.execute(countQuery, params);
  const total = countRows[0].total;

  const dataQuery = `
    SELECT u.id, u.full_name, u.email, u.phone, u.role, u.is_active, u.created_at,
           (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as order_count
    FROM users u
    ${whereClause}
    ORDER BY u.created_at DESC
    LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
  `;
  const [rows] = await pool.execute(dataQuery, params);

  return { data: rows, total, page: parseInt(page), limit: parseInt(limit) };
};

const getUserById = async (id) => {
  const [rows] = await pool.execute(`SELECT id, full_name, email, phone, role, is_active, avatar_url, created_at FROM users WHERE id = ?`, [id]);
  return rows[0];
};

const updateUser = async (id, { full_name, email, phone, role, is_active }) => {
  const [result] = await pool.execute(
    `UPDATE users SET full_name=?, email=?, phone=?, role=?, is_active=? WHERE id=?`,
    [full_name, email || null, phone || null, role, is_active, id]
  );
  return result.affectedRows;
};

const deleteUser = async (id) => {
  // Check if user has orders
  const [orders] = await pool.execute(`SELECT COUNT(*) as count FROM orders WHERE user_id = ?`, [id]);
  if (orders[0].count > 0) {
    throw new AppError('Không thể xóa người dùng có đơn hàng', 400);
  }
  
  const [result] = await pool.execute(`DELETE FROM users WHERE id = ?`, [id]);
  return result.affectedRows;
};

const updateUserPassword = async (id, passwordHash) => {
  const [result] = await pool.execute(
    `UPDATE users SET password_hash=? WHERE id=?`,
    [passwordHash, id]
  );
  return result.affectedRows;
};

// ======================== PRODUCTS ========================

const getAllProductsAdmin = async ({ page = 1, limit = 10, search = '', category = '' }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(p.name LIKE ? OR p.slug LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    conditions.push(`c.slug = ?`);
    params.push(category);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const countQuery = `SELECT COUNT(*) as total FROM products p LEFT JOIN product_categories c ON p.category_id = c.id ${where}`;
  const [countRows] = await pool.execute(countQuery, params);
  const total = countRows[0].total;

  const dataQuery = `
    SELECT p.id, p.name, p.slug, p.base_price, p.discount_pct, p.is_featured, p.is_active,
           c.name as category_name,
           COALESCE((SELECT SUM(pv.stock_qty) FROM product_variants pv WHERE pv.product_id = p.id), 0) as stock_qty,
           (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN product_categories c ON p.category_id = c.id
    ${where}
    ORDER BY p.created_at DESC
    LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
  `;
  const [rows] = await pool.execute(dataQuery, params);

  return { data: rows, total, page: parseInt(page), limit: parseInt(limit) };
};

const getProductAdminById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT p.*, c.name as category_name FROM products p LEFT JOIN product_categories c ON p.category_id = c.id WHERE p.id = ?`,
    [id]
  );
  if (!rows[0]) return null;
  const [variants] = await pool.execute(`SELECT * FROM product_variants WHERE product_id = ?`, [id]);
  
  // Lấy thuộc tính cho từng variant
  for (const variant of variants) {
    const [attrs] = await pool.execute(
      `SELECT va.attr_value_id, av.value, av.color_hex, av.display_order,
              at.id as type_id, at.name as type_name
       FROM variant_attributes va
       JOIN attribute_values av ON va.attr_value_id = av.id
       JOIN attribute_types at ON av.type_id = at.id
       WHERE va.variant_id = ?
       ORDER BY at.id, av.display_order`,
      [variant.id]
    );
    variant.attribute_values = attrs;
  }
  
  const [images] = await pool.execute(`SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC`, [id]);
  return { ...rows[0], variants, images };
};

const createProduct = async ({ name, slug, description, base_price, discount_pct, category_id, is_featured, is_active }) => {
  const [result] = await pool.execute(
    `INSERT INTO products (name, slug, sku_base, description, base_price, discount_pct, category_id, is_featured, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, slug, slug, description || '', base_price, discount_pct || 0, category_id || null, is_featured || 0, is_active ?? 1]
  );
  return result.insertId;
};

const updateProduct = async (id, { name, slug, description, base_price, discount_pct, category_id, is_featured, is_active }) => {
  const [result] = await pool.execute(
    `UPDATE products SET name=?, slug=?, description=?, base_price=?, discount_pct=?, category_id=?, is_featured=?, is_active=? WHERE id=?`,
    [name, slug, description || '', base_price, discount_pct || 0, category_id || null, is_featured || 0, is_active ?? 1, id]
  );
  return result.affectedRows;
};

const deleteProduct = async (id) => {
  const [result] = await pool.execute(`DELETE FROM products WHERE id = ?`, [id]);
  return result.affectedRows;
};

// ======================== ORDERS ========================

const getAllOrdersAdmin = async ({ page = 1, limit = 10, status = '', search = '' }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];
  if (search) {
    conditions.push(`(o.order_code LIKE ? OR u.full_name LIKE ? OR o.recipient_name LIKE ?)`);
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  if (status) {
    conditions.push(`o.status = ?`);
    params.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*) as total FROM orders o LEFT JOIN users u ON o.user_id = u.id ${where}`;
  const [countRows] = await pool.execute(countQuery, params);
  const total = countRows[0].total;

  const dataQuery = `
    SELECT o.id, o.order_code, o.recipient_name, o.recipient_phone, o.shipping_address,
           o.total_amount, o.order_status, o.payment_method, o.created_at,
           u.full_name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ${where}
    ORDER BY o.created_at DESC
    LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
  `;
  const [rows] = await pool.execute(dataQuery, params);

  return { data: rows, total, page: parseInt(page), limit: parseInt(limit) };
};

const getOrderAdminById = async (id) => {
  const [orderRows] = await pool.execute(
    `SELECT o.*, u.full_name as user_name, u.email as user_email FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ?`,
    [id]
  );
  if (!orderRows[0]) return null;

  const [itemRows] = await pool.execute(
    `SELECT oi.*, p.name as product_name FROM order_items oi LEFT JOIN products p ON oi.variant_id = p.id WHERE oi.order_id = ?`,
    [id]
  );

  return { ...orderRows[0], items: itemRows };
};

const updateOrderStatus = async (id, status) => {
  const [result] = await pool.execute(`UPDATE orders SET order_status = ? WHERE id = ?`, [status, id]);
  return result.affectedRows;
};

const deleteOrder = async (id) => {
  // First check if order exists and get its status
  const [orderRows] = await pool.execute(`SELECT order_status FROM orders WHERE id = ?`, [id]);
  if (!orderRows[0]) return null;
  
  // Only allow deletion if status is 'pending'
  if (orderRows[0].order_status !== 'pending') {
    throw new Error(`Cannot delete order with status: ${orderRows[0].order_status}`);
  }

  // Delete order items first (due to foreign key constraint)
  await pool.execute(`DELETE FROM order_items WHERE order_id = ?`, [id]);
  
  // Delete the order
  const [result] = await pool.execute(`DELETE FROM orders WHERE id = ?`, [id]);
  return result.affectedRows;
};

// ======================== STATS ========================

const getDashboardStats = async () => {
  const [rows1] = await pool.execute(`SELECT COUNT(*) as total_orders FROM orders`);
  const { total_orders } = rows1[0];
  
  const [rows2] = await pool.execute(`SELECT COUNT(*) as total_users FROM users WHERE role = 'customer'`);
  const { total_users } = rows2[0];
  
  const [rows3] = await pool.execute(`SELECT COUNT(*) as total_products FROM products`);
  const { total_products } = rows3[0];
  
  const [rows4] = await pool.execute(`SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE order_status != 'cancelled'`);
  const { total_revenue } = rows4[0];
  
  const [rows5] = await pool.execute(`SELECT COUNT(*) as pending_orders FROM orders WHERE order_status = 'pending'`);
  const { pending_orders } = rows5[0];

  const [recent_orders] = await pool.execute(`
    SELECT o.id, o.order_code, o.recipient_name, o.total_amount, o.order_status as status, o.created_at
    FROM orders o ORDER BY o.created_at DESC LIMIT 5
  `);

  return { total_orders, total_users, total_products, total_revenue, pending_orders, recent_orders };
};

module.exports = {
  getAllUsers, getUserById, updateUser, deleteUser, updateUserPassword,
  getAllProductsAdmin, getProductAdminById, createProduct, updateProduct, deleteProduct,
  getAllOrdersAdmin, getOrderAdminById, updateOrderStatus, deleteOrder,
  getDashboardStats
};
