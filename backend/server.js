const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const db   = require('./db');
const app  = express();
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));
} else {
  app.use(cors({ origin: true, credentials: true }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/students',    require('./routes/students'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/followups',   require('./routes/followups'));
app.use('/api/dashboard',   require('./routes/dashboard'));

app.get('/', (req, res) => res.json({ message: 'EduSafeGuard API v2 Running ✓' }));

app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() AS time');
    res.json({ status: 'ok', db: 'connected', time: result.rows[0].time });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

setInterval(async () => {
  try {
    await db.query('SELECT 1');
    console.log(`[${new Date().toISOString()}] DB keepalive OK`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] DB keepalive failed:`, err.message);
  }
}, 4 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`EduSafeGuard backend running on http://localhost:${PORT}`);
  console.log(`Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});