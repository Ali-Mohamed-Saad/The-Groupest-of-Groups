import { useState, useEffect } from "react";

import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { useAuth } from "../context/AuthContext";

function Board() {

  const { token } = useAuth();

  const [show, setShow] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [boardData, setBoardData] = useState({
    "Backlog": [], "To Do": [], "In Progress": [], "Review": [], "Done": []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        // get active sprint
        const sprintRes = await fetch('http://localhost:3000/sprints/active', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!sprintRes.ok) return;

        const sprint = await sprintRes.json();

        // get tasks grouped by column
        const tasksRes = await fetch(`http://localhost:3000/tasks?sprintId=${sprint._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await tasksRes.json();
        setBoardData(data.columns);  
      } catch (err) {
        console.error('Failed to load board:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [token]);


  const openTask = (task) => {
    setSelectedTask(task);
    setShow(true);
  };

  return (
    <div
      className="p-4 "
      style={{
        minHeight: "100vh",
        background: "var(--color-card-bg);"
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
                 key={task._id}
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
