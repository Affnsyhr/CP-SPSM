import express from "express";
import TeacherController from "../controllers/teacherController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import ROLES from "../config/roles.js";

const router = express.Router();

router.get(
  "/students",
  authMiddleware,
  roleMiddleware([ROLES.GURU]),
  TeacherController.getAllRegisteredStudents
);

export default router;
