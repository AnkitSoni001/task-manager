import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar" id="main-sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} id="nav-dashboard">
          <span className="sidebar-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} id="nav-projects">
          <span className="sidebar-icon">📁</span>
          <span>Projects</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} id="nav-tasks">
          <span className="sidebar-icon">✅</span>
          <span>Tasks</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <p className="sidebar-version">v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
