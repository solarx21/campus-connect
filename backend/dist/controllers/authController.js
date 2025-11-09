"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyEmail = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const email_1 = require("../utils/email");
const register = async (req, res) => {
    try {
        const { name, email, password, year, branch } = req.body;
        // Check if email is from college domain (basic check)
        if (!email.endsWith('.edu') && !email.includes('college') && !email.includes('university')) {
            return res.status(400).json({ message: 'Please use a valid college email address' });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
            year,
            branch,
            verificationToken
        });
        await user.save();
        // Send verification email
        try {
            await (0, email_1.sendVerificationEmail)(email, verificationToken);
        }
        catch (emailError) {
            console.error('Email sending failed:', emailError);
        }
        res.status(201).json({ message: 'User registered successfully. Please check your email for verification.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User_1.default.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid verification token' });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        res.json({ message: 'Email verified successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.verifyEmail = verifyEmail;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                year: user.year,
                branch: user.branch,
                bio: user.bio,
                interests: user.interests,
                socialLinks: user.socialLinks,
                coolVotesCount: user.coolVotes.length
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
