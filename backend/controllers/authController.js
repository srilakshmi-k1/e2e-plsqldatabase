const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const db      = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'edusafeguard_jwt_secret_v2';

async function adminRegister(req, res) {
  const { institution_name, email, password, confirm_password } = req.body;
  if (!institution_name || !email || !password || !confirm_password)
    return res.status(400).json({ error: 'All fields are required.' });
  if (password !== confirm_password)
    return res.status(400).json({ error: 'Passwords do not match.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  try {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: 'Email already registered.' });

    const instResult = await db.query(
      'INSERT INTO institutions (name) VALUES ($1) RETURNING id', [institution_name]
    );
    const institutionId = instResult.rows[0].id;

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      `INSERT INTO users (name, email, password, role, is_active, institution_id)
       VALUES ($1, $2, $3, 'admin', TRUE, $4)`,
      [institution_name + ' Admin', email, hashed, institutionId]
    );
    res.json({ message: 'Admin registered successfully. Please login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
}

async function login(req, res) {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ error: 'Email, password and role are required.' });

  try {
    const result = await db.query(
      `SELECT u.*, i.name AS institution_name, b.name AS branch_name
       FROM users u
       LEFT JOIN institutions i ON u.institution_id = i.id
       LEFT JOIN branches b ON u.branch_id = b.id
       WHERE u.email = $1 AND u.role = $2`,
      [email, role]
    );
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials.' });

    const user = result.rows[0];

    if (!user.is_active || !user.password)
      return res.status(403).json({ error: 'Account not activated. Please activate your account first.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name,
        institution_id: user.institution_id, branch_id: user.branch_id },
      JWT_SECRET,
      { expiresIn: '10h' }
    );

    res.json({
      token,
      user: {
        id: user.id, name: user.name, email: user.email,
        role: user.role, institution_id: user.institution_id,
        institution_name: user.institution_name,
        branch_id: user.branch_id, branch_name: user.branch_name,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
}

async function activateCounsellor(req, res) {
  const { email, password, confirm_password } = req.body;
  if (!email || !password || !confirm_password)
    return res.status(400).json({ error: 'All fields are required.' });
  if (password !== confirm_password)
    return res.status(400).json({ error: 'Passwords do not match.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND role = 'counsellor'", [email]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'No counsellor account found with this email.' });

    const user = result.rows[0];
    if (user.password !== null)
      return res.status(400).json({ error: 'Account already activated. Please login.' });

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'UPDATE users SET password = $1, is_active = TRUE WHERE id = $2',
      [hashed, user.id]
    );
    res.json({ message: 'Account activated successfully. You can now login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
}

async function addCounsellor(req, res) {
  const { name, email, branch_id } = req.body;
  if (!name || !email || !branch_id)
    return res.status(400).json({ error: 'Name, email and branch are required.' });

  try {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: 'Email already registered.' });

    await db.query(
      `INSERT INTO users (name, email, password, role, is_active, branch_id, institution_id)
       VALUES ($1, $2, NULL, 'counsellor', FALSE, $3, $4)`,
      [name, email, branch_id, req.user.institution_id]
    );
    res.json({ message: `Counsellor ${name} added. They can now activate their account using their email.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
}

async function getCounsellors(req, res) {
  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.is_active, u.created_at,
              b.name AS branch_name, b.code AS branch_code,
              (SELECT COUNT(*) FROM assignments a WHERE a.counsellor_id = u.id AND a.status = 'active') AS assigned_count
       FROM users u
       LEFT JOIN branches b ON u.branch_id = b.id
       WHERE u.role = 'counsellor' AND u.institution_id = $1
       ORDER BY u.created_at DESC`,
      [req.user.institution_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

async function getBranches(req, res) {
  try {
    const result = await db.query('SELECT * FROM branches ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = { adminRegister, login, activateCounsellor, addCounsellor, getCounsellors, getBranches };
