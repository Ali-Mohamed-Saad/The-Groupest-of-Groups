const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true 
        },
        content: {
            type: String,
            required: true
        },
        provider: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
});

const conversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'New Chat',
        trim: true
    },
    messages: [messageSchema],
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conversation', conversationSchema);