import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

function TaskCard({ task, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="mb-3 "
      style={{
        background: "var(--color-body-bg)",
        border: "1px solid #1e293b",
        cursor: "pointer",
        borderRadius: "12px",
      }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <Badge bg={
            task.priority === "High"
    ? "warning"
    : task.priority === "Critical"
    ? "danger"
    : task.priority === "Medium"
    ? "primary"
    : task.priority === "Low"
    ? "info"
    : "dark"
}>
  {task.priority}
          </Badge>

          <small>{task.points}pt</small>
        </div>

        <h5>{task.title}</h5>

        <p className="text-secondary">
          {task.description}
        </p>

        <div className="d-flex gap-2 flex-wrap">
          {task.labels.map(label => (
            <Badge bg="var(--color-text-muted)" key={label}>
              {label}
            </Badge>
          ))}
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">

  <div>
    <i
      className="bi bi-chat"
      style={{
        color: "var(--color-text-muted)",
        fontSize: "18px"
      }}
    ></i>
  </div>

  <div className="avatar-circle">
    {task.assignee?.charAt(0).toUpperCase()}
  </div>

</div>
      </Card.Body>
    </Card>
  );
}

export default TaskCard;