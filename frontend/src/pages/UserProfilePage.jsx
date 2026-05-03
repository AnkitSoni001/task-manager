import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

const isOnline = (lastActive) => {
  if (!lastActive) return false;
  return Date.now() - new Date(lastActive).getTime() < 2 * 60 * 1000;
};

const UserProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data } = await API.get(`/users/${id}`);
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page"><div className="loading-state">Loading user...</div></div>;
  }

  if (!profile) {
    return <div className="page"><div className="empty-state"><p>User not found.</p></div></div>;
  }

  const online = isOnline(profile.lastActive);
  const avatarUrl = profile.avatar ? `${API_BASE}${profile.avatar}` : null;

  const priorityClass = (p) => {
    if (p === "high") return "priority-high";
    if (p === "medium") return "priority-medium";
    return "priority-low";
  };

  const statusClass = (s) => {
    if (s === "completed") return "status-completed";
    if (s === "in-progress") return "status-progress";
    return "status-pending";
  };

  return (
    <div className="page" id="user-profile-page">
      <Link to="/team" className="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Team
      </Link>

      <div className="profile-layout">
        {/* Left — User Info */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper static">
              {avatarUrl ? (
                <img src={avatarUrl} alt={profile.name} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className={`status-indicator large ${online ? "online" : "offline"}`}></span>
            </div>
            <h2 className="profile-name">{profile.name}</h2>
            <span className={`profile-role role-${profile.role}`}>{profile.role}</span>
            <p className="profile-status-text">
              {online ? "🟢 Online now" : `Last active ${new Date(profile.lastActive).toLocaleString()}`}
            </p>
          </div>

          {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          <div className="profile-stats-row">
            <div className="profile-stat">
              <span className="profile-stat-value">{profile.projectCount}</span>
              <span className="profile-stat-label">Projects</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{profile.taskCount}</span>
              <span className="profile-stat-label">Tasks</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{profile.completedTaskCount}</span>
              <span className="profile-stat-label">Done</span>
            </div>
          </div>
        </div>

        {/* Right — Projects & Tasks */}
        <div className="profile-details-card">
          <h3>Projects ({profile.projects?.length || 0})</h3>
          <div className="user-projects-list">
            {profile.projects?.length > 0 ? (
              profile.projects.map((p) => (
                <Link to={`/projects/${p._id}`} key={p._id} className="user-project-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{p.name}</span>
                  <span className="user-project-members">{p.members?.length} members</span>
                </Link>
              ))
            ) : (
              <p className="text-muted">No projects</p>
            )}
          </div>

          <h3 style={{ marginTop: "24px" }}>Tasks ({profile.tasks?.length || 0})</h3>
          <div className="user-tasks-list">
            {profile.tasks?.length > 0 ? (
              profile.tasks.map((t) => (
                <div key={t._id} className="user-task-item">
                  <div className="user-task-info">
                    <span className={`task-status-dot ${statusClass(t.status)}`}></span>
                    <span className="user-task-title">{t.title}</span>
                  </div>
                  <div className="user-task-meta">
                    <span className={`badge ${priorityClass(t.priority)}`}>{t.priority}</span>
                    <span className="text-muted">{t.project?.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No tasks assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
