PRAGMA foreign_keys = ON;

-- Only create if not exists (DO NOT drop on every startup)
CREATE TABLE IF NOT EXISTS student (
  student_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  degree TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS course (
  course_id INTEGER PRIMARY KEY,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  units INTEGER NOT NULL,
  day TEXT NOT NULL,                 -- supports: "Mon", "Tue/Thu", "Mon/Wed", "ARR", "TBA"
  start_time TEXT NOT NULL,          -- "HH:MM"
  end_time TEXT NOT NULL,            -- "HH:MM"
  instructor TEXT,                   -- can be NULL (seed has NULL)
  mode TEXT NOT NULL                 -- seed uses "FullyOnline", "OnCampus", "SUP", ...
);

CREATE INDEX IF NOT EXISTS idx_course_code ON course(course_code);
CREATE INDEX IF NOT EXISTS idx_course_day_time ON course(day, start_time, end_time);

CREATE TABLE IF NOT EXISTS student_schedule_freetime (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  day TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  FOREIGN KEY(student_id) REFERENCES student(student_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_freetime_student ON student_schedule_freetime(student_id);

CREATE TABLE IF NOT EXISTS audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  degree TEXT NOT NULL,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  elective_code INTEGER,
  grade TEXT,                        -- <-- add this to match seed.sql
  FOREIGN KEY(student_id) REFERENCES student(student_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_audit_student ON audit(student_id);
CREATE INDEX IF NOT EXISTS idx_audit_course_code ON audit(course_code);

CREATE UNIQUE INDEX IF NOT EXISTS uq_audit_student_course
ON audit(student_id, course_code);

CREATE TABLE IF NOT EXISTS audit_rule (
  rule_id INTEGER PRIMARY KEY AUTOINCREMENT,
  degree TEXT NOT NULL,
  category TEXT NOT NULL,
  elective_code INTEGER,
  min_units INTEGER DEFAULT 0,
  max_units INTEGER,
  min_courses INTEGER,
  note TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_audit_rule_degree_cat_code
ON audit_rule(degree, category, COALESCE(elective_code, -1));