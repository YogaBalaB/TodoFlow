"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    // Connect to Database
    await (0, db_1.default)();
    // Start Express Server
    const server = app_1.default.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
    // Handle server errors
    server.on('error', (error) => {
        console.error(`Server starting error: ${error.message}`);
    });
};
startServer();
