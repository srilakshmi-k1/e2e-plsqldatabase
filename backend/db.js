const { Pool } = require('pg');
require('dotenv').config();

const isLocal = !process.env.DB_HOST ||
                process.env.DB_HOST === 'localhost' ||
                process.env.DB_HOST === '127.0.0.1';

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'edusafeguard',
  ssl:      isLocal ? false : { rejectUnauthorized: false },

  max:                         10,
  min:                         1,
  connectionTimeoutMillis:     30000,
  idleTimeoutMillis:           60000,
  allowExitOnIdle:             false,
  keepAlive:                   true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Pool error:', err.message);
});

pool.on('connect', () => {
  console.log('New DB connection established');
});

const connectWithRetry = async (retries = 5, delay = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = await pool.connect();
      console.log(`PostgreSQL connected — ${isLocal ? 'LOCAL' : 'RENDER/REMOTE'}`);
      client.release();
      return;
    } catch (err) {
      console.error(`Connection attempt ${i}/${retries} failed: ${err.message}`);
      if (i < retries) {
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('All connection attempts failed. Check your .env DB settings.');
      }
    }
  }
};

connectWithRetry();

const RETRYABLE = ['timeout', 'terminated', 'ECONNRESET', 'Connection terminated', 'idle'];

const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    const shouldRetry = RETRYABLE.some(keyword => err.message.includes(keyword));
    if (shouldRetry) {
      console.warn('Query failed, retrying once...', err.message);
      try {
        return await pool.query(text, params);
      } catch (retryErr) {
        console.error('Retry also failed:', retryErr.message);
        throw retryErr;
      }
    }
    throw err;
  }
};

module.exports = { query, pool };
