require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/aiRoute');
const conversationRoutes = require('./routes/conversationRoute');
const taskRoutes = require('./routes/taskRoute');
const sprintRoutes = require('./routes/sprintRoute');
const teamRoutes = require('./routes/teamRoute');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/ai', aiRoutes);
app.use('/conversations', conversationRoutes);
app.use('/tasks', taskRoutes);
app.use('/sprints', sprintRoutes);
app.use('/teams', teamRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'AI Sprint API Running' });
});



connectDB();

app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});