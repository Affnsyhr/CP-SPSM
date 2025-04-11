const pool = require("../config/database");

const PaymentModel = {
  createPayment: async (student_id, jumlah, bukti_pembayaran) => {
    const query = `INSERT INTO payments (student_id, jumlah, bukti_pembayaran, status) 
                   VALUES ($1, $2, $3, 'pending') RETURNING *`;
    const values = [student_id, jumlah, bukti_pembayaran];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getPaymentsByStudentId: async (student_id) => {
    const query = `SELECT * FROM payments WHERE student_id = $1`;
    const result = await pool.query(query, [student_id]);
    return result.rows;
  },

  updatePaymentStatus: async (payment_id, status) => {
    const query = `UPDATE payments SET status = $1 WHERE id = $2 RETURNING *`;
    const result = await pool.query(query, [status, payment_id]);
    return result.rows[0];
  }
};

module.exports = PaymentModel;
