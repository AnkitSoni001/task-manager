const TaskCard = ({ task, onStatusChange, onDelete, isAdmin }) => {
  const statusColors = {
    pending: "status-pending",
    "in-progress": "status-progress",
    completed: "status-completed",
  };

  const priorityLabels = {
    low: "🟢 Low",
    medium: "🟡 Medium",
    high: "🔴 High",
  };

  const formatDate = (date) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <div className={`task-card ${task.isOverdue ? "task-overdue" : ""}`} id={`task-${task._id}`}>
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <span className={`task-status ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-meta">
        <span className="task-priority">{priorityLabels[task.priority]}</span>
        <span className={`task-due ${task.isOverdue ? "overdue" : ""}`}>
          📅 {formatDate(task.dueDate)}
        </span>
      </div>

      <div className="task-footer">
        <div className="task-assignee">
          {task.assignedTo && (
            <>
              <span className="assignee-avatar">
                {task.assignedTo.name?.charAt(0).toUpperCase()}
              </span>
              <span>{task.assignedTo.name}</span>
            </>
          )}
        </div>
        {task.project && (
          <span className="task-project">📁 {task.project.name}</span>
        )}
      </div>

      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {isAdmin && (
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
