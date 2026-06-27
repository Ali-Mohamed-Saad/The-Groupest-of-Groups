const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    createTeam,
    getMyTeam,
    inviteMember,
    removeMember
} = require('../src/controllers/teamController');

router.use(authMiddleware);

router.post('/', createTeam);
router.get('/mine', getMyTeam);
router.post('/invite', inviteMember);
router.delete('/members/:userId', removeMember);

module.exports = router;