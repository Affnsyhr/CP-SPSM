import pool from "../config/database.js";

const StudentModel = {
  registerStudent: async (user_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, alamat, agama, asal_sekolah, prestasi) => {
    const query = `INSERT INTO students 
                   (user_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, alamat, agama, asal_sekolah, prestasi, status_pendaftaran) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'menunggu') RETURNING *`;
    const values = [user_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, alamat, agama, asal_sekolah, prestasi];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getAllStudents: async () => {
    const query = `SELECT * FROM students`;
    const result = await pool.query(query);
    return result.rows;
  },

  getStudentById: async (id) => {
    const query = `SELECT * FROM students WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

export default StudentModel;
