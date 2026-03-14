// 1. CORS
// 2. Middleware (express.json etc)
// 3. All routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/students',    require('./routes/students'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/followups',   require('./routes/followups'));
app.use('/api/dashboard',   require('./routes/dashboard'));

// 4. Root
app.get('/', (req, res) => res.json({ message: 'EduSafeGuard API v2 Running ✓' }));

// 5. Health check  ← MUST be before 404 handler
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() AS time');
    res.json({ status: 'ok', db: 'connected', time: result.rows[0].time });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

// 6. 404 handler  ← ALWAYS last
app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

// 7. keepalive interval
setInterval(...)
