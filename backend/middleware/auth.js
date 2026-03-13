const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'edusafeguard_jwt_secret_v2';

const authenticate = (req, res, next) => {
  const header = req.headers['authorization'];
  const token  = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'Admin access required.' });
  next();
};

module.exports = { authenticate, requireAdmin };
