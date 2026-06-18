import "./Dashboard.scss";
import { FiBarChart2 } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";

function Dashboard() {
  const sprintData = {
    totalTasks: 10,
    inProgress: 2,
    completed: 1,
    critical: 1,
    storyPoints: 8,
    totalStoryPoints: 52,
  };

  const stats = [
    {
      title: "Total Tasks",
      value: sprintData.totalTasks,
      icon: <FiBarChart2 />,
    },
    {
      title: "In Progress",
      value: sprintData.inProgress,
      icon: <FiClock />,
    },
    {
      title: "Completed",
      value: sprintData.completed,
      icon: <FiCheckCircle />,
    },
    {
      title: "Critical",
      value: sprintData.critical,
      icon: <FiAlertTriangle />,
    },
  ];

  const statusData = [
    { count: 3, label: "Backlog" },
    { count: 3, label: "To Do" },
    {
      count: sprintData.inProgress,
      label: "In Progress",
      className: "in-progress",
    },
    {
      count: 1,
      label: "Review",
      className: "review",
    },
    {
      count: sprintData.completed,
      label: "Done",
      className: "done",
    },
  ];

  const progressPercentage = Math.round(
    (sprintData.storyPoints / sprintData.totalStoryPoints) * 100
  );

  return (
    <div className="dashboard">
      <h1>Sprint 1</h1>

      <p>
        Core platform foundation with auth, dashboard, and task management
      </p>

      <div className="cards">
        {stats.map((item, index) => (
          <div className="task-card" key={index}>
            <div className="card-header">
              <h5>{item.title}</h5>
              {item.icon}
            </div>

            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="progress-card">
        <div className="progress-header">
          <h3>Sprint Progress</h3>
          <span>{progressPercentage}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progressPercentage}%`,
            }}
          ></div>
        </div>

        <p>
          {sprintData.storyPoints} / {sprintData.totalStoryPoints} story points
          completed
        </p>
      </div>

      <div className="status-card">
        <h3>Status Breakdown</h3>

        <div className="status-items">
          {statusData.map((item, index) => (
            <div key={index}>
              <h2>{item.count}</h2>
              <p className={item.className}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;