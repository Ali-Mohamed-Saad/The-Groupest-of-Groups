import { useState } from "react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

function Board() {

  const [show, setShow] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const boardData = {
    "Backlog": [
      {
        id: 1,
        title: "Set up CI/CD pipeline",
        priority: "High",
        status: "Backlog",
        points: 5,
        assignee: "Sara",
        description:
          "GitHub Actions for automated testing and deployment",
        labels: ["devops"],
        criteria: [
          "Pipeline works",
          "Auto deploy enabled"
        ]
      },
      {
        id: 2,
        title: "Implement search functionality",
        priority: "Medium",
        status: "Backlog",
        points: 8,
        assignee: "Ali",
        description:
          "Full-text search across tasks and projects",
        labels: ["feature"," backend"],
        criteria: [
          "Search returns relevant results",
          "Supports filters"
        ]
      },
      {
        id: 3,
        title: "Performance optimization",
        priority: "Medium",
        status: "Backlog",
        points: 5,
        assignee: "Omar",
        description:
          "Lazy loading and code splitting for faster loads",
        labels: ["devops"],
        criteria: [
          "LCP under 2.5s",
          "Bundle size reduced"
        ]
      }
    ],

    "To Do": [
      {
        id: 1,
        title: "Add real-time notifications",
        priority: "Medium",
        status: "To Do",
        points: 8,
        assignee: "Mariam",
        description:
          "WebSocket-based notification system",
        labels: ["backend", "feature"],
        criteria: [
          "Users receive live updates",
          "Notification bell shows count"
        ]
      },
      {
        id: 2,
        title: "Write API documentation",
        priority: "Low",
        status: "To Do",
        points: 3,
        assignee: "Ahmed",
        description:
          "Document all REST endpoints with examples",
        labels: ["docs"],
        criteria: [
          "All endpoints documented",
          "Examples included"
        ]
      },
      {
        id: 3,
        title: "User profile settings",
        priority: "Low",
        status: "To Do",
        points: 3,
        assignee: "Mohamed",
        description:
          "Profile page with avatar upload and preferences",
        labels: [ "feature" ,"UI"],
        criteria: [
          "Users can update profile",
          "Avatar upload works"
        ]
      }
    ],

    "In Progress": [
      {
        id: 1,
        title: "Design dashboard layout",
        priority: "High",
        status: "In Progress",
        points: 5,
        assignee: "Poda",
        description:
          "Create responsive dashboard with key metrics",
        labels: ["UI", "design"],
        criteria: [
          "Dashboard shows project stats",
          "Mobile responsive"
        ]
      },
      {
        id: 2,
        title: "Implement task drag & drop",
        priority: "Medium",
        status: "In Progress",
        points: 5,
        assignee: "Rawan",
        description:
          "Add drag-and-drop reordering to kanban board",
        labels: ["UI", "feature"],
        criteria: [
          "Tasks can be dragged between columns",
          "Order persists"
        ]
      }
    ],
    "Review": [
      {
        id: 1,
        title: "Add dark mode toggle",
        priority: "Low",
        status: "Review",
        points: 2,
        assignee: "Kaled",
        description:
          "Theme switching with system preference detection",
        labels: ["UI"],
        criteria: [
          "Toggle works",
          "Respects system preference"
        ]
      }
    ],
    "Done": [
      {
        id: 1,
        title: "Set up authentication flow",
        priority: "Critical",
        status: "Done",
        points: 8,
        assignee: "Nor",
        description:
          "Implement JWT-based auth with refresh tokens",
        labels: ["auth", "backend"],
        criteria: [
          "Users can sign up",
          "Users can log in",
          "Tokens refresh automatically"
        ]
      }
    ]
  };

  const openTask = (task) => {
    setSelectedTask(task);
    setShow(true);
  };

  return (
    <div
      className="p-4 text-light"
      style={{
        minHeight: "100vh",
        background: "#020817"
      }}
    >

      <h5 className="mb-4 ">Board</h5>

      <div className="d-flex gap-4">

        {Object.entries(boardData).map(
          ([columnName, tasks]) => (

            <div
              key={columnName}
              style={{ width: "280px" }}
            >

              <div className="d-flex mb-3">
                <h5>{columnName}</h5>

                <span
                  className="ms-2 badge bg-secondary"
                >
                  {tasks.length}
                </span>
              </div>

              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => openTask(task)}
                />
              ))}

            </div>

          )
        )}

      </div>

      <TaskModal
        show={show}
        handleClose={() => setShow(false)}
        task={selectedTask}
      />

    </div>
  );
}

export default Board;
