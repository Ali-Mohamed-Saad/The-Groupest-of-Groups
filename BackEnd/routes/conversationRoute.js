const express = require('express');
const authMiddleware = require('../middleware/auth.js');
const {
    createConversation,
    getConversations,
    getConversationById,
    deleteConversation
} = require('../src/controllers/conversationController.js');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createConversation);
router.get('/', getConversations);
router.get('/:id', getConversationById);
router.delete('/:id', deleteConversation);

module.exports = router;