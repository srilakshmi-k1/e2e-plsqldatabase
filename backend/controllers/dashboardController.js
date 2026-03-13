const db = require('../db');

async function adminDashboard(req, res) {
  const iid = req.user.institution_id;
  try {
    const r1 = await db.query('SELECT COUNT(*) AS total FROM students WHERE institution_id = $1', [iid]);
    const r2 = await db.query('SELECT COUNT(*) AS high_risk FROM students WHERE institution_id = $1 AND risk_level_id = 1', [iid]);
    const r3 = await db.query('SELECT COUNT(*) AS moderate_risk FROM students WHERE institution_id = $1 AND risk_level_id = 2', [iid]);
    const r4 = await db.query('SELECT COUNT(*) AS safe FROM students WHERE institution_id = $1 AND risk_level_id = 3', [iid]);
    const r5 = await db.query(
      `SELECT COUNT(DISTINCT a.student_id) AS assigned
       FROM assignments a
       JOIN students s ON a.student_id = s.id
       WHERE s.institution_id = $1 AND a.status = 'active'`, [iid]
    );
    const r6 = await db.query(
      `SELECT COUNT(*) AS counsellors FROM users
       WHERE institution_id = $1 AND role = 'counsellor' AND is_active = TRUE`, [iid]
    );
    const r7 = await db.query(
      `SELECT COUNT(*) AS unassigned FROM students s
       WHERE s.institution_id = $1
         AND s.id NOT IN (SELECT student_id FROM assignments WHERE status = 'active')`, [iid]
    );

    const branchData = await db.query(
      `SELECT b.name AS branch, b.name AS code, COUNT(s.id) AS count,
              SUM(CASE WHEN s.risk_level_id = 1 THEN 1 ELSE 0 END) AS high,
              SUM(CASE WHEN s.risk_level_id = 2 THEN 1 ELSE 0 END) AS moderate,
              SUM(CASE WHEN s.risk_level_id = 3 THEN 1 ELSE 0 END) AS safe
       FROM branches b
       LEFT JOIN students s ON s.branch_id = b.id AND s.institution_id = $1
       GROUP BY b.id, b.name
       HAVING COUNT(s.id) > 0
       ORDER BY COUNT(s.id) DESC`, [iid]
    );

    const recentStudents = await db.query(
      `SELECT s.name, s.cgpa, s.attendance, r.level_name, b.name AS branch
       FROM students s
       JOIN risk_levels r  ON s.risk_level_id = r.id
       LEFT JOIN branches b ON s.branch_id = b.id
       WHERE s.institution_id = $1
       ORDER BY s.created_at DESC LIMIT 8`, [iid]
    );

    const counsellorLoad = await db.query(
      `SELECT u.name, COUNT(a.id) AS count
       FROM users u
       LEFT JOIN assignments a ON u.id = a.counsellor_id AND a.status = 'active'
       WHERE u.institution_id = $1 AND u.role = 'counsellor' AND u.is_active = TRUE
       GROUP BY u.id, u.name`, [iid]
    );

    const stats = {
      total:         parseInt(r1.rows[0].total),
      high_risk:     parseInt(r2.rows[0].high_risk),
      moderate_risk: parseInt(r3.rows[0].moderate_risk),
      safe:          parseInt(r4.rows[0].safe),
      assigned:      parseInt(r5.rows[0].assigned),
      counsellors:   parseInt(r6.rows[0].counsellors),
      unassigned:    parseInt(r7.rows[0].unassigned),
    };

    res.json({
      stats,
      branchData:     branchData.rows,
      recentStudents: recentStudents.rows,
      counsellorLoad: counsellorLoad.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
}

async function counsellorDashboard(req, res) {
  try {
    const r1 = await db.query(
      "SELECT COUNT(*) AS total FROM assignments WHERE counsellor_id = $1 AND status = 'active'",
      [req.user.id]
    );
    const r2 = await db.query(
      `SELECT COUNT(*) AS high FROM assignments a
       JOIN students s ON a.student_id = s.id
       WHERE a.counsellor_id = $1 AND a.status = 'active' AND s.risk_level_id = 1`,
      [req.user.id]
    );
    const r3 = await db.query(
      `SELECT COUNT(*) AS moderate FROM assignments a
       JOIN students s ON a.student_id = s.id
       WHERE a.counsellor_id = $1 AND a.status = 'active' AND s.risk_level_id = 2`,
      [req.user.id]
    );
    const r4 = await db.query(
      `SELECT COUNT(*) AS safe FROM assignments a
       JOIN students s ON a.student_id = s.id
       WHERE a.counsellor_id = $1 AND a.status = 'active' AND s.risk_level_id = 3`,
      [req.user.id]
    );
    const r5 = await db.query(
      'SELECT COUNT(*) AS followups FROM followups WHERE counsellor_id = $1',
      [req.user.id]
    );

    res.json({
      stats: {
        total:     parseInt(r1.rows[0].total),
        high:      parseInt(r2.rows[0].high),
        moderate:  parseInt(r3.rows[0].moderate),
        safe:      parseInt(r4.rows[0].safe),
        followups: parseInt(r5.rows[0].followups),
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = { adminDashboard, counsellorDashboard };
