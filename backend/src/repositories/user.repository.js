const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const findByEmailOrPhone = async (email, phone) => {
  const query = `SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1`;
  const [rows] = await pool.execute(query, [email || null, phone || null]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0];
};

const createUser = async (userData) => {
  const { full_name, email, phone, password_hash } = userData;
  const query = `
    INSERT INTO users (full_name, email, phone, password_hash)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [full_name, email || null, phone || null, password_hash]);
  return result.insertId;
};

const storeRefreshToken = async (userId, refreshToken, deviceInfo) => {
  const id = uuidv4();
  // Expires 7 days from now
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  const query = `
    INSERT INTO user_sessions (id, user_id, refresh_token, device_info, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.execute(query, [id, userId, refreshToken, deviceInfo, expiresAt]);
};

const findSession = async (userId, refreshToken) => {
  const query = `
    SELECT * FROM user_sessions 
    WHERE user_id = ? AND refresh_token = ? AND expires_at > NOW() 
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [userId, refreshToken]);
  return rows[0];
};

module.exports = {
  findByEmailOrPhone,
  findById,
  createUser,
  storeRefreshToken,
  findSession
};
