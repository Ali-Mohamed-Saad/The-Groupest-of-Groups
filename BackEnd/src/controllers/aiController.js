const fetchAgent = require("../services/aiService.js");
const Conversation = require('../../models/Conversation.js');

const sendMessage = async (req, res) => {
    try {
        const { message, provider, conversationId } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            user: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const history = conversation.messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user', 
            parts: [{ text: m.content }]
        }));

        const reply = await fetchAgent(provider, message, history);

        conversation.messages.push({ role: 'user', content: message, provider });
        conversation.messages.push({ role: 'assistant', content: reply, provider });
        conversation.lastMessageAt = new Date();

        
        if (conversation.title === 'New Chat') {
            conversation.title = message.trim().slice(0, 40) + (message.length > 40 ? '...' : '');
        }

        await conversation.save();

        res.json({ reply, conversationId: conversation._id, title: conversation.title });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { sendMessage };