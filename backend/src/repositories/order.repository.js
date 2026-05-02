const pool = require('../config/db');

const createOrderWithTransaction = async (orderData, orderItems, userId, cartId) => {
  console.log('[ORDER.REPOSITORY] createOrderWithTransaction - orderData:', orderData, 'items:', orderItems.length);
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    console.log('[ORDER.REPOSITORY] Transaction started');

    // 1. Insert Order
    const [orderResult] = await connection.execute(`
      INSERT INTO orders 
      (order_code, user_id, recipient_name, recipient_phone, shipping_address, subtotal, discount_amount, shipping_fee, total_amount, coupon_id, coupon_code_snapshot, payment_method, payment_status, order_status, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderData.order_code,
      orderData.user_id,
      orderData.recipient_name,
      orderData.recipient_phone,
      orderData.shipping_address,
      orderData.subtotal,
      orderData.discount_amount,
      orderData.shipping_fee,
      orderData.total_amount,
      orderData.coupon_id,
      orderData.coupon_code_snapshot,
      orderData.payment_method,
      orderData.payment_status,
      orderData.order_status,
      orderData.note
    ]);

    const orderId = orderResult.insertId;
    console.log('[ORDER.REPOSITORY] Order inserted with ID:', orderId);

    // 2. Insert Order Items
    const itemQuery = `INSERT INTO order_items (order_id, variant_id, product_name, variant_sku, variant_attrs, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    for (const item of orderItems) {
      await connection.execute(itemQuery, [
        orderId,
        item.variant_id,
        item.product_name,
        item.variant_sku,
        item.variant_attrs,
        item.unit_price,
        item.quantity,
        item.line_total
      ]);
      
      // Reduce Stock Quantity (only if variant_id exists)
      if (item.variant_id) {
        await connection.execute(`UPDATE product_variants SET stock_qty = stock_qty - ? WHERE id = ?`, [item.quantity, item.variant_id]);
      }
    }
    console.log('[ORDER.REPOSITORY] Order items inserted');

    // 3. Create Status History
    await connection.execute(`
      INSERT INTO order_status_history (order_id, to_status, note)
      VALUES (?, ?, 'Chờ xác nhận đơn hàng')
    `, [orderId, orderData.order_status]);

    // 4. Update Coupon Usage Count if valid
    if (orderData.coupon_id) {
      await connection.execute(`UPDATE coupon_codes SET used_count = used_count + 1 WHERE id = ?`, [orderData.coupon_id]);
    }

    // 5. Clear Cart Items (only if user is authenticated)
    if (cartId) {
      await connection.execute(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
      await connection.execute(`UPDATE carts SET coupon_id = NULL WHERE id = ?`, [cartId]);
    }

    // Commit Transaction
    await connection.commit();
    console.log('[ORDER.REPOSITORY] Transaction committed successfully');
    return orderId;
  } catch (error) {
    console.error('[ORDER.REPOSITORY] Transaction error:', error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const findOrdersByUserId = async (userId) => {
  console.log('[ORDER.REPOSITORY] findOrdersByUserId - querying for userId:', userId);
  const [rows] = await pool.execute(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
  console.log('[ORDER.REPOSITORY] findOrdersByUserId - found rows:', rows.length);
  return rows;
};

const findOrderByIdAndUser = async (userId, orderId) => {
  const [rows] = await pool.execute(`SELECT * FROM orders WHERE id = ? AND user_id = ? LIMIT 1`, [orderId, userId]);
  return rows[0];
};

const findOrderItems = async (orderId) => {
  const [rows] = await pool.execute(`SELECT * FROM order_items WHERE order_id = ?`, [orderId]);
  return rows;
};

const findOrderStatusHistory = async (orderId) => {
  const [rows] = await pool.execute(`SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC`, [orderId]);
  return rows;
};

module.exports = {
  createOrderWithTransaction,
  findOrdersByUserId,
  findOrderByIdAndUser,
  findOrderItems,
  findOrderStatusHistory
};
