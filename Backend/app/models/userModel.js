import pool from "../config/database.js";

const UserModel = {
  createUser: async (name, email, password, role) => {
    const query = `INSERT INTO users (name, email, password, role) 
                   VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [name, email, password, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findUserByEmail: async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  findUserById: async (id) => {
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

export default UserModel;
