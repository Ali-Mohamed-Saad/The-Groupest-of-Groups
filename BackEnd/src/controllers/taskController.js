const Task = require('../../models/Task');
const Sprint = require('../../models/Sprint');

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

const createBulkTasks = async (req, res) => {
    try {
        const { tasks, sprintId } = req.body;

        if (!Array.isArray(tasks) || tasks.length === 0) {
            return res.status(400).json({ error: 'tasks must be a non-empty array' });
        }

        let targetSprintId = sprintId;

        if (!targetSprintId) {
            const activeSprint = await Sprint.findOne({
                createdBy: req.user._id,
                status: 'active'
            }).sort({ createdAt: -1 });

            if (!activeSprint) {
                return res.status(400).json({ error: 'No active sprint found. Create a sprint first.' });
            }
            targetSprintId = activeSprint._id;
        }

        const tasksToInsert = tasks.map(t => ({
            title: t.title,
            description: t.description || '',
            priority: t.priority || 'Medium',
            points: t.points || 1,
            assignee: t.assignee || '',
            labels: t.labels || [],
            criteria: t.criteria || [],
            status: 'Backlog',
            sprint: targetSprintId,
            createdBy: req.user._id,
        }));

        const createdTasks = await Task.insertMany(tasksToInsert);
        res.status(201).json(createdTasks);
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

module.exports = { createTask, getTasks, updateTask, updateTaskStatus, deleteTask, createBulkTasks };