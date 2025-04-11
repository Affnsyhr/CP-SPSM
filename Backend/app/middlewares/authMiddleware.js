import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Akses ditolak, token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user dari token
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};

export default authMiddleware;
