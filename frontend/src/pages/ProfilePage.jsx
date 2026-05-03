import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMessage, setPwMessage] = useState({ text: "", type: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [showPwSection, setShowPwSection] = useState(false);
  const fileRef = useRef();

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/users/profile");
      setProfile(data);
      setForm({ name: data.name, bio: data.bio || "" });
    } catch (err) { console.error("Failed to fetch profile", err); }
  };

  const handleSave = async () => {
    setSaving(true); setMessage("");
    try {
      const { data } = await API.put("/users/profile", form);
      setProfile((prev) => ({ ...prev, ...data }));
      const stored = JSON.parse(localStorage.getItem("user"));
      login({ ...stored, name: data.name });
      setEditing(false); setMessage("Profile updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { setMessage("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setMessage("File too large. Max 2MB."); return; }
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true); setMessage("");
    try {
      const { data } = await API.put("/users/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setProfile((prev) => ({ ...prev, avatar: data.avatar }));
      const stored = JSON.parse(localStorage.getItem("user"));
      login({ ...stored, avatar: data.avatar });
      setMessage("Avatar uploaded!"); setTimeout(() => setMessage(""), 3000);
    } catch (err) { setMessage("Failed to upload avatar"); }
    finally { setUploading(false); }
  };

  const handlePasswordChange = async () => {
    setPwMessage({ text: "", type: "" });
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMessage({ text: "Passwords do not match", type: "error" }); return; }
    if (pwForm.newPassword.length < 6) { setPwMessage({ text: "Password must be at least 6 characters", type: "error" }); return; }
    setPwSaving(true);
    try {
      const { data } = await API.put("/users/password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMessage({ text: data.message, type: "success" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => { setPwMessage({ text: "", type: "" }); setShowPwSection(false); }, 3000);
    } catch (err) { setPwMessage({ text: err.response?.data?.message || "Failed to change password", type: "error" }); }
    finally { setPwSaving(false); }
  };

  if (!profile) return <div className="page"><div className="loading-state">Loading profile...</div></div>;

  const avatarUrl = profile.avatar ? `${API_BASE}${profile.avatar}` : null;

  return (
    <div className="page" id="profile-page">
      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper" onClick={() => fileRef.current?.click()}>
              {avatarUrl ? (<img src={avatarUrl} alt={profile.name} className="profile-avatar-img" />) : (<div className="profile-avatar-placeholder">{profile.name?.charAt(0).toUpperCase()}</div>)}
              <div className="profile-avatar-overlay">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                <span>{uploading ? "Uploading..." : "Change"}</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
            </div>
            <h2 className="profile-name">{profile.name}</h2>
            <span className={`profile-role role-${profile.role}`}>{profile.role}</span>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-joined">Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
          </div>
          {message && <div className="profile-message">{message}</div>}
          <div className="profile-stats-row">
            <div className="profile-stat"><span className="profile-stat-value">{profile.projectCount}</span><span className="profile-stat-label">Projects</span></div>
            <div className="profile-stat"><span className="profile-stat-value">{profile.taskCount}</span><span className="profile-stat-label">Tasks</span></div>
            <div className="profile-stat"><span className="profile-stat-value">{profile.completedTaskCount}</span><span className="profile-stat-label">Done</span></div>
          </div>
        </div>

        <div className="profile-details-card">
          <div className="profile-section-header">
            <h3>About</h3>
            {!editing && (<button className="btn btn-ghost" onClick={() => setEditing(true)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>Edit</button>)}
          </div>
          {editing ? (
            <div className="profile-edit-form">
              <div className="form-group"><label>Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" /></div>
              <div className="form-group"><label>Bio</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="form-textarea" placeholder="Tell us about yourself..." rows={4} maxLength={300} /><span className="char-count">{form.bio.length}/300</span></div>
              <div className="profile-edit-actions"><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button><button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button></div>
            </div>
          ) : (<p className="profile-bio">{profile.bio || "No bio yet. Click Edit to add one!"}</p>)}

          <div className="profile-info-grid">
            <div className="profile-info-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg><span>{profile.email}</span></div>
            <div className="profile-info-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg><span className={`role-${profile.role}`}>{profile.role}</span></div>
            <div className="profile-info-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg><span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span></div>
          </div>

          {/* Password Section */}
          <div className="profile-password-section">
            <div className="profile-section-header">
              <h3>Security</h3>
              <button className="btn btn-ghost" onClick={() => setShowPwSection(!showPwSection)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                {showPwSection ? "Cancel" : "Change Password"}
              </button>
            </div>
            {showPwSection && (
              <div className="profile-edit-form">
                {pwMessage.text && <div className={`profile-pw-msg ${pwMessage.type}`}>{pwMessage.text}</div>}
                <div className="form-group"><label>Current Password</label><input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="form-input" placeholder="Enter current password" /></div>
                <div className="form-group"><label>New Password</label><input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="form-input" placeholder="Min 6 characters" /></div>
                <div className="form-group"><label>Confirm New Password</label><input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} className="form-input" placeholder="Confirm new password" /></div>
                <div className="profile-edit-actions"><button className="btn btn-primary" onClick={handlePasswordChange} disabled={pwSaving}>{pwSaving ? "Updating..." : "Update Password"}</button></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
