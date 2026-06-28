const Sprint = require('../../models/Sprint');
const Task = require('../../models/Task');

// POST /sprints
const createSprint = async (req, res) => {
    try {
        const { name, description, startDate, endDate } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Sprint name is required' });
        }
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }

        // Complete any currently active sprint before starting the new one
        await Sprint.updateMany(
            { createdBy: req.user._id, status: 'active' },
            { status: 'completed' }
        );

        const sprint = await Sprint.create({
            name: name.trim(),
            description: description || '',
            startDate,
            endDate,
            status: 'active',
            createdBy: req.user._id
        });

        res.status(201).json(sprint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSprintById = async (req, res) => {
    try {
        const sprint = await Sprint.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!sprint) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        res.json(sprint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /sprints
const getSprints = async (req, res) => {
    try {
        const sprints = await Sprint.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 });
        res.json(sprints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /sprints/active
const getActiveSprint = async (req, res) => {
    try {
        const sprint = await Sprint.findOne({
            createdBy: req.user._id,
            status: 'active'
        }).sort({ createdAt: -1 });

        if (!sprint) {
            return res.status(404).json({ error: 'No active sprint found' });
        }

        res.json(sprint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /sprints/:id/stats  — used by Dashboard
const getSprintStats = async (req, res) => {
    try {
        const sprint = await Sprint.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!sprint) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        const tasks = await Task.find({ sprint: req.params.id });

        const totalTasks = tasks.length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const completed = tasks.filter(t => t.status === 'Done').length;
        const critical = tasks.filter(t => t.priority === 'Critical').length;

        const totalStoryPoints = tasks.reduce((sum, t) => sum + t.points, 0);
        const storyPoints = tasks
            .filter(t => t.status === 'Done')
            .reduce((sum, t) => sum + t.points, 0);

        const statusBreakdown = {
            'Backlog':     tasks.filter(t => t.status === 'Backlog').length,
            'To Do':       tasks.filter(t => t.status === 'To Do').length,
            'In Progress': inProgress,
            'Review':      tasks.filter(t => t.status === 'Review').length,
            'Done':        completed
        };

        res.json({
            sprint,
            totalTasks,
            inProgress,
            completed,
            critical,
            storyPoints,
            totalStoryPoints,
            statusBreakdown
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /sprints/:id
const deleteSprint = async (req, res) => {
    try {
        const sprint = await Sprint.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!sprint) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        // delete all tasks that belonged to this sprint
        await Task.deleteMany({ sprint: req.params.id });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createSprint, getSprints, getActiveSprint, getSprintById, getSprintStats, deleteSprint };