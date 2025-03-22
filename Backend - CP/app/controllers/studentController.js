import StudentModel from "../models/studentModel.js";

export const StudentController = {
  registerStudent: async (req, res) => {
    try {
      const { nama_lengkap, nik, tempat_lahir, tanggal_lahir, alamat, agama, asal_sekolah, prestasi } = req.body;
      const user_id = req.user.id; // Dapatkan ID pengguna dari token JWT

      const student = await StudentModel.registerStudent(user_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, alamat, agama, asal_sekolah, prestasi);

      res.status(201).json({ message: "Pendaftaran berhasil", student });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan server", error });
    }
  },

  getAllStudents: async (req, res) => {
    try {
      const students = await StudentModel.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan server", error });
    }
  },

  getStudentById: async (req, res) => {
    try {
      const student = await StudentModel.getStudentById(req.params.id);
      if (!student) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });

      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan server", error });
    }
  }
};
