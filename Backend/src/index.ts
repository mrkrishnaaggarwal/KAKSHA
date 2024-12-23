// Backend/src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import studentRoutes from './routes/student';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize Prisma with explicit connection URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
});

// Initialize database connection
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Connect to database when server starts
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Test database connection
app.get('/api/healthcheck', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database health check passed');
    return res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    return res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Test route to check if server is running
app.get('/api/ping', (_req: Request, res: Response) => {
  res.json({
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

// Mount student routes
app.use('/api/students', studentRoutes);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource does not exist'
  });
});

// Start server only after database connection is established
const startServer = async () => {
  try {
    await connectDB();
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
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server and database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;