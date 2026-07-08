"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todoController_1 = require("../controllers/todoController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply auth protection middleware to all todo routes
router.use(auth_1.protect);
router.route('/')
    .get(todoController_1.getTodos)
    .post(todoController_1.createTodo);
router.route('/:id')
    .put(todoController_1.updateTodo)
    .delete(todoController_1.deleteTodo);
exports.default = router;
