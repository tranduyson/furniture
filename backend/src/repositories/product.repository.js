const pool = require('../config/db');

const findProducts = async (filters, limit, offset) => {
  let query = `
    SELECT p.*, c.name as category_name, col.name as collection_name,
           img.image_url as primary_image
    FROM products p
    LEFT JOIN product_categories c ON p.category_id = c.id
    LEFT JOIN collections col ON p.collection_id = col.id
    LEFT JOIN product_images img ON p.id = img.product_id AND img.is_primary = 1
    WHERE p.is_active = 1
  `;
  const queryParams = [];

  if (filters.category_id) {
    query += ` AND p.category_id = ?`;
    queryParams.push(filters.category_id);
  }

  if (filters.category) {
    query += ` AND c.slug = ?`;
    queryParams.push(filters.category);
  }
  
  if (filters.collection) {
    query += ` AND col.slug = ?`;
    queryParams.push(filters.collection);
  }

  if (filters.search) {
    query += ` AND p.name LIKE ?`;
    queryParams.push(`%${filters.search}%`);
  }

  // Lấy tổng số lượng để tính pagination
  const countQuery = `SELECT COUNT(*) as total FROM (${query}) as sub`;
  const [countRows] = await pool.execute(countQuery, queryParams);
  const total = countRows[0].total;

  query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
  queryParams.push(limit.toString(), offset.toString()); // Convert to string for LIMIT/OFFSET binding if strict mode, or use query wrapper

  // Convert types to integers safely for mysql2
  const finalParams = queryParams.map(param => isNaN(param) ? param : Number(param));

  const [products] = await pool.query(query, finalParams);
  return { products, total };
};

const findBySlug = async (slug) => {
  const query = `
    SELECT p.*, c.name as category_name, col.name as collection_name,
           img.image_url as primary_image
    FROM products p
    LEFT JOIN product_categories c ON p.category_id = c.id
    LEFT JOIN collections col ON p.collection_id = col.id
    LEFT JOIN product_images img ON p.id = img.product_id AND img.is_primary = 1
    WHERE p.slug = ? AND p.is_active = 1
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [slug]);
  return rows[0];
};

const findVariantsByProductId = async (productId) => {
  const query = `
    SELECT pv.*, GROUP_CONCAT(av.value SEPARATOR ', ') as attributes
    FROM product_variants pv
    LEFT JOIN variant_attributes va ON pv.id = va.variant_id
    LEFT JOIN attribute_values av ON va.attr_value_id = av.id
    WHERE pv.product_id = ? AND pv.is_active = 1
    GROUP BY pv.id
  `;
  const [rows] = await pool.execute(query, [productId]);
  return rows;
};

const findImagesByProductId = async (productId) => {
  const [rows] = await pool.execute(`SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC`, [productId]);
  return rows;
};

const findSpecsByProductId = async (productId) => {
  const [rows] = await pool.execute(`SELECT * FROM product_specs WHERE product_id = ? ORDER BY display_order ASC`, [productId]);
  return rows;
};

const findAllCategories = async () => {
  const [rows] = await pool.execute(`SELECT * FROM product_categories WHERE is_active = 1 ORDER BY display_order ASC`);
  return rows;
};

const findAllCollections = async () => {
  const [rows] = await pool.execute(`SELECT * FROM collections WHERE is_active = 1 ORDER BY display_order ASC`);
  return rows;
};

module.exports = {
  findProducts,
  findBySlug,
  findVariantsByProductId,
  findImagesByProductId,
  findSpecsByProductId,
  findAllCategories,
  findAllCollections
};
