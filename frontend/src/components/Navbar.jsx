import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <span className="navbar-logo">📋</span>
          <span className="navbar-title">TaskFlow</span>
        </Link>
      </div>
      {user && (
        <div className="navbar-right">
          <div className="navbar-user">
            <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={`user-role role-${user.role}`}>{user.role}</span>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout} id="logout-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
