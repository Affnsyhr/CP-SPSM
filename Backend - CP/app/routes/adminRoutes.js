import express from "express";
import { AdminController } from "../controllers/adminController.js"; // Change to named import
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import ROLES from "../config/roles.js";

const adminRoutes = express.Router();

adminRoutes.post(
  "/verify-student",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]),
  AdminController.verifyStudent
);

adminRoutes.get("/", (req, res) => {
  res.send("Admin route");
});

export default adminRoutes;
