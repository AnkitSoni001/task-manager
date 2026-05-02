import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      const [projRes, tasksRes, usersRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks?project=${id}`),
        API.get("/auth/users"),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      await API.post("/tasks", { ...formData, project: id });
      setShowTaskForm(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      await API.put(`/tasks/${editingTask._id}`, formData);
      setEditingTask(null);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    const memberUser = users.find((u) => u.email === addMemberEmail);
    if (!memberUser) {
      setError("User not found with that email");
      return;
    }
    try {
      await API.post(`/projects/${id}/members`, { userId: memberUser._id });
      setAddMemberEmail("");
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await API.delete(`/projects/${id}/members/${userId}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-screen">Loading project...</div>;
  if (!project) return <div className="loading-screen">Project not found</div>;

  return (
    <div className="page project-detail-page" id="project-detail-page">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/projects")}>← Back</button>
          <h1>{project.name}</h1>
          {project.description && <p className="page-desc">{project.description}</p>}
        </div>
        <button className="btn btn-primary" onClick={() => setShowTaskForm(true)} id="add-task-btn">
          + Add Task
        </button>
      </div>

      {/* Members Section */}
      <div className="section glass-card">
        <h2>Team Members ({project.members?.length})</h2>
        <div className="members-list">
          {project.members?.map((member) => (
            <div key={member._id} className="member-chip">
              <span className="member-avatar">{member.name?.charAt(0).toUpperCase()}</span>
              <div>
                <span className="member-name">{member.name}</span>
                <span className={`member-role role-${member.role}`}>{member.role}</span>
              </div>
              {isAdmin && member._id !== project.createdBy?._id && (
                <button className="btn-icon" onClick={() => handleRemoveMember(member._id)} title="Remove member">×</button>
              )}
            </div>
          ))}
        </div>
        {isAdmin && (
          <form onSubmit={handleAddMember} className="add-member-form">
            {error && <div className="alert alert-error">{error}</div>}
            <input type="email" placeholder="Enter member's email" value={addMemberEmail} onChange={(e) => setAddMemberEmail(e.target.value)} required />
            <button type="submit" className="btn btn-primary btn-sm">Add Member</button>
          </form>
        )}
      </div>

      {/* Tasks Section */}
      <div className="section">
        <h2>Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <div className="empty-state glass-card">
            <span className="empty-icon">✅</span>
            <h3>No tasks yet</h3>
            <p>Add a task to get started!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {(showTaskForm || editingTask) && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={() => { setShowTaskForm(false); setEditingTask(null); }}
          users={users}
          projects={[project]}
          initialData={editingTask ? { ...editingTask, project: id } : { project: id }}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;
