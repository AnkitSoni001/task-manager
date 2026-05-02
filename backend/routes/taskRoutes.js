import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats,
} from "../controllers/taskController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Dashboard stats (must be before /:id to avoid conflict)
router.get("/dashboard", getDashboardStats);

router.route("/")
  .post(createTask)   // Create task
  .get(getTasks);      // List tasks (with query filters)

router.route("/:id")
  .get(getTaskById)           // View single task
  .put(updateTask)            // Update task (role-based logic in controller)
  .delete(adminOnly, deleteTask); // Admin only: delete task

export default router;
