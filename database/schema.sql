-- ============================================================
-- EduSafeGuard v2 – PostgreSQL Schema
-- Run this in pgAdmin Query Tool connected to your
-- "edusafeguard" database. Do NOT include CREATE DATABASE here.
-- ============================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS ai_guidance_logs CASCADE;
DROP TABLE IF EXISTS followups        CASCADE;
DROP TABLE IF EXISTS assignments      CASCADE;
DROP TABLE IF EXISTS students         CASCADE;
DROP TABLE IF EXISTS users            CASCADE;
DROP TABLE IF EXISTS risk_levels      CASCADE;
DROP TABLE IF EXISTS branches         CASCADE;
DROP TABLE IF EXISTS institutions     CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS user_role        CASCADE;
DROP TYPE IF EXISTS assignment_status CASCADE;

-- ── Custom ENUM types ────────────────────────────────────────
CREATE TYPE user_role         AS ENUM ('admin', 'counsellor');
CREATE TYPE assignment_status AS ENUM ('active', 'closed');

-- ── institutions ─────────────────────────────────────────────
CREATE TABLE institutions (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── branches ─────────────────────────────────────────────────
CREATE TABLE branches (
  id   SERIAL PRIMARY KEY,
  code VARCHAR(20)  NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

INSERT INTO branches (code, name) VALUES
  ('CSE',   'Computer Science & Engineering'),
  ('ECE',   'Electronics & Communication'),
  ('MECH',  'Mechanical Engineering'),
  ('CIVIL', 'Civil Engineering'),
  ('IT',    'Information Technology'),
  ('AIDS',  'AI & Data Science');

-- ── risk_levels ──────────────────────────────────────────────
CREATE TABLE risk_levels (
  id         SERIAL PRIMARY KEY,
  level_name VARCHAR(50) NOT NULL,
  color_code VARCHAR(20)
);

INSERT INTO risk_levels (level_name, color_code) VALUES
  ('High Risk',     '#dc2626'),
  ('Moderate Risk', '#d97706'),
  ('Safe',          '#059669');

-- ── users (admin + counsellors) ──────────────────────────────
CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  email          VARCHAR(255) NOT NULL UNIQUE,
  password       VARCHAR(255) DEFAULT NULL,
  role           user_role    NOT NULL DEFAULT 'counsellor',
  branch_id      INTEGER      DEFAULT NULL,
  institution_id INTEGER      DEFAULT NULL,
  is_active      BOOLEAN      DEFAULT FALSE,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id)      REFERENCES branches(id)      ON DELETE SET NULL,
  FOREIGN KEY (institution_id) REFERENCES institutions(id)  ON DELETE SET NULL
);

-- ── students ─────────────────────────────────────────────────
CREATE TABLE students (
  id             SERIAL PRIMARY KEY,
  serial_number  VARCHAR(50),
  name           VARCHAR(255) NOT NULL,
  cgpa           NUMERIC(4,2) NOT NULL,
  attendance     NUMERIC(5,2) NOT NULL,
  email          VARCHAR(255),
  contact_number VARCHAR(20),
  branch_id      INTEGER,
  institution_id INTEGER      NOT NULL DEFAULT 1,
  risk_level_id  INTEGER      NOT NULL,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id)      REFERENCES branches(id)      ON DELETE SET NULL,
  FOREIGN KEY (institution_id) REFERENCES institutions(id)  ON DELETE CASCADE,
  FOREIGN KEY (risk_level_id)  REFERENCES risk_levels(id)
);

-- ── assignments ──────────────────────────────────────────────
CREATE TABLE assignments (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER           NOT NULL,
  counsellor_id INTEGER           NOT NULL,
  assigned_at   TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  status        assignment_status DEFAULT 'active',
  FOREIGN KEY (student_id)    REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (counsellor_id) REFERENCES users(id)    ON DELETE CASCADE
);

-- ── followups ────────────────────────────────────────────────
CREATE TABLE followups (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER   NOT NULL,
  counsellor_id INTEGER   NOT NULL,
  note          TEXT      NOT NULL,
  follow_date   DATE      NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id)    REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (counsellor_id) REFERENCES users(id)    ON DELETE CASCADE
);

-- ── ai_guidance_logs ─────────────────────────────────────────
CREATE TABLE ai_guidance_logs (
  id         SERIAL PRIMARY KEY,
  student_id INTEGER,
  suggestion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- ── Verify everything was created ────────────────────────────
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_name = t.table_name
   AND table_schema = 'public') AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type   = 'BASE TABLE'
ORDER BY table_name;