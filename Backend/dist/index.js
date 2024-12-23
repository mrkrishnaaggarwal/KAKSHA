"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const student_1 = __importDefault(require("./routes/student"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Initialize Prisma with explicit connection URL
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        },
    },
});
// Initialize database connection
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        console.log('✅ Database connected successfully');
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
});
// Connect to database when server starts
connectDB();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Logging middleware
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Test database connection
app.get('/api/healthcheck', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$queryRaw `SELECT 1`;
        console.log('Database health check passed');
        return res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Database health check failed:', error);
        return res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
}));
// Test route to check if server is running
app.get('/api/ping', (_req, res) => {
    res.json({
        message: 'pong',
        timestamp: new Date().toISOString()
    });
});
// Mount student routes
app.use('/api/students', student_1.default);
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Handle 404 routes
app.use((_req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested resource does not exist'
    });
});
// Start server only after database connection is established
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB();
        app.listen(port, () => {
            console.log(`
🚀 Server is running!
📍 Local: http://localhost:${port}
🛣️  Test API: http://localhost:${port}/api/ping
🏥 Health Check: http://localhost:${port}/api/healthcheck
👤 Profile API: http://localhost:${port}/api/students/profile

Environment: ${process.env.NODE_ENV || 'development'}
Database URL: ${process.env.DATABASE_URL ? '✓ Set' : '✗ Not set'}
JWT Secret: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Not set'}
      `);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
// Graceful shutdown
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('SIGTERM received. Closing HTTP server and database connection...');
    yield prisma.$disconnect();
    process.exit(0);
}));
exports.default = app;
