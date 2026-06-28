import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const STATUS_OPTIONS = ["Backlog", "To Do", "In Progress", "Review", "Done"];

function TaskModal({ show, handleClose, task, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!task) return null;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await onStatusChange(task._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(`Delete "${task.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await onDelete(task._id);
      handleClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="bg-dark text-light"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>{task.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <div className="mb-3">

          <Badge bg="primary">
            {task.priority}
          </Badge>

          <Badge bg="secondary" className="ms-2">
            {task.status}
          </Badge>

          <Badge bg="dark" className="ms-2">
            {task.points} pts
          </Badge>

        </div>

        <p>{task.description}</p>

        <h6>LABELS</h6>

        <div className="mb-4">
          {task.labels.map(label => (
            <Badge
              bg="secondary"
              key={label}
              className="me-2"
            >
              {label}
            </Badge>
          ))}
        </div>

        <h6>ACCEPTANCE CRITERIA</h6>

        <ul>
          {task.criteria.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h6>MOVE TO</h6>

        <Form.Select
          value={task.status}
          onChange={handleStatusChange}
          disabled={updating}
          className="mb-3 bg-dark text-light border-secondary"
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Form.Select>

        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleDeleteClick}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Task"}
        </Button>

      </Modal.Body>
    </Modal>
  );
}

export default TaskModal;