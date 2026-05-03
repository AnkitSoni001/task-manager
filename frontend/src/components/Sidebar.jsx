import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`} id="main-sidebar">
        <nav className="sidebar-nav">
          <div className="sidebar-logo">
            <img src={logo} alt="TaskFlow" className="sidebar-logo-img" />
          </div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            id="nav-dashboard"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            id="nav-projects"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Projects</span>
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            id="nav-tasks"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span>Tasks</span>
          </NavLink>
          <NavLink
            to="/team"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            id="nav-team"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Team</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            id="nav-profile"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <img src={logo} alt="TaskFlow" className="sidebar-footer-logo" />
          <p className="sidebar-version">TaskFlow v1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
