import { useState, useMemo } from "react";
import "./Team.css";

function Team() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Frontend Team",
      description: "Responsible for UI/UX development and frontend components",
      members: ["Alice Johnson", "Bob Smith", "Carol White"],
      memberEmails: [
        "alice@company.com",
        "bob@company.com",
        "carol@company.com",
      ],
      lead: "Alice Johnson",
      projects: 5,
      createdDate: "2024-01-15",
      color: "#3C83F6",
      status: "active",
    },
    {
      id: 2,
      name: "Backend Team",
      description: "API development and server-side logic",
      members: ["David Brown", "Eve Davis", "Frank Miller"],
      memberEmails: [
        "david@company.com",
        "eve@company.com",
        "frank@company.com",
      ],
      lead: "David Brown",
      projects: 7,
      createdDate: "2024-01-20",
      color: "#10B981",
      status: "active",
    },
    {
      id: 3,
      name: "DevOps Team",
      description: "Infrastructure, deployment, and CI/CD pipelines",
      members: ["Grace Lee", "Henry Wilson"],
      memberEmails: ["grace@company.com", "henry@company.com"],
      lead: "Grace Lee",
      projects: 3,
      createdDate: "2024-02-01",
      color: "#F59E0B",
      status: "active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lead: "",
    members: "",
  });

  const handleCreateTeam = () => {
    setFormData({ name: "", description: "", lead: "", members: "" });
    setSelectedTeam(null);
    setShowModal(true);
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setFormData({
      name: team.name,
      description: team.description,
      lead: team.lead,
      members: team.members.join(", "),
    });
    setShowModal(true);
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      setTeams(teams.filter((team) => team.id !== teamId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedTeam) {
      // Edit team
      setTeams(
        teams.map((team) =>
          team.id === selectedTeam.id
            ? {
                ...team,
                name: formData.name,
                description: formData.description,
                lead: formData.lead,
                members: formData.members.split(",").map((m) => m.trim()),
              }
            : team,
        ),
      );
    } else {
      // Create new team
      const colors = ["#3C83F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
      const newTeam = {
        id: Math.max(...teams.map((t) => t.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        lead: formData.lead,
        members: formData.members.split(",").map((m) => m.trim()),
        memberEmails: formData.members
          .split(",")
          .map((m, i) => `member${i}@company.com`),
        projects: 0,
        createdDate: new Date().toISOString().split("T")[0],
        color: colors[teams.length % colors.length],
        status: "active",
      };
      setTeams([...teams, newTeam]);
    }

    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Filter and sort teams
  const filteredAndSortedTeams = useMemo(() => {
    let result = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.lead.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "members") {
      result.sort((a, b) => b.members.length - a.members.length);
    } else if (sortBy === "projects") {
      result.sort((a, b) => b.projects - a.projects);
    }

    return result;
  }, [teams, searchQuery, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalTeams: teams.length,
      totalMembers: teams.reduce((sum, team) => sum + team.members.length, 0),
      totalProjects: teams.reduce((sum, team) => sum + team.projects, 0),
      avgTeamSize:
        teams.length > 0
          ? Math.round(
              teams.reduce((sum, team) => sum + team.members.length, 0) /
                teams.length,
            )
          : 0,
    };
  }, [teams]);

  return (
    <div className="team-container">
      {/* Stats Dashboard */}
      <div className="stats-dashboard">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#3C83F6" }}>
            <span className="material-symbols-outlined">groups</span>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalTeams}</div>
            <div className="stat-label">Total Teams</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#10B981" }}>
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalMembers}</div>
            <div className="stat-label">Team Members</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#F59E0B" }}>
            <span className="material-symbols-outlined">assignment</span>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalProjects}</div>
            <div className="stat-label">Active Projects</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#8B5CF6" }}>
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.avgTeamSize}</div>
            <div className="stat-label">Avg Team Size</div>
          </div>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="team-controls">
        <div className="control-left">
          <div className="search-box">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="members">Sort by Members</option>
            <option value="projects">Sort by Projects</option>
          </select>
        </div>

        <button className="btn-create-team" onClick={handleCreateTeam}>
          <span className="material-symbols-outlined">add</span>
          New Team
        </button>
      </div>

      {/* Teams Grid */}
      {filteredAndSortedTeams.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined empty-state-icon">
            {searchQuery ? "search_off" : "group_off"}
          </span>
          <h3 className="empty-state-title">
            {searchQuery ? "No Teams Found" : "No Teams Yet"}
          </h3>
          <p className="empty-state-text">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Create your first team to get started"}
          </p>
        </div>
      ) : (
        <div className="teams-grid">
          {filteredAndSortedTeams.map((team) => (
            <div
              key={team.id}
              className="team-card"
              style={{ borderLeftColor: team.color, borderLeftWidth: "4px" }}
            >
              <div className="team-card-header">
                <div className="team-title-section">
                  <h3 className="team-name">{team.name}</h3>
                  <span className="team-status">{team.status}</span>
                </div>
                <div className="card-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEditTeam(team)}
                    title="Edit team"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDeleteTeam(team.id)}
                    title="Delete team"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>

              <p className="team-description">{team.description}</p>

              <div className="team-lead-section">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1rem" }}
                >
                  person
                </span>
                <div>
                  <div className="lead-label">Team Lead</div>
                  <div className="lead-name">{team.lead}</div>
                </div>
              </div>

              <div className="team-members-section">
                <div className="members-header">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "1rem" }}
                  >
                    group
                  </span>
                  <span className="members-count">
                    {team.members.length} members
                  </span>
                </div>
                <div className="member-avatars">
                  {team.members.slice(0, 4).map((member, idx) => (
                    <div
                      key={idx}
                      className="member-avatar"
                      title={member}
                      style={{ backgroundColor: team.color }}
                    >
                      {getInitials(member)}
                    </div>
                  ))}
                  {team.members.length > 4 && (
                    <div
                      className="member-avatar more-badge"
                      title={`+${team.members.length - 4} more`}
                      style={{ backgroundColor: team.color }}
                    >
                      +{team.members.length - 4}
                    </div>
                  )}
                </div>
              </div>

              <div className="team-footer">
                <div className="footer-stat">
                  <div className="footer-stat-value">{team.projects}</div>
                  <div className="footer-stat-label">Projects</div>
                </div>
                <div className="footer-stat">
                  <div className="footer-stat-value">{team.members.length}</div>
                  <div className="footer-stat-label">Members</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTeam ? "Edit Team" : "Create New Team"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Team Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Frontend Team"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the team's purpose and responsibilities"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lead">Team Lead *</label>
                <input
                  id="lead"
                  type="text"
                  name="lead"
                  value={formData.lead}
                  onChange={handleInputChange}
                  placeholder="e.g., Alice Johnson"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="members">
                  Team Members (comma-separated) *
                </label>
                <textarea
                  id="members"
                  name="members"
                  value={formData.members}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe, Jane Smith, Bob Johnson"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedTeam ? "Update Team" : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Team;
