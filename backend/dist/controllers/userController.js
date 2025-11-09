"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendingUsers = exports.admireUser = exports.voteCool = exports.searchUsers = exports.updateProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const email_1 = require("../utils/email");
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-password -verificationToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user._id,
            name: user.name,
            year: user.year,
            branch: user.branch,
            bio: user.bio,
            interests: user.interests,
            socialLinks: user.socialLinks,
            coolVotesCount: user.coolVotes.length,
            createdAt: user.createdAt
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const { bio, interests, socialLinks } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.user._id, { bio, interests, socialLinks }, { new: true }).select('-password -verificationToken');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateProfile = updateProfile;
const searchUsers = async (req, res) => {
    try {
        const { query, interests } = req.query;
        let searchQuery = {};
        if (query) {
            searchQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { interests: { $regex: query, $options: 'i' } }
            ];
        }
        if (interests) {
            const interestsArray = interests.split(',');
            searchQuery.interests = { $in: interestsArray };
        }
        const users = await User_1.default.find(searchQuery)
            .select('name year branch bio interests socialLinks coolVotes')
            .limit(20);
        const usersWithCoolCount = users.map(user => ({
            id: user._id,
            name: user.name,
            year: user.year,
            branch: user.branch,
            bio: user.bio,
            interests: user.interests,
            socialLinks: user.socialLinks,
            coolVotesCount: user.coolVotes.length
        }));
        res.json(usersWithCoolCount);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.searchUsers = searchUsers;
const voteCool = async (req, res) => {
    try {
        const { userId } = req.params;
        const voterId = req.user._id;
        if (userId === voterId.toString()) {
            return res.status(400).json({ message: 'Cannot vote for yourself' });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hasVoted = user.coolVotes.includes(voterId);
        if (hasVoted) {
            return res.status(400).json({ message: 'Already voted for this user' });
        }
        user.coolVotes.push(voterId);
        await user.save();
        res.json({ message: 'Cool vote recorded successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.voteCool = voteCool;
const admireUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const admirerId = req.user._id;
        if (userId === admirerId.toString()) {
            return res.status(400).json({ message: 'Cannot admire yourself' });
        }
        const admirer = await User_1.default.findById(admirerId);
        const admiredUser = await User_1.default.findById(userId);
        if (!admirer || !admiredUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Reset admire count if needed
        const now = new Date();
        const lastReset = new Date(admirer.lastAdmireReset);
        const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceReset >= 7) {
            admirer.admireCountThisWeek = 0;
            admirer.lastAdmireReset = now;
        }
        if (admirer.admireCountThisWeek >= 3) {
            return res.status(400).json({ message: 'Weekly admire limit reached' });
        }
        const userIdObj = userId;
        if (admirer.admiredUsers.some(id => id.toString() === userId)) {
            return res.status(400).json({ message: 'Already admired this user' });
        }
        admirer.admiredUsers.push(userIdObj);
        admirer.admireCountThisWeek += 1;
        await admirer.save();
        // Check for mutual admiration
        const isMutual = admiredUser.admiredUsers.some(id => id.toString() === admirerId.toString());
        if (isMutual) {
            // Mutual match!
            admirer.admirers.push(userIdObj);
            admiredUser.admirers.push(admirerId);
            await admirer.save();
            await admiredUser.save();
            // Send notifications
            try {
                await (0, email_1.sendMutualAdmireNotification)(admirer.email, admiredUser.name);
                await (0, email_1.sendMutualAdmireNotification)(admiredUser.email, admirer.name);
            }
            catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
            return res.json({ message: 'Mutual admiration match!', mutual: true });
        }
        else {
            // One-sided admiration
            admiredUser.admirers.push(admirerId);
            await admiredUser.save();
            // Send notification to admired user
            try {
                await (0, email_1.sendAdmireNotification)(admiredUser.email);
            }
            catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
            return res.json({ message: 'Admiration sent successfully', mutual: false });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.admireUser = admireUser;
const getTrendingUsers = async (req, res) => {
    try {
        const users = await User_1.default.find({})
            .select('name year branch bio interests coolVotes createdAt')
            .sort({ 'coolVotes.length': -1, createdAt: -1 })
            .limit(10);
        const trendingUsers = users.map(user => ({
            id: user._id,
            name: user.name,
            year: user.year,
            branch: user.branch,
            bio: user.bio,
            interests: user.interests,
            coolVotesCount: user.coolVotes.length
        }));
        res.json(trendingUsers);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTrendingUsers = getTrendingUsers;
