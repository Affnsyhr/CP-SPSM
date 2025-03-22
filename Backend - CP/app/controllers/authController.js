import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/userModel.js";

dotenv.config();

const AuthController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // Cek apakah email sudah digunakan
      const existingUser = await UserModel.findUserByEmail(email);
      if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.createUser(name, email, hashedPassword, role);

      res.status(201).json({ message: "Registrasi berhasil", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan server", error });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findUserByEmail(email);

      if (!user) return res.status(401).json({ message: "Email atau password salah" });

      // Verifikasi password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ message: "Email atau password salah" });

      // Buat token JWT
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.json({ message: "Login berhasil", token });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan server", error });
    }
  }
};

export default AuthController;
