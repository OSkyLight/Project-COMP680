PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO student (student_id, name, degree)
VALUES (1, 'Hao Vong', 'Master of Computer Science');

UPDATE student
SET name='Hao Vong', degree='Master of Computer Science'
WHERE student_id=1;

DELETE FROM audit
WHERE student_id = 1;

INSERT INTO audit (student_id, degree, course_code, course_name, category, status, elective_code, grade)
VALUES
  (1, 'Master of Computer Science', 'COMP 541', 'DATA MINING',         'Electives',            'completed', NULL, 'A'),
  (1, 'Master of Computer Science', 'COMP 542', 'MACHINE LEARNING',    'Electives',            'completed', NULL, 'A'),

  -- IP => missing (NOT completed)
  (1, 'Master of Computer Science', 'COMP 529',  'ADV NETWORK TOP',    'Software Engineering', 'missing',   NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 529L', 'ADV NETWORK LAB',    'Software Engineering', 'missing',   NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 640',  'DATABASE SYST DSGN', 'Electives',            'missing',   NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 680',  'ADV TOPICS SWE',     'Foundations',          'missing',   NULL, NULL);

INSERT INTO audit (student_id, degree, course_code, course_name, category, status, elective_code, grade)
VALUES
  (1, 'Master of Computer Science', 'COMP 610', 'TBD', 'Systems',              'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 620', 'TBD', 'Computer Networking',  'missing', NULL, NULL);

INSERT INTO audit (student_id, degree, course_code, course_name, category, status, elective_code, grade)
VALUES
  (1, 'Master of Computer Science', 'COMP 696C', 'TBD', 'Thesis/Project', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 698C', 'TBD', 'Thesis/Project', 'missing', NULL, NULL);

INSERT INTO audit (student_id, degree, course_code, course_name, category, status, elective_code, grade)
VALUES
  (1, 'Master of Computer Science', 'COMP 522',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 528',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 528L', 'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 535',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 535L', 'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 539',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 560',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 565',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 569',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 581',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 582',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 583',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 584',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 585',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 586',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 587',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 588',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 589',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 595',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 598',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 521',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 521L', 'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 545',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 639',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 641',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 642',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 643',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 644',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 646',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 615',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 630',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 667',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 684',  'TBD', 'Electives', 'missing', NULL, NULL);

INSERT INTO audit (student_id, degree, course_code, course_name, category, status, elective_code, grade)
VALUES
  (1, 'Master of Computer Science', 'COMP 410',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 424',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 426',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 429',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 430',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 440',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 442',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 465',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 465L', 'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 467',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 469',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 484',  'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 484L', 'TBD', 'Electives', 'missing', NULL, NULL),
  (1, 'Master of Computer Science', 'COMP 485',  'TBD', 'Electives', 'missing', NULL, NULL);

UPDATE audit
SET elective_code =
  CASE
    WHEN CAST(SUBSTR(course_code, INSTR(course_code, ' ') + 1, 1) AS INTEGER) = 4 THEN 4
    WHEN CAST(SUBSTR(course_code, INSTR(course_code, ' ') + 1, 1) AS INTEGER) = 5 THEN 5
    WHEN CAST(SUBSTR(course_code, INSTR(course_code, ' ') + 1, 1) AS INTEGER) = 6 THEN 6
    ELSE elective_code
  END
WHERE student_id = 1
  AND category = 'Electives';

INSERT OR IGNORE INTO audit_rule
(degree, category, elective_code, min_units, max_units, min_courses, note)
VALUES
('Master of Computer Science', 'Electives', NULL, 12, NULL, NULL,
 'Need at least 12 elective units total');

INSERT OR IGNORE INTO audit_rule
(degree, category, elective_code, min_units, max_units, min_courses, note)
VALUES
('Master of Computer Science', 'Electives', 4, 0, 6, NULL,
 'Code 4 (400-level) counts at most 6 units toward the 12 elective units');

INSERT OR IGNORE INTO audit_rule
(degree, category, elective_code, min_units, max_units, min_courses, note)
VALUES
('Master of Computer Science', 'Foundation', NULL, 0, NULL, 1,
 'Foundation: choose 1 course');

INSERT OR IGNORE INTO audit_rule
(degree, category, elective_code, min_units, max_units, min_courses, note)
VALUES
('Master of Computer Science', 'Thesis/Project', NULL, 0, NULL, NULL,
 'Update thesis/project requirements later');

BEGIN TRANSACTION;
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15769, 'COMP 424', 'COMP SYSTM SECRTY', 3, 'Tue', '17:00', '19:45', 'Isayan,Sevada', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15770, 'COMP 485', 'HUM-COMP INTERACT', 3, 'TBA', '00:00', '00:00', NULL, 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15772, 'COMP 610', 'DATA STRCT+ALGOR', 3, 'Mon/Wed', '14:30', '15:45', 'Noga,John J', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15778, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15779, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15827, 'COMP 522', 'EMBEDDED APPS', 3, 'Wed', '17:00', '19:45', 'Zamanifar,Kamran', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15847, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15848, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15853, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15854, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15855, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15856, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15857, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15885, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15887, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', 'D', 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15890, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15891, 'COMP 484', 'WEB ENGR I', 2, 'Mon/Wed', '16:30', '17:20', 'Marin,Oscar R', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15892, 'COMP 494A', 'ACADEMIC INTERN', 1, 'ARR', '00:00', '00:00', 'B', 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15894, 'COMP 565', 'ADV COMP GRAPHICS', 3, 'Wed', '19:00', '21:45', 'Karamian,Vahe', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (15916, 'COMP 484L', 'WEB ENGR I LAB', 1, 'Mon/Wed', '17:30', '18:45', 'Marin,Oscar R', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16043, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16044, 'COMP 584', 'ADV WEB ENGR', 3, 'Fri', '19:00', '21:45', 'Marin,Oscar R', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16065, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16066, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16067, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', 'T', 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16068, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16069, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16070, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16080, 'COMP 585', 'GRAPH USRS INTRFC', 3, 'Tue', '19:00', '21:45', 'Karamian,Vahe', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16107, 'COMP 589', 'SOFTWARE METRICS', 3, 'Thu', '19:00', '21:45', 'Mushkatblat,Yevgeniya', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16124, 'COMP 440', 'DATABASE DESIGN', 3, 'Mon/Wed', '08:30', '09:45', 'Ebrahimi,Mahdi', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16159, 'COMP 541', 'DATA MINING', 3, 'Mon', '14:30', '17:15', 'Qi,Ruobin', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16214, 'COMP 440', 'DATABASE DESIGN', 3, 'Tue/Thu', '13:00', '14:15', 'Nikjeh,Esmaail M', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16215, 'COMP 484', 'WEB ENGR I', 2, 'Tue/Thu', '16:30', '17:20', 'Marin,Oscar R', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16216, 'COMP 484L', 'WEB ENGR I LAB', 1, 'Tue/Thu', '17:30', '18:45', 'Marin,Oscar R', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16247, 'COMP 485', 'HUM-COMP INTERACT', 3, 'Tue/Thu', '11:30', '12:45', 'Vasikarla,Shantaram', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16277, 'COMP 424', 'COMP SYSTM SECRTY', 3, 'Sat', '10:00', '12:45', 'Noga,John J', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16305, 'COMP 484L', 'WEB ENGR I LAB', 1, 'Tue/Thu', '20:30', '21:45', 'Marin,Oscar R', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16306, 'COMP 485', 'HUM-COMP INTERACT', 3, 'Tue/Thu', '13:00', '14:15', 'Karamian,Armineh', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16307, 'COMP 529', 'ADV NETWORK TOP', 2, 'Tue/Thu', '19:00', '19:50', 'Elder,Nelson K', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16311, 'COMP 482', 'ALGORITHM DESIGN', 3, 'Tue/Thu', '08:30', '09:45', 'Hoque,Misbah Ul', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16312, 'COMP 482', 'ALGORITHM DESIGN', 3, 'Tue/Thu', '11:30', '12:45', 'Hoque,Misbah Ul', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16317, 'COMP 484', 'WEB ENGR I', 2, 'Tue/Thu', '19:30', '20:20', 'Marin,Oscar R', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16318, 'COMP 485', 'HUM-COMP INTERACT', 3, 'Thu', '16:00', '18:45', 'Liu,Li', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16364, 'COMP 430', 'LANG DSGN+COMPLRS', 3, 'Mon/Wed', '14:30', '15:45', 'Dewey,Kyle T', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16385, 'COMP 482', 'ALGORITHM DESIGN', 3, 'Tue/Thu', '10:00', '11:15', 'Lord,Mansoureh', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16424, 'COMP 542', 'MACHINE LEARNING', 3, 'Tue/Thu', '10:00', '11:15', 'Hasan,Rashida', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16437, 'COMP 620', 'COMP SYST ARCHITE', 3, 'Tue', '17:00', '19:45', 'Asadinia,Marjan', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16438, 'COMP 529L', 'ADV NETWORK LAB', 1, 'Tue/Thu', '20:00', '21:15', 'Elder,Nelson K', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16442, 'COMP 542', 'MACHINE LEARNING', 3, 'Mon', '16:00', '18:45', 'Huang,Enno', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16445, 'COMP 440', 'DATABASE DESIGN', 3, 'Tue', '19:00', '21:45', 'Mushkatblat,Yevgeniya', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16454, 'COMP 583', 'SW ENGR MGMT', 3, 'Wed', '19:00', '21:45', 'Sepetjyan,Harutyun', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16457, 'COMP 541', 'DATA MINING', 3, 'Wed', '14:30', '17:15', 'Qi,Ruobin', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16468, 'COMP 565', 'ADV COMP GRAPHICS', 3, 'Mon', '19:00', '21:45', 'Karamian,Vahe', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16474, 'COMP 485', 'HUM-COMP INTERACT', 3, 'Mon/Wed', '11:30', '12:45', 'Vasikarla,Shantaram', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16476, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16499, 'COMP 482', 'ALGORITHM DESIGN', 3, 'Mon/Wed', '16:00', '17:15', 'Noga,John J', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16500, 'COMP 482', 'ALGORITHM DESIGN', 3, 'Tue/Thu', '08:30', '09:45', 'Lord,Mansoureh', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16508, 'COMP 529', 'ADV NETWORK TOP', 2, 'Mon/Wed', '19:00', '19:50', 'Elder,Nelson K', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16509, 'COMP 529L', 'ADV NETWORK LAB', 1, 'Mon/Wed', '20:00', '21:15', 'Elder,Nelson K', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16510, 'COMP 522', 'EMBEDDED APPS', 3, 'Tue/Thu', '10:00', '11:15', 'Wiegley,Jeffrey', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16511, 'COMP 541', 'DATA MINING', 3, 'Wed', '19:00', '21:45', 'Wang,Taehyung', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16512, 'COMP 542', 'MACHINE LEARNING', 3, 'Tue/Thu', '11:30', '12:45', 'Hasan,Rashida', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16513, 'COMP 429', 'COMP NETWRK SFTWR', 3, 'Wed', '16:00', '18:45', 'Yu,Senhua', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16515, 'COMP 680', 'ADV TOPICS SWE', 3, 'Mon', '19:00', '21:45', 'Boctor,Maged N', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16516, 'COMP 467', 'MULTIMEDIA SYSTEM', 3, 'Wed', '19:00', '21:45', 'CHAJA,KEVIN', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16519, 'COMP 680', 'ADV TOPICS SWE', 3, 'Fri', '14:30', '17:15', 'Mushkatblat,Yevgeniya', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16520, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16521, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16522, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16523, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', 'T', 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16524, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16525, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16526, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16527, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16528, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16529, 'COMP 698C', 'THESIS', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16533, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16534, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16535, 'COMP 696C', 'DIR GRAD RESEARCH', 3, 'ARR', '00:00', '00:00', NULL, 'SUP');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16576, 'COMP 491', 'SR PROJECT II', 2, 'Mon/Wed', '10:00', '10:50', 'Jiang,Xunfei', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16577, 'COMP 491', 'SR PROJECT II', 2, 'Tue/Thu', '14:30', '15:20', 'Amini,Afshin', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16578, 'COMP 491', 'SR PROJECT II', 2, 'Mon/Wed', '10:00', '10:50', 'Modarresi,A', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16579, 'COMP 491', 'SR PROJECT II', 2, 'Tue/Thu', '10:00', '10:50', 'Klotzman,Va', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16580, 'COMP 491', 'SR PROJECT II', 2, 'Mon/Wed', '13:00', '13:50', 'Modarresi,A', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16581, 'COMP 491', 'SR PROJECT II', 2, 'Tue/Thu', '19:00', '19:50', 'Klotzman,Va', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16582, 'COMP 491', 'SR PROJECT II', 2, 'Mon/Wed', '17:00', '17:50', 'Boroumandi', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16584, 'COMP 491', 'SR PROJECT II', 2, 'Mon/Wed', '16:00', '16:50', 'Verma,Abhis JD3508 We 07:00pm-07:50pm', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16585, 'COMP 491L', 'SR PROJECT II LAB', 1, 'Mon/Wed', '11:00', '12:15', 'Jiang,Xunfei', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16586, 'COMP 491L', 'SR PROJECT II LAB', 1, 'Tue/Thu', '15:30', '16:45', 'Amini,Afshin', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16587, 'COMP 491L', 'SR PROJECT II LAB', 1, 'Mon/Wed', '11:00', '12:15', 'Modarresi,A', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16588, 'COMP 491L', 'SR PROJECT II LAB', 1, 'Tue/Thu', '11:00', '12:15', 'Klotzman,Va', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16589, 'COMP 491L', 'SR PROJECT II LAB', 1, 'Mon/Wed', '14:00', '15:15', 'Modarresi,A', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16590, 'COMP 491L', 'SR PROJECT II LAB', 1, 'Tue/Thu', '20:00', '21:15', 'Klotzman,Va', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16591, 'COMP 491L', 'SR PROJECT II LAB', 1, 'Mon/Wed', '18:00', '19:15', 'Boroumandi', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16593, 'COMP 491L', 'SR PROJECT II LAB', 1, 'Mon/Wed', '17:00', '18:15', 'Verma,Abhis JD3508 We 08:00pm-09:15pm', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16645, 'COMP 569', 'ARTIFICIAL INTELL', 3, 'Mon', '19:00', '21:45', 'Wang,Taehyung', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16646, 'COMP 502', 'PROG DATA SCI ANALYT', 3, 'Mon', '10:00', '12:45', 'Qi,Ruobin', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16652, 'COMP 440', 'DATABASE DESIGN', 3, 'Wed', '19:00', '21:45', 'Mushkatblat,Yevgeniya', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16653, 'COMP 440', 'DATABASE DESIGN', 3, 'Tue/Thu', '14:30', '15:45', 'Nikjeh,Esmaail M', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16658, 'COMP 491', 'SR PROJECT II', 2, 'Mon/Wed', '18:00', '18:50', 'El-Issa,Husa', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16659, 'COMP 491L', 'SR PROJECT II LAB', 1, 'Mon/Wed', '19:00', '20:15', 'El-Issa,Husa', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16667, 'COMP 491', 'SR PROJECT II', 2, 'Tue/Thu', '19:00', '19:50', 'Mandrosov,I', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16668, 'COMP 491L', 'SR PROJECT II LAB', 1, 'Tue/Thu', '20:00', '21:15', 'Mandrosov,I', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16687, 'COMP 485', 'HUM-COMP INTERACT', 3, 'Fri', '13:00', '15:45', 'Karamian,Armineh', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (16690, 'COMP 440', 'DATABASE DESIGN', 3, 'Sat', '10:00', '12:45', 'Rafique,Zahid', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (20423, 'COMP 542', 'MACHINE LEARNING', 3, 'Wed', '16:00', '18:45', 'Huang,Enno', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (20425, 'COMP 545', 'CLOUD COMPUTING', 3, 'Mon/Wed', '16:00', '17:15', 'Modarresi,Alex', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (20426, 'COMP 640', 'DATABASE SYST DSGN', 3, 'Wed', '19:00', '21:45', 'Gonzalez,Adrian', 'FullyOnline');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (20427, 'COMP 641', 'FUND DATA SCIENCE', 3, 'Fri', '11:00', '13:45', 'Hoque,Misbah Ul', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (20428, 'COMP 643', 'DEEP LEARNING', 3, 'Mon/Wed', '14:30', '15:45', 'Huang,Enno', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (20779, 'COMP 583', 'SW ENGR MGMT', 3, 'Tue', '14:30', '17:15', 'Karamian,Vahe', 'OnCampus');
INSERT OR REPLACE INTO course (course_id, course_code, course_name, units, day, start_time, end_time, instructor, mode) VALUES (20780, 'COMP 586', 'OO SOFTWARE DEV', 3, 'Mon/Wed', '16:00', '17:15', 'Karamian,Vahe', 'OnCampus');
COMMIT;

INSERT OR IGNORE INTO audit_rule
(degree, category, elective_code, min_units, max_units, min_courses, note)
VALUES
('Master of Computer Science', 'Electives', NULL, 12, NULL, NULL,
 'Need at least 12 elective units total'),

('Master of Computer Science', 'Electives', 4, 0, 6, NULL,
 '400-level (code 4) counts at most 6 units toward 12'),

('Master of Computer Science', 'Foundation', NULL, 0, NULL, 1,
 'Choose 1 foundation course');


DELETE FROM student_schedule_freetime
WHERE student_id = 1;

INSERT INTO student_schedule_freetime (student_id, day, start_time, end_time)
VALUES (1, 'Mon', '17:00', '23:59');

INSERT INTO student_schedule_freetime (student_id, day, start_time, end_time)
VALUES (1, 'Tue', '17:00', '23:59');

INSERT INTO student_schedule_freetime (student_id, day, start_time, end_time)
VALUES (1, 'Wed', '17:00', '23:59');

INSERT INTO student_schedule_freetime (student_id, day, start_time, end_time)
VALUES (1, 'Thu', '17:00', '23:59');

INSERT INTO student_schedule_freetime (student_id, day, start_time, end_time)
VALUES (1, 'Fri', '00:00', '23:59');

INSERT INTO student_schedule_freetime (student_id, day, start_time, end_time)
VALUES (1, 'Sat', '00:00', '23:59');
