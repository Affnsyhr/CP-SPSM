const db = require('../../config/db');

const createLog = async ({ user_id, aktivitas, ip_address }) => {
  const result = await db.query(
    `INSERT INTO aktivitas_log (user_id, aktivitas, timestamp, ip_address)
     VALUES ($1, $2, NOW(), $3) RETURNING *`,
    [user_id, aktivitas, ip_address]
  );
  return result.rows[0];
};

module.exports = { createLog };