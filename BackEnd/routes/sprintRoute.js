const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    createSprint,
    getSprints,
    getActiveSprint,
    getSprintStats,
    deleteSprint
} = require('../src/controllers/sprintController');

router.use(authMiddleware);

router.post('/', createSprint);
router.get('/', getSprints);
router.get('/active', getActiveSprint);
router.get('/:id/stats', getSprintStats);
router.delete('/:id', deleteSprint);

module.exports = router;