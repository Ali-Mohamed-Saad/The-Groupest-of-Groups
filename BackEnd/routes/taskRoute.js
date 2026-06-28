const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    createTask,
    getTasks,
    updateTask,
    updateTaskStatus,
    deleteTask,
    createBulkTasks
} = require('../src/controllers/taskController');

router.use(authMiddleware);

router.post('/', createTask);
router.post('/bulk', createBulkTasks);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;