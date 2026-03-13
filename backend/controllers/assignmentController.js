const db = require('../db');

async function assignStudent(req, res) {
  const { student_id, counsellor_id } = req.body;
  if (!student_id || !counsellor_id)
    return res.status(400).json({ error: 'student_id and counsellor_id are required.' });

  try {
    const existing = await db.query(
      "SELECT id FROM assignments WHERE student_id = $1 AND status = 'active'",
      [student_id]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ error: 'Student is already assigned to a counsellor.' });

    await db.query(
      "INSERT INTO assignments (student_id, counsellor_id, status) VALUES ($1, $2, 'active')",
      [student_id, counsellor_id]
    );
    res.json({ message: 'Student assigned successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
}

async function bulkAssign(req, res) {
  const { assignments } = req.body;
  if (!Array.isArray(assignments) || assignments.length === 0)
    return res.status(400).json({ error: 'assignments array required.' });

  let success = 0, skipped = 0;
  for (const a of assignments) {
    const ex = await db.query(
      "SELECT id FROM assignments WHERE student_id = $1 AND status = 'active'",
      [a.student_id]
    );
    if (ex.rows.length > 0) { skipped++; continue; }
    await db.query(
      "INSERT INTO assignments (student_id, counsellor_id, status) VALUES ($1, $2, 'active')",
      [a.student_id, a.counsellor_id]
    );
    success++;
  }
  res.json({ message: `${success} assigned, ${skipped} already had assignments.` });
}

async function getMyCounsellees(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT s.id, s.name, s.cgpa, s.attendance, s.email, s.contact_number,
              r.level_name, b.name AS branch_name, b.name AS branch_code,
              a.id AS assignment_id, a.assigned_at
       FROM students s
       JOIN assignments a  ON s.id = a.student_id
       JOIN risk_levels r  ON s.risk_level_id = r.id
       LEFT JOIN branches b ON s.branch_id = b.id
       WHERE a.counsellor_id = $1 AND a.status = 'active'
       ORDER BY s.risk_level_id ASC, s.name ASC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

async function getAllAssignments(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT a.id, a.assigned_at, a.status,
              s.name AS student_name, s.cgpa, s.attendance,
              u.name AS counsellor_name, r.level_name, b.name AS branch_name
       FROM assignments a
       JOIN students s    ON a.student_id    = s.id
       JOIN users u       ON a.counsellor_id = u.id
       JOIN risk_levels r ON s.risk_level_id = r.id
       LEFT JOIN branches b ON s.branch_id   = b.id
       WHERE s.institution_id = $1
       ORDER BY a.assigned_at DESC`,
      [req.user.institution_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = { assignStudent, bulkAssign, getMyCounsellees, getAllAssignments };
