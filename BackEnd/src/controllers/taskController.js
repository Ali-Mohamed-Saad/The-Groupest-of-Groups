const Task = require('../../models/Task');

// POST /tasks
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, points, assignee, labels, criteria, sprintId } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!sprintId) {
            return res.status(400).json({ error: 'Sprint ID is required' });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description || '',
            status: status || 'Backlog',
            priority: priority || 'Medium',
            points: points || 1,
            assignee: assignee || '',
            labels: labels || [],
            criteria: criteria || [],
            sprint: sprintId,
            createdBy: req.user._id
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /tasks?sprintId=...
const getTasks = async (req, res) => {
    try {
        const { sprintId } = req.query;

        if (!sprintId) {
            return res.status(400).json({ error: 'Sprint ID is required' });
        }

        const tasks = await Task.find({ sprint: sprintId }).sort({ createdAt: 1 });

        const columns = {
            'Backlog': [],
            'To Do': [],
            'In Progress': [],
            'Review': [],
            'Done': []
        };

        tasks.forEach(task => {
            if (columns[task.status]) {
                columns[task.status].push(task);
            }
        });

        res.json({ tasks, columns });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /tasks/:id
const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH /tasks/:id/status
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /tasks/:id
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTask, getTasks, updateTask, updateTaskStatus, deleteTask };