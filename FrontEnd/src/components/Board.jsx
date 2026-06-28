import { useState, useEffect } from "react";

import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import SprintSelector from "./SprintSelector";
import { useAuth } from "../context/AuthContext";

function Board() {

  const { token } = useAuth();

  const [show, setShow] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [currentSprintId, setCurrentSprintId] = useState(null);

  const [boardData, setBoardData] = useState({
    "Backlog": [], "To Do": [], "In Progress": [], "Review": [], "Done": []
  });
  const [loading, setLoading] = useState(true);

  // On mount, default to the active sprint
  useEffect(() => {
    const loadActiveSprint = async () => {
      try {
        const sprintRes = await fetch('http://localhost:3000/sprints/active', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!sprintRes.ok) {
          setLoading(false);
          return;
        }

        const sprint = await sprintRes.json();
        setCurrentSprintId(sprint._id);
      } catch (err) {
        console.error('Failed to load active sprint:', err);
        setLoading(false);
      }
    };

    if (token) loadActiveSprint();
  }, [token]);

  // Whenever the selected sprint changes (initial load or dropdown switch), load its tasks
  useEffect(() => {
    if (!currentSprintId) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const tasksRes = await fetch(`http://localhost:3000/tasks?sprintId=${currentSprintId}`, {
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

    fetchTasks();
  }, [currentSprintId, token]);


  const openTask = (task) => {
    setSelectedTask(task);
    setShow(true);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update task status');
      const updatedTask = await res.json();

      setBoardData(prev => {
        const next = {};
        for (const [col, tasks] of Object.entries(prev)) {
          next[col] = tasks.filter(t => t._id !== taskId);
        }
        next[newStatus] = [...(next[newStatus] || []), updatedTask];
        return next;
      });

      setSelectedTask(updatedTask);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(`Could not update task: ${err.message}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete task');

      setBoardData(prev => {
        const next = {};
        for (const [col, tasks] of Object.entries(prev)) {
          next[col] = tasks.filter(t => t._id !== taskId);
        }
        return next;
      });
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert(`Could not delete task: ${err.message}`);
    }
  };

  return (
    <div
      className="p-4 d-flex flex-column h-100"
      style={{
        background: "var(--color-card-bg)"
      }}
    >

      <h5 className="mb-2 flex-shrink-0">Board</h5>

      <div className="flex-shrink-0">
        <SprintSelector currentSprintId={currentSprintId} onSprintChange={setCurrentSprintId} />
      </div>

      {loading ? (
        <div>Loading board...</div>
      ) : (
        <div className="d-flex gap-4 flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>

          {Object.entries(boardData).map(
            ([columnName, tasks]) => (

              <div
                key={columnName}
                style={{ width: "263px", minWidth: "263px" }}
                className="d-flex flex-column"
              >

                <div className="d-flex mb-3 flex-shrink-0">
                  <h5>{columnName}</h5>

                  <span
                    className="ms-2 badge bg-secondary"
                  >
                    {tasks.length}
                  </span>
                </div>

                <div className=" flex-grow-1" style={{ minHeight: 0 }}>
                  {tasks.map(task => (
                    <TaskCard
                     key={task._id}
                      task={task}
                      onClick={() => openTask(task)}
                    />
                  ))}
                </div>

              </div>

            )
          )}

        </div>
      )}

      <TaskModal
        show={show}
        handleClose={() => setShow(false)}
        task={selectedTask}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
      />

    </div>
  );
}

export default Board;