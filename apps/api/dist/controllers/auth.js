"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.me = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const logger_1 = require("../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user already exists
        const existingUser = await user_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create new user
        const user = new user_1.User({
            email,
            password: hashedPassword,
        });
        await user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        logger_1.logger.info(`User registered successfully: ${email}`);
        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error in signup:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await user_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        logger_1.logger.info(`User logged in successfully: ${email}`);
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error in login:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};
exports.login = login;
const me = async (req, res) => {
    var _a;
    try {
        const user = await user_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            user: {
                id: user.id,
                email: user.email,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error in me:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};
exports.me = me;
const logout = (req, res) => {
    // In a JWT-based auth system, the client is responsible for removing the token
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const getCurrentUser = async (req, res) => {
    try {
        // The user ID should be added by the auth middleware
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await user_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            user: {
                id: user._id,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Error getting current user' });
    }
};
exports.getCurrentUser = getCurrentUser;
