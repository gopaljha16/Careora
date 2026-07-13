import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import applicationsRoutes from './routes/applications';
import notesRoutes from './routes/notes';
import interviewsRoutes from './routes/interviews';
import statsRoutes from './routes/stats';
import settingsRoutes from './routes/settings';
import referralsRoutes from './routes/referrals';
import learningRoutes from './routes/learning';

import './jobs/dailyDigest';

const app = express();
const port = process.env.PORT || 4000;

// Rate Limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 auth requests per hour
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Restrict CORS in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.NEXTAUTH_URL || 'http://localhost:3000')
    : '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/', apiLimiter);

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/applications/:applicationId/notes', notesRoutes);
app.use('/api/applications/:applicationId/interviews', interviewsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/learning', learningRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 API server running on port ${port}`);
});
