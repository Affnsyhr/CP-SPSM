// user.service.js
const bcrypt = require('bcrypt');
const db = require('../../config/db');
const { BadRequestError, ConflictError } = require('../../utils/errors');
const { ROLES } = require('../../constants/roles');

const getAdmins = async () => {
  try {
    const result = await db.query(`
      SELECT 
        u.user_id, 
        u.username, 
        u.email, 
        u.created_at, 
        u.role_id,
        r.nama_role
      FROM users u
      JOIN role r ON u.role_id = r.role_id
      WHERE r.nama_role IN ('admin_tu', 'kepala_sekolah')
      ORDER BY u.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error in getAdmins:', error);
    throw error;
  }
};

const createAdmin = async ({ username, email, password, role_id }) => {
  if (!username || !email || !password || !role_id) {
    throw new BadRequestError('Username, email, password, dan role wajib diisi');
  }

  const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new ConflictError('Email sudah digunakan');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(`
    INSERT INTO users (username, email, password_hash, created_at, role_id)
    VALUES ($1, $2, $3, NOW(), $4)
    RETURNING user_id, username, email, role_id
  `, [username, email, hashedPassword, role_id]);
  
  return result.rows[0];
};

const updateAdmin = async (userId, updates) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (key !== 'password') {
      fields.push(`${key} = $${i}`);
      values.push(value);
      i++;
    }
  }

  if (updates.password) {
    const hashedPassword = await bcrypt.hash(updates.password, 10);
    fields.push(`password_hash = $${i}`);
    values.push(hashedPassword);
    i++;
  }

  values.push(userId);
  const query = `
    UPDATE users SET ${fields.join(', ')} WHERE user_id = $${i}
    RETURNING user_id, username, email, role_id
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteAdmin = async (userId) => {
  const result = await db.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [userId]);
  return result.rows[0];
};

// Get all parent (orang tua) users
const getParents = async () => {
  try {
    const result = await db.query(`
      SELECT 
        u.user_id, 
        u.username, 
        u.email, 
        u.created_at, 
        u.role_id,
        u.is_active,
        r.nama_role,
        ot.no_hp AS phone,
        (
          SELECT string_agg(s.nama_lengkap, ', ')
          FROM siswa s
          WHERE s.orang_tua_id = u.user_id
        ) AS nama_siswa
      FROM users u
      JOIN role r ON u.role_id = r.role_id
      LEFT JOIN orang_tua ot ON ot.user_id = u.user_id
      WHERE r.nama_role = 'orang_tua'
      ORDER BY u.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error in getParents:', error);
    throw error;
  }
};

// Create parent (orang tua) user
const createParent = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new BadRequestError('Username, email, dan password wajib diisi');
  }

  const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new ConflictError('Email sudah digunakan');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // Cari role_id untuk orang_tua
  const roleRes = await db.query(`SELECT role_id FROM role WHERE nama_role = 'orang_tua' LIMIT 1`);
  const role_id = roleRes.rows[0]?.role_id;
  if (!role_id) throw new BadRequestError('Role orang_tua tidak ditemukan');

  const result = await db.query(`
    INSERT INTO users (username, email, password_hash, created_at, role_id)
    VALUES ($1, $2, $3, NOW(), $4)
    RETURNING user_id, username, email, role_id
  `, [username, email, hashedPassword, role_id]);
  return result.rows[0];
};

// Update parent (orang tua) user
const updateParent = async (userId, updates) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (key !== 'password') {
      fields.push(`${key} = $${i}`);
      values.push(value);
      i++;
    }
  }

  if (updates.password) {
    const hashedPassword = await bcrypt.hash(updates.password, 10);
    fields.push(`password_hash = $${i}`);
    values.push(hashedPassword);
    i++;
  }

  values.push(userId);
  const query = `
    UPDATE users SET ${fields.join(', ')} WHERE user_id = $${i} AND role_id = (SELECT role_id FROM role WHERE nama_role = 'orang_tua' LIMIT 1)
    RETURNING user_id, username, email, role_id
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};

// Delete parent (orang tua) user
const deleteParent = async (userId) => {
  const result = await db.query("DELETE FROM users WHERE user_id = $1 AND role_id = (SELECT role_id FROM role WHERE nama_role = 'orang_tua' LIMIT 1) RETURNING *", [userId]);
  return result.rows[0];
};

// Set aktif/nonaktif parent (orang tua) user
const setParentActiveStatus = async (userId, isActive) => {
  const result = await db.query(
    `UPDATE users SET is_active = $1 WHERE user_id = $2 AND role_id = (SELECT role_id FROM role WHERE nama_role = 'orang_tua' LIMIT 1) RETURNING user_id, is_active`,
    [isActive, userId]
  );
  return result.rows[0];
};

module.exports = {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getParents,
  createParent,
  updateParent,
  deleteParent,
  setParentActiveStatus
};
