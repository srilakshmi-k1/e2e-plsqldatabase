const db = require('../db');
const { sendFollowupEmail } = require('../services/emailService');

async function addFollowup(req, res) {
  const { student_id, note, follow_date, send_email } = req.body;
  if (!student_id || !note || !follow_date)
    return res.status(400).json({ error: 'student_id, note and follow_date are required.' });

  try {
    await db.query(
      'INSERT INTO followups (student_id, counsellor_id, note, follow_date) VALUES ($1, $2, $3, $4)',
      [student_id, req.user.id, note, follow_date]
    );

    let emailStatus = { sent: false, error: null };

    if (send_email) {
      const studentResult = await db.query(
        'SELECT name, email FROM students WHERE id = $1', [student_id]
      );
      const student = studentResult.rows[0];

      if (!student?.email) {
        emailStatus = { sent: false, error: 'Student has no email address on record.' };
      } else {
        const result = await sendFollowupEmail({
          studentEmail:   student.email,
          studentName:    student.name,
          counsellorName: req.user.name,
          note,
          followDate: follow_date,
        });
        emailStatus = result.success
          ? { sent: true,  error: null }
          : { sent: false, error: result.error };
      }
    }

    res.json({
      message:     'Follow-up note saved.',
      email_sent:  emailStatus.sent,
      email_error: emailStatus.error,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
}

async function getFollowups(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT f.*, u.name AS counsellor_name
       FROM followups f
       JOIN users u ON f.counsellor_id = u.id
       WHERE f.student_id = $1
       ORDER BY f.follow_date DESC, f.created_at DESC`,
      [req.params.student_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

async function getMyFollowups(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT f.*, s.name AS student_name, b.name AS branch_name, r.level_name
       FROM followups f
       JOIN students s      ON f.student_id = s.id
       LEFT JOIN branches b ON s.branch_id = b.id
       LEFT JOIN risk_levels r ON s.risk_level_id = r.id
       WHERE f.counsellor_id = $1
       ORDER BY f.follow_date DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = { addFollowup, getFollowups, getMyFollowups };
