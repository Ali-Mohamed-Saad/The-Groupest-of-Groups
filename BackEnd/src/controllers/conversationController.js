const Conversation = require('../../models/Conversation.js');

const createConversation = async (req, res) => {
    try {
        const conversation = await Conversation.create({
            user: req.user._id,
            title: 'New Chat'
        });
        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ user: req.user._id })
            .select('title lastMessageAt createdAt')
            .sort({ lastMessageAt: -1 });
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getConversationById = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            user: req.user._id 
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createConversation,
    getConversations,
    getConversationById,
    deleteConversation
};