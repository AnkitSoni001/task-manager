import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

// @desc    Get my full profile
// @route   GET /api/users/profile
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const projects = await Project.find({ members: req.user._id });
    const tasks = await Task.find({ assignedTo: req.user._id });
    const completedTasks = tasks.filter((t) => t.status === "completed").length;

    res.json({
      ...user.toObject(),
      projectCount: projects.length,
      taskCount: tasks.length,
      completedTaskCount: completedTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update my profile (name, bio)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Upload avatar
// @route   PUT /api/users/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    ).select("-password");

    res.json({ avatar: user.avatar, message: "Avatar uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Heartbeat — update lastActive
// @route   POST /api/users/heartbeat
// @access  Private
export const heartbeat = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { lastActive: Date.now() });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide current and new password" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get team members (users from shared projects)
// @route   GET /api/users/team
// @access  Private
export const getTeamMembers = async (req, res) => {
  try {
    // Find all projects the user is a member of
    const myProjects = await Project.find({ members: req.user._id }).populate(
      "members",
      "-password"
    );

    // Collect unique member IDs (excluding self)
    const memberMap = new Map();
    for (const project of myProjects) {
      for (const member of project.members) {
        if (member._id.toString() !== req.user._id.toString()) {
          memberMap.set(member._id.toString(), member);
        }
      }
    }

    const teammates = Array.from(memberMap.values());

    // Add project/task counts for each teammate
    const enriched = await Promise.all(
      teammates.map(async (member) => {
        const projectCount = await Project.countDocuments({ members: member._id });
        const taskCount = await Task.countDocuments({ assignedTo: member._id });
        return {
          ...member.toObject(),
          projectCount,
          taskCount,
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get ALL users (admin only)
// @route   GET /api/users/all
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const enriched = await Promise.all(
      users.map(async (user) => {
        const projectCount = await Project.countDocuments({ members: user._id });
        const taskCount = await Task.countDocuments({ assignedTo: user._id });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "completed",
        });
        return {
          ...user.toObject(),
          projectCount,
          taskCount,
          completedTasks,
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a user's public profile
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await Project.find({ members: user._id }).select("name description members");
    const tasks = await Task.find({ assignedTo: user._id }).select(
      "title status priority dueDate project"
    ).populate("project", "name");

    res.json({
      ...user.toObject(),
      projects,
      tasks,
      projectCount: projects.length,
      taskCount: tasks.length,
      completedTaskCount: tasks.filter((t) => t.status === "completed").length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
