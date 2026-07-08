import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Todo from '../models/Todo';

// @desc    Get all user-specific todos
// @route   GET /api/todos
// @access  Private
export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'User context not found' });
      return;
    }

    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({
      message: 'Server error retrieving todos',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, priority } = req.body;

    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'User context not found' });
      return;
    }

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const todo = await Todo.create({
      user: req.user.id,
      title,
      description: description || '',
      priority: ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium',
      completed: false,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({
      message: 'Server error creating todo',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// @desc    Update an existing todo
// @route   PUT /api/todos/:id
// @access  Private
export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, completed, priority } = req.body;
    const todoId = req.params.id;

    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'User context not found' });
      return;
    }

    // Find the todo first
    const todo = await Todo.findById(todoId);
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
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined && ['Low', 'Medium', 'High'].includes(priority)) todo.priority = priority;

    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({
      message: 'Server error updating todo',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todoId = req.params.id;

    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'User context not found' });
      return;
    }

    // Find the todo
    const todo = await Todo.findById(todoId);
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
  } catch (error) {
    res.status(500).json({
      message: 'Server error deleting todo',
      error: error instanceof Error ? error.message : error,
    });
  }
};
