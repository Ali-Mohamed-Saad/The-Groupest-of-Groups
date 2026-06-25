import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";

function TaskModal({ show, handleClose, task }) {
  if (!task) return null;

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

      </Modal.Body>
    </Modal>
  );
}

export default TaskModal;
