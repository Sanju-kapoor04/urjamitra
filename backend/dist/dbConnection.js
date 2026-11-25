"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.getStorageMode = getStorageMode;
const mongoose_1 = __importDefault(require("mongoose"));
const database_js_1 = require("./database.js");
let isMongoConnected = false;
async function connectDatabase() {
    // Always initialize SQLite for zero-config offline reliability
    (0, database_js_1.initDb)();
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/urjamitra';
    try {
        // Attempt Mongoose connection with 2s timeout
        await mongoose_1.default.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        isMongoConnected = true;
        console.log('[UrjaMitra Database] Connected to MongoDB database at:', mongoUri);
    }
    catch (err) {
        isMongoConnected = false;
        console.warn('[UrjaMitra Database] MongoDB service unavailable, utilizing embedded database engine.');
    }
}
function getStorageMode() {
    return isMongoConnected ? 'mongodb' : 'sqlite';
}
