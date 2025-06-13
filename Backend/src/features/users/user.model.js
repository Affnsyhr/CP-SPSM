// user.model.js
import db from '../../config/db.js';

export const getUserById = async (userId) => {
  const result = await db.query(`
    SELECT u.user_id, u.username, u.email, u.created_at, u.last_login, r.nama_role
    FROM users u
    JOIN role r ON u.role_id = r.role_id
    WHERE u.user_id = $1
  `, [userId]);
  return result.rows[0];
};

export const getAllAdmins = async () => {
  const result = await db.query(`
    SELECT u.user_id, u.username, u.email, u.created_at, r.nama_role
    FROM users u
    JOIN role r ON u.role_id = r.role_id
    WHERE r.nama_role = 'admin_tu'
  `);
  return result.rows;
};

export const createAdminUser = async ({ username, email, passwordHash, role_id }) => {
  const result = await db.query(`
    INSERT INTO users (username, email, password_hash, created_at, role_id)
    VALUES ($1, $2, $3, NOW(), $4)
    RETURNING user_id, username, email, role_id
  `, [username, email, passwordHash, role_id]);
  return result.rows[0];
};

export const updateAdminUser = async (userId, updates) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${i}`);
    values.push(value);
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

export const deleteUserById = async (userId) => {
  const result = await db.query(`
    DELETE FROM users WHERE user_id = $1 RETURNING *
  `, [userId]);
  return result.rows[0];
};
