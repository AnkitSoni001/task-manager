import Task from "../models/Task.js";
import Project from "../models/Project.js";

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Title and project are required" });
    }

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Members can only create tasks in projects they belong to
    if (
      req.user.role !== "admin" &&
      !projectExists.members.some((m) => m.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }

    // Only admins can assign tasks to others
    if (assignedTo && req.user.role !== "admin" && assignedTo !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admins can assign tasks to others" });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      priority: priority || "medium",
      dueDate,
      project,
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id,
    });

    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");
    await task.populate("project", "name");

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get tasks (with optional filters)
// @route   GET /api/tasks?project=X&status=X&assignedTo=X
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { project, status, assignedTo } = req.query;
    let query = {};

    // Filter by project
    if (project) query.project = project;

    // Filter by status
    if (status) query.status = status;

    // Filter by assigned user
    if (assignedTo) query.assignedTo = assignedTo;

    // Members only see tasks from their projects or assigned to them
    if (req.user.role !== "admin") {
      const userProjects = await Project.find({ members: req.user._id }).select("_id");
      const projectIds = userProjects.map((p) => p._id);

      query.$or = [
        { project: { $in: projectIds } },
        { assignedTo: req.user._id },
      ];
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (Admin: all fields, Member: status of own tasks only)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Members can only update status of tasks assigned to them
    if (req.user.role !== "admin") {
      if (task.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only update tasks assigned to you" });
      }
      // Members can only change the status
      if (req.body.status) {
        task.status = req.body.status;
      } else {
        return res.status(403).json({ message: "Members can only update task status" });
      }
    } else {
      // Admin can update any field
      const { title, description, status, priority, dueDate, assignedTo } = req.body;
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
    }

    await task.save();

    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");
    await task.populate("project", "name");

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/tasks/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    let matchQuery = {};

    // Members only see stats for their tasks
    if (req.user.role !== "admin") {
      const userProjects = await Project.find({ members: req.user._id }).select("_id");
      const projectIds = userProjects.map((p) => p._id);
      matchQuery = {
        $or: [
          { project: { $in: projectIds } },
          { assignedTo: req.user._id },
        ],
      };
    }

    const allTasks = await Task.find(matchQuery);

    const now = new Date();
    const stats = {
      total: allTasks.length,
      pending: allTasks.filter((t) => t.status === "pending").length,
      inProgress: allTasks.filter((t) => t.status === "in-progress").length,
      completed: allTasks.filter((t) => t.status === "completed").length,
      overdue: allTasks.filter(
        (t) => t.dueDate && t.dueDate < now && t.status !== "completed"
      ).length,
    };

    // Recent tasks (last 5)
    const recentTasks = await Task.find(matchQuery)
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ stats, recentTasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
