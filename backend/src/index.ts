import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const PORT = process.env.PORT || 3000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const app = express();

app.use(express.json());
app.use('/api', routes);

app.get('/', (_, res) => {
  res.send('RV Cabs backend is running 🛣️');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
