import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDatabase, getStorageMode } from './dbConnection.js';
import { uploadMiddleware } from './middleware/upload.js';
import { authenticateToken, AuthRequest } from './middleware/auth.js';
import { registerUser, loginUser, getCurrentUser } from './controllers/authController.js';
import { getUserBills, getBillById, uploadBill, deleteBill } from './controllers/billController.js';
import { getComparison, getPredictions } from './controllers/analyticsController.js';
import {
  aiChat,
  generateDisputeLetter,
  getDisputes,
  getTariffs,
  calculateSavings,
  getNotifications,
  markNotificationRead
} from './controllers/utilityController.js';

const app = express();
const PORT = process.env.PORT || 5000;
const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || 'http://127.0.0.1:8001').replace(/\/+$/, '');
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

connectDatabase();

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    product: 'UrjaMitra',
    tagline: 'Your Smart Utility Companion.',
    storage_engine: getStorageMode(),
    status: 'operational',
    ai_service_configured: AI_SERVICE_URL,
    timestamp: new Date().toISOString()
  });
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Auth
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/me', authenticateToken, getCurrentUser);

// Bills
app.get('/api/bills', authenticateToken, getUserBills);
app.get('/api/bills/:id', authenticateToken, getBillById);
app.post('/api/bills/upload', authenticateToken, uploadMiddleware.single('billFile'), uploadBill);
app.delete('/api/bills/:id', authenticateToken, deleteBill);

// Analytics & Comparison
app.get('/api/comparison', authenticateToken, getComparison);
app.get('/api/predictions', authenticateToken, getPredictions);

// AI Assistant & Disputes
app.post('/api/ai/chat', authenticateToken, aiChat);
app.post('/api/disputes/generate', authenticateToken, generateDisputeLetter);
app.get('/api/disputes', authenticateToken, getDisputes);

// Tariffs & Savings
app.get('/api/tariffs', getTariffs);
app.post('/api/savings/calculate', calculateSavings);

// Notifications
app.get('/api/notifications', authenticateToken, getNotifications);
app.patch('/api/notifications/:id/read', authenticateToken, markNotificationRead);

app.listen(PORT, () => {
  console.log(`UrjaMitra Backend running on port ${PORT}`);
});

export default app;
