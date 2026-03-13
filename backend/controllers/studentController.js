const csv    = require('csv-parser');
const fs     = require('fs');
const db     = require('../db');
const { calculateRiskLevelId, generateAISuggestions } = require('../services/riskService');

/* Helper — strips invisible characters from any cell value */
function clean(val) {
  if (val === undefined || val === null) return '';
  return val.toString()
    .replace(/^\uFEFF/, '')   // BOM
    .replace(/\r/g, '')       // carriage return
    .replace(/\u00a0/g, ' ')  // non-breaking space
    .trim();
}

/* Helper — flexible column lookup, case-insensitive */
function pick(row, ...keys) {
  for (const k of keys) {
    const found = Object.keys(row).find(
      rk => rk.trim().toLowerCase() === k.toLowerCase()
    );
    if (found && clean(row[found])) return clean(row[found]);
  }
  return '';
}

async function uploadCSV(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Please select a CSV file.' });

  const records = [];
  const errors  = [];
  let rowIndex  = 0;

  try {
    /* Load branch map — index by full name AND code column */
    const branchResult = await db.query('SELECT id, name, code FROM branches');
    const branchMap    = {};
    branchResult.rows.forEach(b => {
      /* index by full name e.g. COMPUTER SCIENCE & ENGINEERING */
      branchMap[b.name.trim().toUpperCase()] = b.id;
      /* index by code column e.g. CSE — if the column exists */
      if (b.code) branchMap[b.code.trim().toUpperCase()] = b.id;
      /* also index name with AND instead of & */
      branchMap[b.name.trim().toUpperCase().replace(/&/g, 'AND').replace(/  +/g, ' ')] = b.id;
    });

    /* Extra aliases so any common abbreviation works */
    const knownAliases = {
      'CS':                               'COMPUTER SCIENCE & ENGINEERING',
      'COMPUTER SCIENCE':                 'COMPUTER SCIENCE & ENGINEERING',
      'COMPUTER SCIENCE AND ENGINEERING': 'COMPUTER SCIENCE & ENGINEERING',
      'CSE':                              'COMPUTER SCIENCE & ENGINEERING',
      'EC':                               'ELECTRONICS & COMMUNICATION',
      'ELECTRONICS':                      'ELECTRONICS & COMMUNICATION',
      'ELECTRONICS AND COMMUNICATION':    'ELECTRONICS & COMMUNICATION',
      'ECE':                              'ELECTRONICS & COMMUNICATION',
      'MECHANICAL':                       'MECHANICAL ENGINEERING',
      'ME':                               'MECHANICAL ENGINEERING',
      'MECH':                             'MECHANICAL ENGINEERING',
      'CE':                               'CIVIL ENGINEERING',
      'CIVIL':                            'CIVIL ENGINEERING',
      'IT':                               'INFORMATION TECHNOLOGY',
      'AIDS':                             'AI & DATA SCIENCE',
      'AI AND DATA SCIENCE':              'AI & DATA SCIENCE',
      'AI & DS':                          'AI & DATA SCIENCE',
      'AIDS':                             'AI & DATA SCIENCE',
    };
    Object.entries(knownAliases).forEach(([alias, fullName]) => {
      if (!branchMap[alias] && branchMap[fullName.toUpperCase()]) {
        branchMap[alias] = branchMap[fullName.toUpperCase()];
      }
    });

    console.log('✅ Branch map keys:', Object.keys(branchMap));

    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv({
          mapHeaders: ({ header }) => clean(header),
          strict: false,
        }))
        .on('headers', headers => {
          console.log('📋 CSV headers found:', headers);
        })
        .on('data', row => {
          rowIndex++;
          console.log(`\n--- Row ${rowIndex} raw ---`, JSON.stringify(row));

          /* Extract fields with multiple fallback column names */
          const serial  = pick(row, 'Serial Number', 'serial_number', 'Serial', 'S.No', 'Sno');
          const name    = pick(row, 'Student Name', 'name', 'Name', 'student_name', 'StudentName', 'Full Name');
          const cgpa    = pick(row, 'CGPA', 'cgpa', 'Cgpa', 'GPA', 'gpa');
          const attend  = pick(row, 'Attendance', 'attendance', 'Attendance %', 'Attend', 'attend');
          const email   = pick(row, 'Email', 'email', 'Email ID', 'EmailID', 'email_id');
          const contact = pick(row, 'Contact Number', 'contact_number', 'Contact', 'Phone', 'Mobile', 'phone');
          const branch  = pick(row, 'Branch', 'branch', 'Dept', 'Department', 'branch_name').toUpperCase();

          console.log(`Row ${rowIndex} → name:"${name}" cgpa:"${cgpa}" attend:"${attend}" branch:"${branch}"`);

          /* Required field checks */
          if (!name) {
            errors.push({ row: rowIndex, error: `Row ${rowIndex}: "Student Name" column is missing or empty.` });
            return;
          }
          if (!cgpa) {
            errors.push({ row: rowIndex, error: `Row ${rowIndex}: "CGPA" column is missing or empty.` });
            return;
          }
          if (!attend) {
            errors.push({ row: rowIndex, error: `Row ${rowIndex}: "Attendance" column is missing or empty.` });
            return;
          }
          if (!branch) {
            errors.push({ row: rowIndex, error: `Row ${rowIndex}: "Branch" column is missing or empty.` });
            return;
          }

          /* Numeric validation */
          const cgpaNum   = parseFloat(cgpa);
          const attendNum = parseFloat(attend);

          if (isNaN(cgpaNum)) {
            errors.push({ row: rowIndex, error: `Row ${rowIndex}: CGPA "${cgpa}" is not a number.` });
            return;
          }
          if (isNaN(attendNum)) {
            errors.push({ row: rowIndex, error: `Row ${rowIndex}: Attendance "${attend}" is not a number.` });
            return;
          }
          if (cgpaNum < 0 || cgpaNum > 10) {
            errors.push({ row: rowIndex, error: `Row ${rowIndex}: CGPA ${cgpaNum} must be between 0 and 10.` });
            return;
          }
          if (attendNum < 0 || attendNum > 100) {
            errors.push({ row: rowIndex, error: `Row ${rowIndex}: Attendance ${attendNum} must be between 0 and 100.` });
            return;
          }

          /* Branch validation */
          const branchId = branchMap[branch];
          if (!branchId) {
            errors.push({ row: rowIndex, error: `Row ${rowIndex}: Branch "${branch}" not found. Valid branches: ${Object.keys(branchMap).join(', ')}` });
            return;
          }

          records.push({ serial, name, cgpa: cgpaNum, attendance: attendNum, email, contact, branchId });
          console.log(`Row ${rowIndex}: ✅ Accepted — ${name}`);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    console.log(`\n📊 Parsing done — Valid: ${records.length}, Rejected: ${errors.length}`);

    if (records.length === 0) {
      return res.status(400).json({
        error:  'No valid records found in CSV.',
        hint:   'Your CSV must have these exact column headers (first row): Serial Number, Student Name, CGPA, Attendance, Email, Contact Number, Branch',
        errors,
      });
    }

    /* Insert into DB */
    let inserted = 0;
    const institutionId = req.user.institution_id || 1;

    for (const r of records) {
      try {
        const riskId = calculateRiskLevelId(r.cgpa, r.attendance);
        await db.query(
          `INSERT INTO students
             (serial_number, name, cgpa, attendance, email, contact_number, branch_id, institution_id, risk_level_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [r.serial, r.name, r.cgpa, r.attendance, r.email, r.contact, r.branchId, institutionId, riskId]
        );
        inserted++;
        console.log(`💾 Inserted: ${r.name}`);
      } catch (e) {
        console.error(`❌ Insert failed for "${r.name}":`, e.message);
        errors.push({ error: `Failed to insert "${r.name}": ${e.message}` });
      }
    }

    res.json({
      message:    `Successfully uploaded ${inserted} student(s).`,
      inserted,
      errorCount: errors.length,
      errors,
    });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error('CSV upload error:', err);
    res.status(500).json({ error: 'Server error during upload.', detail: err.message });
  }
}

async function getStudents(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT s.*, r.level_name, b.name AS branch_name, b.name AS branch_code,
              (SELECT u.name FROM assignments a JOIN users u ON a.counsellor_id = u.id
               WHERE a.student_id = s.id AND a.status = 'active' LIMIT 1) AS counsellor_name
       FROM students s
       LEFT JOIN risk_levels r ON s.risk_level_id = r.id
       LEFT JOIN branches b    ON s.branch_id = b.id
       WHERE s.institution_id = $1
       ORDER BY s.risk_level_id ASC, s.name ASC`,
      [req.user.institution_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

async function getStudent(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT s.*, r.level_name, b.name AS branch_name, b.name AS branch_code
       FROM students s
       LEFT JOIN risk_levels r ON s.risk_level_id = r.id
       LEFT JOIN branches b    ON s.branch_id = b.id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Student not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

async function getUnassigned(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT s.*, r.level_name, b.name AS branch_name, b.name AS branch_code
       FROM students s
       LEFT JOIN risk_levels r ON s.risk_level_id = r.id
       LEFT JOIN branches b    ON s.branch_id = b.id
       WHERE s.institution_id = $1
         AND s.id NOT IN (SELECT student_id FROM assignments WHERE status = 'active')
       ORDER BY s.risk_level_id ASC, s.name ASC`,
      [req.user.institution_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

async function getAISuggestion(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT s.*, r.level_name FROM students s
       LEFT JOIN risk_levels r ON s.risk_level_id = r.id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Student not found.' });

    const student     = rows[0];
    const suggestions = generateAISuggestions(student);

    await db.query(
      'INSERT INTO ai_guidance_logs (student_id, suggestion) VALUES ($1, $2)',
      [student.id, suggestions.join('\n')]
    );

    res.json({ student: student.name, suggestions });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = { uploadCSV, getStudents, getStudent, getUnassigned, getAISuggestion };