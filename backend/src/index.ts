import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';

// Import routes (will be created soon)
import authRoutes from './routes/auth';
import applicationsRoutes from './routes/applications';
import notesRoutes from './routes/notes';
import interviewsRoutes from './routes/interviews';
import statsRoutes from './routes/stats';

// Initialize cron jobs
import './jobs/dailyDigest';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/applications/:applicationId/notes', notesRoutes);
app.use('/api/applications/:applicationId/interviews', interviewsRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 API server running on port ${port}`);
});
