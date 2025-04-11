const pool = require("../config/database");

const SelectionModel = {
  createSelection: async (student_id, nilai_akademik, status) => {
    const query = `INSERT INTO selections (student_id, nilai_akademik, status) 
                   VALUES ($1, $2, $3) RETURNING *`;
    const values = [student_id, nilai_akademik, status];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getSelectionByStudentId: async (student_id) => {
    const query = `SELECT * FROM selections WHERE student_id = $1`;
    const result = await pool.query(query, [student_id]);
    return result.rows[0];
  }
};

module.exports = SelectionModel;
