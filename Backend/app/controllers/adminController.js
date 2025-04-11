import StudentModel from "../models/studentModel.js";
import pool from "../config/database.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const AdminController = {
  verifyStudent: async (req, res) => {
    try {
      const { id, status } = req.body;

      if (!["diterima", "ditolak"].includes(status)) {
        return errorResponse(res, "Status tidak valid", null, 400);
      }

      const query = `UPDATE students SET status_pendaftaran = $1 WHERE id = $2 RETURNING *`;
      const result = await pool.query(query, [status, id]);

      if (result.rowCount === 0) {
        return errorResponse(res, "Mahasiswa tidak ditemukan", null, 404);
      }

      successResponse(res, "Status berhasil diperbarui", result.rows[0]);
    } catch (error) {
      errorResponse(res, "Terjadi kesalahan server", error);
    }
  }
};
