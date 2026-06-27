require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');
const Team = require('./models/Team');

// Sprint inline in case file not created yet
const sprintSchema = new mongoose.Schema({
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    startDate:   { type: Date, required: true },
    endDate:     { type: Date, required: true },
    status:      { type: String, enum: ['active', 'completed'], default: 'active' },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt:   { type: Date, default: Date.now }
});
const Sprint = mongoose.models.Sprint || mongoose.model('Sprint', sprintSchema);

const seed = async () => {
    try {
        // ── Connect ──────────────────────────────────────────────
        await mongoose.connect(process.env.MONGO_URI, {
            tls: true,
            tlsAllowInvalidCertificates: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('✅ MongoDB connected');

        // ── Clean ────────────────────────────────────────────────
        await User.deleteMany({});
        await Sprint.deleteMany({});
        await Task.deleteMany({});
        await Team.deleteMany({});
        console.log('🧹 Old data cleared');

        // ── Users ────────────────────────────────────────────────
        const hashedPassword = await bcrypt.hash('123456', 10);

        const users = await User.insertMany([
            { full_name: 'Test User',   email: 'test@test.com',   password: hashedPassword },
            { full_name: 'Sara Ahmed',  email: 'sara@test.com',   password: hashedPassword },
            { full_name: 'Ali Hassan',  email: 'ali@test.com',    password: hashedPassword },
            { full_name: 'Mariam Nour', email: 'mariam@test.com', password: hashedPassword },
            { full_name: 'Omar Khaled', email: 'omar@test.com',   password: hashedPassword },
        ]);

        const owner = users[0];
        console.log(`👤 ${users.length} users created`);

        // ── Team ─────────────────────────────────────────────────
        const team = await Team.create({
            name: 'AI Sprint Team',
            description: 'Building the AI-powered sprint management platform',
            createdBy: owner._id,
            members: users.map((u, i) => ({
                user: u._id,
                role: i === 0 ? 'owner' : 'member'
            }))
        });
        console.log(`👥 Team created: ${team.name} (${team.members.length} members)`);

        // ── Sprint ───────────────────────────────────────────────
        const sprint = await Sprint.create({
            name: 'Sprint 1',
            description: 'Core platform foundation with auth, dashboard, and task management',
            startDate: new Date('2026-06-01'),
            endDate:   new Date('2026-06-30'),
            status: 'active',
            createdBy: owner._id,
        });
        console.log(`🏃 Sprint created: ${sprint.name}`);

        // ── Tasks ─────────────────────────────────────────────────
        const tasks = [
            // Backlog
            {
                title: 'Set up CI/CD pipeline',
                description: 'GitHub Actions for automated testing and deployment to production',
                status: 'Backlog', priority: 'High', points: 5,
                assignee: 'Sara Ahmed',
                labels: ['devops'],
                criteria: ['Pipeline triggers on push to main', 'Auto deploy to staging', 'Tests must pass before deploy'],
            },
            {
                title: 'Implement search functionality',
                description: 'Full-text search across tasks and projects using MongoDB Atlas Search',
                status: 'Backlog', priority: 'Medium', points: 8,
                assignee: 'Ali Hassan',
                labels: ['feature', 'backend'],
                criteria: ['Search returns relevant results', 'Supports filters by status and priority', 'Results appear under 300ms'],
            },
            {
                title: 'Performance optimization',
                description: 'Lazy loading and code splitting for faster initial page loads',
                status: 'Backlog', priority: 'Medium', points: 5,
                assignee: 'Omar Khaled',
                labels: ['devops', 'frontend'],
                criteria: ['LCP under 2.5s', 'Bundle size reduced by 30%', 'Lighthouse score above 90'],
            },
            // To Do
            {
                title: 'Add real-time notifications',
                description: 'WebSocket-based notification system for task updates and mentions',
                status: 'To Do', priority: 'Medium', points: 8,
                assignee: 'Mariam Nour',
                labels: ['backend', 'feature'],
                criteria: ['Users receive live updates', 'Notification bell shows unread count', 'Mark all as read works'],
            },
            {
                title: 'Write API documentation',
                description: 'Document all REST endpoints with request/response examples',
                status: 'To Do', priority: 'Low', points: 3,
                assignee: 'Ali Hassan',
                labels: ['docs'],
                criteria: ['All endpoints documented', 'Examples included', 'Hosted on /api/docs'],
            },
            {
                title: 'User profile settings',
                description: 'Profile page with avatar upload and notification preferences',
                status: 'To Do', priority: 'Low', points: 3,
                assignee: 'Sara Ahmed',
                labels: ['feature', 'UI'],
                criteria: ['Users can update name and email', 'Avatar upload works', 'Preferences saved'],
            },
            // In Progress
            {
                title: 'Design dashboard layout',
                description: 'Create responsive dashboard with sprint stats and status breakdown',
                status: 'In Progress', priority: 'High', points: 5,
                assignee: 'Mariam Nour',
                labels: ['UI', 'design'],
                criteria: ['Dashboard shows sprint stats', 'Progress bar updates in real time', 'Mobile responsive'],
            },
            {
                title: 'Implement task drag & drop',
                description: 'Add drag-and-drop reordering between kanban board columns',
                status: 'In Progress', priority: 'Medium', points: 5,
                assignee: 'Test User',
                labels: ['UI', 'feature'],
                criteria: ['Tasks can be dragged between columns', 'Status updates on drop', 'Order persists on refresh'],
            },
            // Review
            {
                title: 'Add dark mode toggle',
                description: 'Theme switching with system preference detection',
                status: 'Review', priority: 'Low', points: 2,
                assignee: 'Omar Khaled',
                labels: ['UI'],
                criteria: ['Toggle switches theme instantly', 'Respects system preference', 'Choice persists after refresh'],
            },
            // Done
            {
                title: 'Set up authentication flow',
                description: 'Implement JWT-based auth with register, login and protected routes',
                status: 'Done', priority: 'Critical', points: 8,
                assignee: 'Sara Ahmed',
                labels: ['auth', 'backend'],
                criteria: ['Users can sign up', 'Users can log in', 'Protected routes redirect unauthenticated users'],
            },
        ];

        const createdTasks = await Task.insertMany(
            tasks.map(t => ({ ...t, sprint: sprint._id, createdBy: owner._id }))
        );
        console.log(`📋 ${createdTasks.length} tasks created`);

        // ── Summary ──────────────────────────────────────────────
        const byStatus = tasks.reduce((acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        }, {});
        const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);
        const donePoints  = tasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + t.points, 0);

        console.log('\n─────────────────────────────────');
        console.log('🌱 Seed complete!');
        console.log('─────────────────────────────────');
        console.log('📧 Login with any of these (password: 123456):');
        users.forEach(u => console.log(`   ${u.email}`));
        console.log(`👥 Team           : ${team.name} (${team.members.length} members)`);
        console.log(`🏃 Sprint         : ${sprint.name} (${sprint.status})`);
        console.log(`📋 Tasks          : ${createdTasks.length} total`);
        Object.entries(byStatus).forEach(([status, count]) => {
            console.log(`   ${status.padEnd(12)}: ${count}`);
        });
        console.log(`⚡ Story points   : ${donePoints} / ${totalPoints} done`);
        console.log('─────────────────────────────────\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seed();