"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Helper to generate JWT token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_todoflow_12345', { expiresIn: '7d' });
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Please provide both email and password' });
            return;
        }
        // Check if user already exists
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists with this email' });
            return;
        }
        // Create user
        const user = await User_1.default.create({ email, password });
        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error during registration',
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.register = register;
// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Please provide email and password' });
            return;
        }
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Match password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        res.status(200).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error during login',
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.login = login;
