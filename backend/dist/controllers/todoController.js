"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodos = void 0;
const Todo_1 = __importDefault(require("../models/Todo"));
// @desc    Get all user-specific todos
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const todos = await Todo_1.default.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(todos);
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error retrieving todos',
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.getTodos = getTodos;
// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        if (!title) {
            res.status(400).json({ message: 'Title is required' });
            return;
        }
        const todo = await Todo_1.default.create({
            user: req.user.id,
            title,
            description: description || '',
            completed: false,
        });
        res.status(201).json(todo);
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error creating todo',
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.createTodo = createTodo;
// @desc    Update an existing todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const todoId = req.params.id;
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        // Find the todo first
        const todo = await Todo_1.default.findById(todoId);
        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }
        // Ensure the todo belongs to the user
        if (todo.user.toString() !== req.user.id) {
            res.status(403).json({ message: 'Access denied: not your todo' });
            return;
        }
        // Apply updates
        if (title !== undefined)
            todo.title = title;
        if (description !== undefined)
            todo.description = description;
        if (completed !== undefined)
            todo.completed = completed;
        const updatedTodo = await todo.save();
        res.status(200).json(updatedTodo);
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error updating todo',
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.updateTodo = updateTodo;
// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.id;
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        // Find the todo
        const todo = await Todo_1.default.findById(todoId);
        if (!todo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }
        // Ensure the todo belongs to the user
        if (todo.user.toString() !== req.user.id) {
            res.status(403).json({ message: 'Access denied: not your todo' });
            return;
        }
        // Delete
        await todo.deleteOne();
        res.status(200).json({ message: 'Todo deleted successfully', id: todoId });
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error deleting todo',
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.deleteTodo = deleteTodo;
