import express from "express";
import { StudentController } from "../controllers/studentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import ROLES from "../config/roles.js";

const router = express.Router();

router.post(
  "/register",
  authMiddleware,
  roleMiddleware([ROLES.ORANG_TUA]),
  StudentController.registerStudent
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN]),
  StudentController.getAllStudents
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.GURU]),
  StudentController.getStudentById
);

export default router;
