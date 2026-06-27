const Team = require('../../models/Team');
const User = require('../../models/User');

// POST /teams — create team, auto-add creator as owner
const createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Team name is required' });
        }

        const team = await Team.create({
            name: name.trim(),
            description: description || '',
            createdBy: req.user._id,
            members: [{ user: req.user._id, role: 'owner' }]
        });

        await team.populate('members.user', 'full_name email');

        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /teams/mine — get my team
const getMyTeam = async (req, res) => {
    try {
        const team = await Team.findOne({
            'members.user': req.user._id
        }).populate('members.user', 'full_name email');

        if (!team) {
            return res.status(404).json({ error: 'You are not in any team yet' });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /teams/invite — invite member by email
const inviteMember = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // find the team where requester is owner
        const team = await Team.findOne({
            'members': { $elemMatch: { user: req.user._id, role: 'owner' } }
        });

        if (!team) {
            return res.status(403).json({ error: 'Only the team owner can invite members' });
        }

        // find the user to invite
        const userToInvite = await User.findOne({ email: email.toLowerCase() });

        if (!userToInvite) {
            return res.status(404).json({ error: 'No user found with that email' });
        }

        // check if already a member
        const alreadyMember = team.members.some(
            m => m.user.toString() === userToInvite._id.toString()
        );

        if (alreadyMember) {
            return res.status(400).json({ error: 'User is already a team member' });
        }

        team.members.push({ user: userToInvite._id, role: 'member' });
        await team.save();
        await team.populate('members.user', 'full_name email');

        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /teams/members/:userId — remove a member (owner only)
const removeMember = async (req, res) => {
    try {
        const team = await Team.findOne({
            'members': { $elemMatch: { user: req.user._id, role: 'owner' } }
        });

        if (!team) {
            return res.status(403).json({ error: 'Only the team owner can remove members' });
        }

        // can't remove yourself
        if (req.params.userId === req.user._id.toString()) {
            return res.status(400).json({ error: 'Owner cannot remove themselves' });
        }

        team.members = team.members.filter(
            m => m.user.toString() !== req.params.userId
        );

        await team.save();
        await team.populate('members.user', 'full_name email');

        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTeam, getMyTeam, inviteMember, removeMember };