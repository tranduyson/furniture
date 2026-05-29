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
  // Lấy danh sách variants
  const [variants] = await pool.execute(
    `SELECT pv.* FROM product_variants pv WHERE pv.product_id = ? AND pv.is_active = 1`,
    [productId]
  );

  // Lấy thuộc tính chi tiết cho từng variant
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

  return variants;
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

// ======================== ATTRIBUTE TYPES ========================
const findAllAttributeTypes = async () => {
  const [rows] = await pool.execute(`SELECT * FROM attribute_types ORDER BY id ASC`);
  return rows;
};

const createAttributeType = async (name) => {
  const [result] = await pool.execute(`INSERT INTO attribute_types (name) VALUES (?)`, [name]);
  return result.insertId;
};

const deleteAttributeType = async (id) => {
  const [result] = await pool.execute(`DELETE FROM attribute_types WHERE id = ?`, [id]);
  return result.affectedRows;
};

// ======================== ATTRIBUTE VALUES ========================
const findAttributeValuesByTypeId = async (typeId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM attribute_values WHERE type_id = ? ORDER BY display_order ASC`,
    [typeId]
  );
  return rows;
};

const findAllAttributeValues = async () => {
  const [rows] = await pool.execute(
    `SELECT av.*, at.name as type_name
     FROM attribute_values av
     JOIN attribute_types at ON av.type_id = at.id
     ORDER BY at.id, av.display_order ASC`
  );
  return rows;
};

const createAttributeValue = async ({ type_id, value, color_hex, display_order }) => {
  const [result] = await pool.execute(
    `INSERT INTO attribute_values (type_id, value, color_hex, display_order) VALUES (?, ?, ?, ?)`,
    [type_id, value, color_hex || null, display_order || 0]
  );
  return result.insertId;
};

const updateAttributeValue = async (id, { value, color_hex, display_order }) => {
  const [result] = await pool.execute(
    `UPDATE attribute_values SET value = ?, color_hex = ?, display_order = ? WHERE id = ?`,
    [value, color_hex || null, display_order || 0, id]
  );
  return result.affectedRows;
};

const deleteAttributeValue = async (id) => {
  const [result] = await pool.execute(`DELETE FROM attribute_values WHERE id = ?`, [id]);
  return result.affectedRows;
};

// ======================== VARIANT ATTRIBUTES ========================
const findVariantAttributes = async (variantId) => {
  const [rows] = await pool.execute(
    `SELECT va.*, av.value, av.color_hex, at.id as type_id, at.name as type_name
     FROM variant_attributes va
     JOIN attribute_values av ON va.attr_value_id = av.id
     JOIN attribute_types at ON av.type_id = at.id
     WHERE va.variant_id = ?`,
    [variantId]
  );
  return rows;
};

const setVariantAttributes = async (variantId, attrValueIds) => {
  // Xóa hết thuộc tính cũ
  await pool.execute(`DELETE FROM variant_attributes WHERE variant_id = ?`, [variantId]);
  // Thêm các thuộc tính mới
  for (const attrValueId of attrValueIds) {
    await pool.execute(
      `INSERT INTO variant_attributes (variant_id, attr_value_id) VALUES (?, ?)`,
      [variantId, attrValueId]
    );
  }
};

// ======================== VARIANT CRUD ========================
const createVariant = async ({ product_id, sku, price_override, stock_qty, is_active, image_url }) => {
  const [result] = await pool.execute(
    `INSERT INTO product_variants (product_id, sku, price_override, stock_qty, is_active, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
    [product_id, sku, price_override || null, stock_qty || 0, is_active ?? 1, image_url || null]
  );
  return result.insertId;
};

const updateVariant = async (id, { sku, price_override, stock_qty, is_active, image_url }) => {
  const [result] = await pool.execute(
    `UPDATE product_variants SET sku = ?, price_override = ?, stock_qty = ?, is_active = ?, image_url = ? WHERE id = ?`,
    [sku, price_override || null, stock_qty || 0, is_active ?? 1, image_url || null, id]
  );
  return result.affectedRows;
};

const deleteVariant = async (id) => {
  await pool.execute(`DELETE FROM variant_attributes WHERE variant_id = ?`, [id]);
  const [result] = await pool.execute(`DELETE FROM product_variants WHERE id = ?`, [id]);
  return result.affectedRows;
};

module.exports = {
  findProducts,
  findBySlug,
  findVariantsByProductId,
  findImagesByProductId,
  findSpecsByProductId,
  findAllCategories,
  findAllCollections,
  // Attribute Types
  findAllAttributeTypes,
  createAttributeType,
  deleteAttributeType,
  // Attribute Values
  findAttributeValuesByTypeId,
  findAllAttributeValues,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
  // Variant Attributes
  findVariantAttributes,
  setVariantAttributes,
  // Variant CRUD
  createVariant,
  updateVariant,
  deleteVariant
};
