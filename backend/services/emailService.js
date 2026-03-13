const nodemailer = require('nodemailer');

/**
 * Send a follow-up counselling email to a student.
 * Returns { success: true } or { success: false, error: string }
 */
async function sendFollowupEmail({ studentEmail, studentName, counsellorName, note, followDate }) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const formattedDate = new Date(followDate).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    });

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; margin:0; padding:0; }
    .wrap { max-width:560px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; border:1px solid #e3e8f2; }
    .header { background:linear-gradient(135deg,#1e3a8a,#2563eb); padding:28px 32px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:22px; font-weight:800; }
    .header p  { color:rgba(255,255,255,.8); margin:6px 0 0; font-size:13px; }
    .body { padding:28px 32px; }
    .greeting { font-size:16px; color:#111827; margin-bottom:18px; }
    .note-box { background:#eff4ff; border-left:4px solid #2563eb; border-radius:6px; padding:16px 18px; margin:18px 0; }
    .note-label { font-size:11px; font-weight:700; color:#2563eb; text-transform:uppercase; letter-spacing:.07em; margin-bottom:7px; }
    .note-text  { font-size:14.5px; color:#1f2937; line-height:1.7; }
    .meta { background:#f9fafb; border-radius:8px; padding:12px 16px; margin:18px 0; font-size:13px; color:#6b7280; }
    .meta strong { color:#374151; }
    .footer { background:#f4f6fb; padding:18px 32px; text-align:center; font-size:12px; color:#9ca3af; border-top:1px solid #e3e8f2; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>📋 Counsellor Follow-Up</h1>
      <p>EduSafeGuard – Student Retention &amp; Success Platform</p>
    </div>
    <div class="body">
      <p class="greeting">Dear <strong>${studentName}</strong>,</p>
      <p style="font-size:14.5px;color:#374151;line-height:1.7;">
        Your counsellor has added a follow-up note regarding your academic progress.
        Please review the note below and follow the recommendation. Contact your counsellor
        if you need further assistance.
      </p>
      <div class="note-box">
        <div class="note-label">Follow-up Note</div>
        <div class="note-text">${note}</div>
      </div>
      <div class="meta">
        <div>📅 <strong>Date:</strong> ${formattedDate}</div>
        <div style="margin-top:5px;">👤 <strong>Counsellor:</strong> ${counsellorName}</div>
      </div>
      <p style="font-size:13.5px;color:#6b7280;line-height:1.7;">
        Please follow the recommendation provided above. Your academic success is our priority.
      </p>
      <p style="font-size:13.5px;color:#374151;">
        Regards,<br />
        <strong>EduSafeGuard System</strong>
      </p>
    </div>
    <div class="footer">
      EduSafeGuard · Student Retention &amp; Success Platform · B.Tech Final Year Project 2026
    </div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
      from:    `"EduSafeGuard System" <${process.env.EMAIL_USER}>`,
      to:      studentEmail,
      subject: 'Counsellor Follow-Up – EduSafeGuard',
      html:    htmlBody,
      text:
        `Dear ${studentName},\n\n` +
        `Your counsellor has added a follow-up note regarding your academic progress.\n\n` +
        `Note: ${note}\n\n` +
        `Date: ${formattedDate}\nCounsellor: ${counsellorName}\n\n` +
        `Please follow the recommendation and contact your counsellor if required.\n\n` +
        `Regards,\nEduSafeGuard System`,
    });

    return { success: true };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendFollowupEmail };
