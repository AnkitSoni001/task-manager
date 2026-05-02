import { useState, useEffect } from "react";
import API from "../api/axios";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await API.get("/tasks/dashboard");
      setStats(data.stats);
      setRecentTasks(data.recentTasks);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) return <div className="loading-screen">Loading dashboard...</div>;

  return (
    <div className="page dashboard-page" id="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, <strong>{user?.name}</strong>!</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Tasks" value={stats.total} icon="📋" color="blue" />
        <StatCard title="Pending" value={stats.pending} icon="⏳" color="amber" />
        <StatCard title="In Progress" value={stats.inProgress} icon="🔄" color="indigo" />
        <StatCard title="Completed" value={stats.completed} icon="✅" color="green" />
        <StatCard title="Overdue" value={stats.overdue} icon="🔴" color="red" />
      </div>

      <div className="recent-section">
        <h2>Recent Tasks</h2>
        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Create a project and start adding tasks!</p>
          </div>
        ) : (
          <div className="recent-list">
            {recentTasks.map((task) => (
              <div key={task._id} className={`recent-item ${task.isOverdue ? "item-overdue" : ""}`}>
                <div className="recent-item-left">
                  <span className={`status-dot status-${task.status}`}></span>
                  <div>
                    <p className="recent-item-title">{task.title}</p>
                    <p className="recent-item-meta">
                      {task.project?.name} • {task.assignedTo?.name || "Unassigned"}
                    </p>
                  </div>
                </div>
                <div className="recent-item-right">
                  <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                  {task.dueDate && (
                    <span className={`due-badge ${task.isOverdue ? "overdue" : ""}`}>
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
