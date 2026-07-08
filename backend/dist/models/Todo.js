"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const todoSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Todo title is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const Todo = (0, mongoose_1.model)('Todo', todoSchema);
exports.default = Todo;
