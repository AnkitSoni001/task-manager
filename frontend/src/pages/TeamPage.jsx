import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

const isOnline = (lastActive) => {
  if (!lastActive) return false;
  return Date.now() - new Date(lastActive).getTime() < 2 * 60 * 1000; // 2 minutes
};

const TeamPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchMembers();
    // Refresh every 30s to update online status
    const interval = setInterval(fetchMembers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMembers = async () => {
    try {
      const endpoint = isAdmin ? "/users/all" : "/users/team";
      const { data } = await API.get(endpoint);
      setMembers(data);
    } catch (err) {
      console.error("Failed to fetch team", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter((m) => {
    if (filter === "online") return isOnline(m.lastActive);
    if (filter === "admin") return m.role === "admin";
    if (filter === "member") return m.role === "member";
    return true;
  });

  const onlineCount = members.filter((m) => isOnline(m.lastActive)).length;

  return (
    <div className="page" id="team-page">
      <div className="page-header">
        <div>
          <h1>{isAdmin ? "All Users" : "Team Members"}</h1>
          <p className="page-subtitle">
            {members.length} {members.length === 1 ? "person" : "people"} • {onlineCount} online
          </p>
        </div>
      </div>

      <div className="team-filters">
        {["all", "online", ...(isAdmin ? ["admin", "member"] : [])].map((f) => (
          <button
            key={f}
            className={`team-filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "online" && <span className="status-dot online"></span>}
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "all" && ` (${members.length})`}
            {f === "online" && ` (${onlineCount})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">Loading team...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No {filter === "all" ? "team members" : filter + " users"} found.</p>
        </div>
      ) : (
        <div className="team-grid">
          {filtered.map((member) => {
            const online = isOnline(member.lastActive);
            const avatarUrl = member.avatar ? `${API_BASE}${member.avatar}` : null;
            return (
              <Link to={`/user/${member._id}`} key={member._id} className="team-card">
                <div className="team-card-avatar">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={member.name} className="team-avatar-img" />
                  ) : (
                    <div className="team-avatar-placeholder">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={`status-indicator ${online ? "online" : "offline"}`}></span>
                </div>
                <div className="team-card-info">
                  <h3 className="team-card-name">{member.name}</h3>
                  <span className={`team-card-role role-${member.role}`}>{member.role}</span>
                </div>
                <div className="team-card-stats">
                  <div className="team-stat">
                    <span className="team-stat-value">{member.projectCount}</span>
                    <span className="team-stat-label">Projects</span>
                  </div>
                  <div className="team-stat">
                    <span className="team-stat-value">{member.taskCount}</span>
                    <span className="team-stat-label">Tasks</span>
                  </div>
                </div>
                <div className="team-card-status">
                  {online ? (
                    <span className="status-text online">Online</span>
                  ) : (
                    <span className="status-text offline">
                      {member.lastActive
                        ? `Last seen ${new Date(member.lastActive).toLocaleDateString()}`
                        : "Offline"}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamPage;
