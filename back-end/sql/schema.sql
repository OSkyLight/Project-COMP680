PRAGMA foreign_keys = ON;

CREATE TABLE student (
  student_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  degree TEXT NOT NULL
);

CREATE TABLE course (
  course_id INTEGER PRIMARY KEY,
  course_code TEXT NOT NULL,      
  course_name TEXT NOT NULL,
  day TEXT NOT NULL,              
  start_time TEXT NOT NULL,       
  end_time TEXT NOT NULL          
);

CREATE TABLE student_schedule_freetime (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  day TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  FOREIGN KEY(student_id) REFERENCES student(student_id) ON DELETE CASCADE
);

CREATE TABLE audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  status TEXT NOT NULL,          
  FOREIGN KEY(student_id) REFERENCES student(student_id) ON DELETE CASCADE
);