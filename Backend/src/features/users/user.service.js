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
        r.nama_role
      FROM users u
      JOIN role r ON u.role_id = r.role_id
      WHERE r.nama_role = 'admin_tu'
      ORDER BY u.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error in getAdmins:', error);
    throw error;
  }
};

const createAdmin = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new BadRequestError('Username, email, dan password wajib diisi');
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
  `, [username, email, hashedPassword, ROLES.ADMIN_TU]);
  
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

module.exports = {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
};
