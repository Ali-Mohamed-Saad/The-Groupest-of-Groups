require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.post('/ai', async (req, res) => {
  try {
    const { message, provider, history } = req.body;
    console.log(`AI query received: "${message}" using provider: ${provider}`);

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (process.env.CHATGPT_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CHATGPT_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 1024,
          messages: [
            { role: 'system', content: 'AI Sprint Prompt' },
            ...(history || []),
            { role: 'user', content: message },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('ChatGPT API Error details:', error);
        throw new Error(`ChatGPT error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return res.json({ reply: data.choices[0].message.content });
    } else {
      console.log('CHATGPT_KEY not set. Returning fallback response.');
      const replies = [
        "Welcome to AI Sprint! I am your AI project assistant. How can I help you manage your sprints and tasks today?",
        "That sounds like an interesting task! To enable full GPT-4 integration, please set `CHATGPT_KEY` in your backend `.env` file.",
        "As a project management assistant, I can help you draft tickets, design workflows, and analyze team updates.",
      ];
      await new Promise((resolve) => setTimeout(resolve, 500));
      return res.json({ reply: replies[Math.floor(Math.random() * replies.length)] });
    }
  } catch (error) {
    console.error('AI Route Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'AI Sprint API Running' });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});