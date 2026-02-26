PRAGMA foreign_keys = ON;

-- Students (optional nhưng tiện)
CREATE TABLE IF NOT EXISTS students (
  student_id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT,
  degree_id TEXT NOT NULL
);

-- Courses catalog
CREATE TABLE IF NOT EXISTS courses (
  course_id TEXT PRIMARY KEY,     -- e.g., "COMP680"
  title TEXT NOT NULL,
  credits INTEGER NOT NULL,
  prereq_expr TEXT                -- free-form logic expression (optional)
);

-- Offerings per term (classes available in a semester)
CREATE TABLE IF NOT EXISTS offerings (
  offering_id INTEGER PRIMARY KEY AUTOINCREMENT,
  term TEXT NOT NULL,             -- e.g., "2026SP"
  course_id TEXT NOT NULL,
  section TEXT NOT NULL,          -- "001", "002"
  days TEXT NOT NULL,             -- "MWF", "TR"
  start_time TEXT NOT NULL,       -- "10:00"
  end_time TEXT NOT NULL,         -- "11:15"
  location TEXT,
  instructor TEXT,
  capacity INTEGER,
  enrolled INTEGER DEFAULT 0,
  FOREIGN KEY(course_id) REFERENCES courses(course_id)
);

CREATE INDEX IF NOT EXISTS idx_offerings_term ON offerings(term);
CREATE INDEX IF NOT EXISTS idx_offerings_course ON offerings(course_id);

-- Student time blocks (busy schedule)
CREATE TABLE IF NOT EXISTS student_schedule_blocks (
  block_id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  term TEXT NOT NULL,
  day_of_week INTEGER NOT NULL,   -- 0=Mon ... 6=Sun (or your choice, just be consistent)
  start_time TEXT NOT NULL,       -- "09:00"
  end_time TEXT NOT NULL,         -- "12:00"
  block_type TEXT,                -- "work", "club", "other_class"
  note TEXT,
  FOREIGN KEY(student_id) REFERENCES students(student_id)
);

CREATE INDEX IF NOT EXISTS idx_blocks_student_term ON student_schedule_blocks(student_id, term);

-- Student course history (completed/in_progress/planned)
CREATE TABLE IF NOT EXISTS student_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id TEXT NOT NULL,
  term TEXT,
  status TEXT NOT NULL,           -- "completed" | "in_progress" | "planned"
  grade TEXT,
  FOREIGN KEY(student_id) REFERENCES students(student_id),
  FOREIGN KEY(course_id) REFERENCES courses(course_id)
);

CREATE INDEX IF NOT EXISTS idx_student_courses_student ON student_courses(student_id);

-- Degree audit requirements
CREATE TABLE IF NOT EXISTS degree_requirements (
  req_id INTEGER PRIMARY KEY AUTOINCREMENT,
  degree_id TEXT NOT NULL,        -- "BSCS"
  req_type TEXT NOT NULL,         -- "core" | "elective_group" | "credits"
  rule_expr TEXT NOT NULL,        -- e.g. "TAKE(COMP680)" or "CHOOSE(2,[COMP610,COMP620])"
  credits_needed INTEGER          -- optional
);

CREATE INDEX IF NOT EXISTS idx_degree_req_degree ON degree_requirements(degree_id);