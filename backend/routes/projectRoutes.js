import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../controllers/projectController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/")
  .post(adminOnly, createProject)   // Admin only: create project
  .get(getProjects);                 // All users: list projects

router.route("/:id")
  .get(getProjectById)              // All users: view project
  .put(adminOnly, updateProject)    // Admin only: update project
  .delete(adminOnly, deleteProject); // Admin only: delete project

// Member management (Admin only)
router.post("/:id/members", adminOnly, addMember);
router.delete("/:id/members/:userId", adminOnly, removeMember);

export default router;
