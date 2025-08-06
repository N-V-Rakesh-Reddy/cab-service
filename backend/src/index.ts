import express from 'express';
import dotenv from 'dotenv';
import { unifiedAuth } from './middlewares/unifiedAuth';
import routes from './routes';
import { errorHandler, notFoundHandler } from './common/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Environment validation
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('Missing required environment variables: SUPABASE_URL, SUPABASE_KEY');
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Public health check (no auth required)
app.get('/health', (_, res) => res.json({ 
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}));

// Apply unified auth middleware to all API routes
app.use('/api/v1', unifiedAuth);

// Mount API routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (_, res) => {
  res.send('RV Cabs backend is running 🛣️');
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
