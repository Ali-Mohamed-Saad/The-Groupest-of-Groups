import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function SprintSelector({ currentSprintId, onSprintChange }) {
  const { token } = useAuth();
  const [sprints, setSprints] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSprints = async () => {
      try {
        const res = await fetch('http://localhost:3000/sprints', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSprints(data);
      } catch (err) {
        console.error('Failed to load sprints:', err);
      }
    };
    if (token) loadSprints();
  }, [token]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "__new__") {
      setShowCreateForm(true);
      return;
    }
    onSprintChange(value);
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !startDate || !endDate) {
      setError("Name, start date, and end date are required");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('http://localhost:3000/sprints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), startDate, endDate }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create sprint');
      }

      const newSprint = await res.json();
      setSprints(prev => [newSprint, ...prev]);
      onSprintChange(newSprint._id);
      setShowCreateForm(false);
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="sprint-selector mb-3">
      <select
        className="form-select bg-dark text-light border-secondary"
        value={currentSprintId || ""}
        onChange={handleSelectChange}
      >
        {sprints.map(sprint => (
          <option key={sprint._id} value={sprint._id}>
            {sprint.name} {sprint.status === 'active' ? '(active)' : ''}
          </option>
        ))}
        <option value="__new__">+ New Sprint</option>
      </select>

      {showCreateForm && (
        <form onSubmit={handleCreateSprint} className="mt-3 p-3 rounded" style={{ background: "#091224", border: "1px solid #1e293b" }}>
          <input
            className="form-control mb-2 bg-dark text-light border-secondary"
            placeholder="Sprint name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={creating}
          />
          <textarea
            className="form-control mb-2 bg-dark text-light border-secondary"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={creating}
          />
          <div className="d-flex gap-2 mb-2">
            <input
              type="date"
              className="form-control bg-dark text-light border-secondary"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={creating}
            />
            <input
              type="date"
              className="form-control bg-dark text-light border-secondary"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={creating}
            />
          </div>
          {error && <div className="text-danger small mb-2">{error}</div>}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm" disabled={creating}>
              {creating ? "Creating..." : "Create Sprint"}
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowCreateForm(false)} disabled={creating}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default SprintSelector;