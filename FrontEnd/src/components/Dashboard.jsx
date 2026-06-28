import "./Dashboard.scss";
import { FiBarChart2 } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { token } = useAuth();

  const [sprintData, setSprintData] = useState({
    totalTasks: 0,
    inProgress: 0,
    completed: 0,
    critical: 0,
    storyPoints: 0,
    totalStoryPoints: 0,
    statusBreakdown: {
      'Backlog': 0, 'To Do': 0, 'In Progress': 0, 'Review': 0, 'Done': 0
    },
});
  const [sprintName, setSprintName] = useState("Sprint");
  const [sprintDescription, setSprintDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // get active sprint
        const sprintRes = await fetch('http://localhost:3000/sprints/active', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!sprintRes.ok) return;

        const sprint = await sprintRes.json();
        setSprintName(sprint.name);
        setSprintDescription(sprint.description);

        // get stats for that sprint
        const statsRes = await fetch(`http://localhost:3000/sprints/${sprint._id}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await statsRes.json();

        setSprintData({
          totalTasks: data.totalTasks,
          inProgress: data.inProgress,
          completed: data.completed,
          critical: data.critical,
          storyPoints: data.storyPoints,
          totalStoryPoints: data.totalStoryPoints,
          statusBreakdown: data.statusBreakdown,
      });

      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

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
    { count: sprintData.statusBreakdown['Backlog'], label: "Backlog" },
    { count: sprintData.statusBreakdown['To Do'], label: "To Do" },
    { count: sprintData.statusBreakdown['In Progress'], label: "In Progress", className: "in-progress" },
    { count: sprintData.statusBreakdown['Review'], label: "Review", className: "review" },
    { count: sprintData.statusBreakdown['Done'], label: "Done", className: "done" },
];

  const progressPercentage = sprintData.totalStoryPoints > 0
    ? Math.round((sprintData.storyPoints / sprintData.totalStoryPoints) * 100)
    : 0;


  if (loading) return (
    <div className="dashboard flex-grow-1 d-flex align-items-center justify-content-center">
      <div className="spinner-border text-secondary" role="status" />
    </div>
  );
  return (
    <div className="dashboard flex-grow-1">
      <h1>Sprints</h1>

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