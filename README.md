# EduSafeGuard v2 – Student Retention & Success Platform

## 🔄 Changes in v2

| Feature | v1 | v2 |
|---------|----|----|
| Counsellor activation | Token-based email | Email + set-password (no tokens) |
| Login | Separate pages | Single page with role selector |
| Admin registration | Hardcoded | Self-registration with institution name |
| AI Suggestions | ❌ | ✅ Rule-based on CGPA + Attendance |
| Student Details page | ❌ | ✅ Full details + follow-up + AI |
| Follow-up schema | assignment_id | student_id + counsellor_id + date |
| Architecture | Routes only | Routes + Controllers + Services |

---

## 📁 Project Structure

```
edusafeguard/
├── database/
│   └── schema.sql                  ← Run this first
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── .env.example
│   ├── middleware/
│   │   └── auth.js                 ← JWT middleware
│   ├── services/
│   │   └── riskService.js          ← Risk calc + AI suggestions
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── assignmentController.js
│   │   ├── followupController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── assignments.js
│   │   ├── followups.js
│   │   └── dashboard.js
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   ├── index.css
    │   ├── services/api.js
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── StudentTable.jsx
    │   │   ├── FollowupForm.jsx
    │   │   └── RiskBadge.jsx
    │   └── pages/
    │       ├── Login.jsx            ← Role selector (Admin/Counsellor)
    │       ├── Register.jsx         ← Admin self-registration
    │       ├── ActivateAccount.jsx  ← Email + password only
    │       ├── AdminDashboard.jsx   ← Charts + stats
    │       ├── UploadStudents.jsx
    │       ├── AssignStudents.jsx
    │       ├── ManageCounsellors.jsx
    │       ├── StudentDetails.jsx   ← Details + AI suggestions
    │       └── CounsellorDashboard.jsx
    └── package.json
```

---

## ⚙️ Setup

### Step 1 – Database

```sql
-- In MySQL Workbench or terminal:
SOURCE /path/to/edusafeguard/database/schema.sql;
```

### Step 2 – Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set DB_PASSWORD to your MySQL password
npm install
npm start
# Runs on http://localhost:5000
```

### Step 3 – Frontend

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## 🔐 Authentication Flow

### Admin
1. Go to `/register` → enter institution name + email + password
2. Login at `/login` with role = **Admin**

### Counsellor
1. Admin adds counsellor (name, email, branch) from Counsellors page
2. Counsellor goes to `/activate` → enters **email** + **new password**
3. Counsellor can now login at `/login` with role = **Counsellor**

> ℹ️ No tokens, no email sending — purely email-based activation.

---

## 📄 CSV Format

```csv
Serial Number,Student Name,CGPA,Attendance,Email,Contact Number,Branch
101,Rahul Kumar,6.8,72,rahul@gmail.com,9876543210,CSE
102,Anjali Reddy,4.2,55,anjali@gmail.com,9876543211,ECE
103,Kiran Patel,8.5,88,kiran@gmail.com,9876543212,MECH
```

Valid branches: `CSE`, `ECE`, `MECH`, `CIVIL`, `IT`, `AIDS`

---

## 📊 Risk Classification Logic

| Rule | Risk Level |
|------|-----------|
| CGPA < 5 **AND** Attendance < 60% | 🔴 High Risk |
| CGPA 5–7 **OR** Attendance 60–75% | 🟡 Moderate Risk |
| CGPA > 7 **AND** Attendance > 75% | 🟢 Safe |

---

## 🤖 AI Suggestions (Rule-based)

Click "AI Suggestions" on any student details page. Suggestions are generated based on:
- CGPA range → study plan / peer tutoring / research encouragement
- Attendance range → family contact / attendance tracking / motivational counselling
- Risk level → urgency and action priority

No external AI API required — all logic in `backend/services/riskService.js`.

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | None | Admin self-registration |
| POST | /api/auth/login | None | Login (role required in body) |
| POST | /api/auth/activate | None | Counsellor activation (email + password) |
| POST | /api/auth/counsellors | Admin | Add counsellor |
| GET  | /api/auth/counsellors | Any | List counsellors |
| GET  | /api/auth/branches | None | Get branch list |
| POST | /api/students/upload | Admin | Upload CSV |
| GET  | /api/students | Any | All students |
| GET  | /api/students/unassigned | Admin | Unassigned students |
| GET  | /api/students/:id | Any | Single student |
| GET  | /api/students/:id/ai-suggestion | Any | AI suggestions |
| POST | /api/assignments | Admin | Assign student |
| POST | /api/assignments/bulk | Admin | Bulk assign |
| GET  | /api/assignments/mine | Counsellor | My assigned students |
| GET  | /api/assignments/all | Admin | All assignments |
| POST | /api/followups | Counsellor | Add follow-up note |
| GET  | /api/followups/mine | Counsellor | My follow-ups |
| GET  | /api/followups/student/:id | Any | Student's follow-ups |
| GET  | /api/dashboard/admin | Admin | Admin stats & charts data |
| GET  | /api/dashboard/counsellor | Counsellor | Counsellor stats |
