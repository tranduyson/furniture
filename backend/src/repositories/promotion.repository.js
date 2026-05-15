const pool = require('../config/db');

/**
 * Lấy danh sách sản phẩm đang giảm giá (discount_pct > 0)
 */
const findDiscountedProducts = async (limit = 20, offset = 0) => {
  const query = `
    SELECT p.*, c.name as category_name, col.name as collection_name,
           img.image_url as primary_image
    FROM products p
    LEFT JOIN product_categories c ON p.category_id = c.id
    LEFT JOIN collections col ON p.collection_id = col.id
    LEFT JOIN product_images img ON p.id = img.product_id AND img.is_primary = 1
    WHERE p.is_active = 1 AND p.discount_pct > 0
    ORDER BY p.discount_pct DESC, p.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM products p
    WHERE p.is_active = 1 AND p.discount_pct > 0
  `;

  const [countRows] = await pool.execute(countQuery);
  const total = countRows[0].total;

  const [products] = await pool.query(query, [Number(limit), Number(offset)]);
  return { products, total };
};

/**
 * Lấy danh sách chương trình khuyến mãi đang hoạt động
 */
const findActivePromotions = async () => {
  const query = `
    SELECT p.*, 
           (SELECT COUNT(*) FROM promotion_products pp WHERE pp.promotion_id = p.id) as product_count
    FROM promotions p
    WHERE p.is_active = 1 
      AND p.starts_at <= NOW()
      AND (p.ends_at IS NULL OR p.ends_at > NOW())
    ORDER BY p.created_at DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

/**
 * Lấy sản phẩm thuộc chương trình khuyến mãi
 */
const findPromotionProducts = async (promotionId) => {
  const query = `
    SELECT p.*, c.name as category_name, col.name as collection_name,
           img.image_url as primary_image, pp.extra_discount_pct
    FROM promotion_products pp
    JOIN products p ON pp.product_id = p.id
    LEFT JOIN product_categories c ON p.category_id = c.id
    LEFT JOIN collections col ON p.collection_id = col.id
    LEFT JOIN product_images img ON p.id = img.product_id AND img.is_primary = 1
    WHERE pp.promotion_id = ? AND p.is_active = 1
    ORDER BY pp.extra_discount_pct DESC
  `;
  const [rows] = await pool.execute(query, [promotionId]);
  return rows;
};

/**
 * Lấy danh sách coupon codes đang hoạt động
 */
const findActiveCoupons = async () => {
  const query = `
    SELECT *
    FROM coupon_codes
    WHERE is_active = 1
      AND starts_at <= NOW()
      AND (expires_at IS NULL OR expires_at > NOW())
      AND (max_uses IS NULL OR used_count < max_uses)
    ORDER BY created_at DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

module.exports = {
  findDiscountedProducts,
  findActivePromotions,
  findPromotionProducts,
  findActiveCoupons
};
