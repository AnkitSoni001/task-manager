const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card stat-${color}`} id={`stat-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
