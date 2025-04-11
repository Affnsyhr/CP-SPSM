import StudentModel from "../models/studentModel.js";

const TeacherController = {
  getAllRegisteredStudents: async (req, res) => {
    try {
      const students = await StudentModel.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan server", error });
    }
  }
};

export default TeacherController;
