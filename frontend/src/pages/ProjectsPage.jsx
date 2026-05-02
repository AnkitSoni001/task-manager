import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error("Projects fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/projects", form);
      setForm({ name: "", description: "" });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div className="loading-screen">Loading projects...</div>;

  return (
    <div className="page projects-page" id="projects-page">
      <div className="page-header">
        <h1>Projects</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} id="create-project-btn">
            {showForm ? "Cancel" : "+ New Project"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="inline-form glass-card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <input type="text" placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group" style={{ flex: 3 }}>
                <input type="text" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="empty-state glass-card">
          <span className="empty-icon">📁</span>
          <h3>No projects yet</h3>
          <p>{isAdmin ? "Create your first project to get started!" : "Ask an admin to add you to a project."}</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <Link to={`/projects/${project._id}`} key={project._id} className="project-card glass-card" id={`project-${project._id}`}>
              <div className="project-card-header">
                <h3>{project.name}</h3>
                {isAdmin && (
                  <button className="btn btn-danger btn-sm" onClick={(e) => { e.preventDefault(); handleDelete(project._id); }}>
                    Delete
                  </button>
                )}
              </div>
              {project.description && <p className="project-desc">{project.description}</p>}
              <div className="project-meta">
                <span>👥 {project.members?.length || 0} members</span>
                <span>Created by {project.createdBy?.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
