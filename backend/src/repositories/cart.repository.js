const pool = require('../config/db');

const findCart = async (userId, sessionId) => {
  let query = `SELECT * FROM carts WHERE `;
  const params = [];

  if (userId) {
    query += `user_id = ? LIMIT 1`;
    params.push(userId);
  } else {
    query += `session_id = ? AND user_id IS NULL LIMIT 1`;
    params.push(sessionId);
  }

  const [rows] = await pool.execute(query, params);
  return rows[0];
};

const createCart = async (userId, sessionId) => {
  const [result] = await pool.execute(
    `INSERT INTO carts (user_id, session_id) VALUES (?, ?)`,
    [userId || null, sessionId || null]
  );
  return result.insertId;
};

const getCartItems = async (cartId) => {
  const query = `
    SELECT ci.id as cart_item_id, ci.variant_id, ci.quantity, ci.unit_price,
           p.name, p.slug, p.base_price, pv.sku, pi.image_url
    FROM cart_items ci
    JOIN product_variants pv ON ci.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
    WHERE ci.cart_id = ?
  `;
  const [rows] = await pool.execute(query, [cartId]);
  return rows;
};

const findVariantForCart = async (variantId) => {
  const query = `
    SELECT pv.id, pv.stock_qty, pv.price_override, p.base_price 
    FROM product_variants pv
    JOIN products p ON pv.product_id = p.id
    WHERE pv.id = ? AND pv.is_active = 1
  `;
  const [rows] = await pool.execute(query, [variantId]);
  return rows[0];
};

const upsertCartItem = async (cartId, variantId, quantity, unitPrice) => {
  const query = `
    INSERT INTO cart_items (cart_id, variant_id, quantity, unit_price)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), unit_price = VALUES(unit_price)
  `;
  // Using REPLACE or handled by ON DUPLICATE KEY if unique constraint exists. 
  // Wait, let's check if there's a unique key (cart_id, variant_id). 
  // Assuming we just append or manually check. Let's do a manual check.
  
  const [existing] = await pool.execute(`SELECT id, quantity FROM cart_items WHERE cart_id = ? AND variant_id = ?`, [cartId, variantId]);
  
  if (existing.length > 0) {
    await pool.execute(`UPDATE cart_items SET quantity = quantity + ?, unit_price = ? WHERE id = ?`, [quantity, unitPrice, existing[0].id]);
  } else {
    await pool.execute(`INSERT INTO cart_items (cart_id, variant_id, quantity, unit_price) VALUES (?, ?, ?, ?)`, [cartId, variantId, quantity, unitPrice]);
  }
};

const findActiveCoupon = async (code) => {
  const [rows] = await pool.execute(`
    SELECT * FROM coupon_codes 
    WHERE code = ? AND is_active = 1 
    AND (expires_at IS NULL OR expires_at > NOW())
  `, [code]);
  return rows[0];
};

const applyCouponToCart = async (cartId, couponId) => {
  await pool.execute(`UPDATE carts SET coupon_id = ? WHERE id = ?`, [couponId, cartId]);
};

const removeCouponFromCart = async (cartId) => {
  await pool.execute(`UPDATE carts SET coupon_id = NULL WHERE id = ?`, [cartId]);
};

const calculateCartTotal = async (cartId) => {
  // Call stored procedure from SQL
  const [rows] = await pool.execute(`CALL calculate_cart_total(?, @subtotal, @discount, @total, @ccode, @dtype)`, [cartId]);
  const [outParams] = await pool.execute(`SELECT @subtotal as p_subtotal, @discount as p_discount, @total as p_total, @ccode as p_coupon_code, @dtype as p_discount_type`);
  
  return outParams[0];
};

const clearCartItems = async (cartId) => {
  await pool.execute(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
  await pool.execute(`UPDATE carts SET coupon_id = NULL WHERE id = ?`, [cartId]);
}

module.exports = {
  findCart,
  createCart,
  getCartItems,
  findVariantForCart,
  upsertCartItem,
  findActiveCoupon,
  applyCouponToCart,
  removeCouponFromCart,
  calculateCartTotal,
  clearCartItems
};
