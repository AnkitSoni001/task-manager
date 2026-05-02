import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ status: "", project: "" });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.project) params.append("project", filter.project);

      const [tasksRes, projRes, usersRes] = await Promise.all([
        API.get(`/tasks?${params.toString()}`),
        API.get("/projects"),
        API.get("/auth/users"),
      ]);
      setTasks(tasksRes.data);
      setProjects(projRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await API.post("/tasks", formData);
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-screen">Loading tasks...</div>;

  return (
    <div className="page tasks-page" id="tasks-page">
      <div className="page-header">
        <h1>All Tasks</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)} id="create-task-btn">
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="filters glass-card">
        <div className="form-group">
          <label>Status</label>
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Project</label>
          <select value={filter.project} onChange={(e) => setFilter({ ...filter, project: e.target.value })}>
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state glass-card">
          <span className="empty-icon">✅</span>
          <h3>No tasks found</h3>
          <p>{filter.status || filter.project ? "Try changing your filters." : "Create your first task!"}</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          users={users}
          projects={projects}
        />
      )}
    </div>
  );
};

export default TasksPage;
