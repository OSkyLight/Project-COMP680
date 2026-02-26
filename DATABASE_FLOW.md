# Database and API Workflow

## 1. System Overview

This backend system:

- Stores student data
- Stores course catalog
- Stores semester offerings
- Stores student availability schedule
- Stores degree audit requirements
- Generates course schedule recommendations
- Returns JSON responses via REST API

Database: SQLite  
Backend Framework: FastAPI  
ORM: SQLAlchemy  

---

## 2. Main Database Tables

### A. Course Catalog & Offerings

1. courses
   - course_id (PK)
   - title
   - credits
   - prereq_expr

2. offerings
   - offering_id (PK)
   - term
   - course_id (FK)
   - section
   - days
   - start_time
   - end_time
   - capacity
   - enrolled

---

### B. Student Data

1. students
   - student_id (PK)
   - full_name
   - degree_id

2. student_schedule_blocks
   - block_id
   - student_id (FK)
   - term
   - day_of_week
   - start_time
   - end_time
   - block_type

3. student_courses
   - id
   - student_id
   - course_id
   - status (completed / in_progress / planned)
   - grade

---

### C. Degree Audit

1. degree_requirements
   - req_id
   - degree_id
   - req_type (core / elective_group / credits)
   - rule_expr
   - credits_needed

---

## 3. Data Flow: UI → API → Database

### Step 1: Setup Data

Admin or UI sends requests:

- POST /students
- POST /courses
- POST /offerings
- POST /degree-requirements
- POST /schedule-blocks

Data is stored in SQLite database.

---

### Step 2: Query Data

UI retrieves data using:

- GET /offerings?term=...
- GET /schedule-blocks?student_id=...&term=...
- GET /degree-requirements?degree_id=...

---

## 4. Planner Flow (/plan Endpoint)

### Input

POST /plan

Example:
{
  "student_id": 1,
  "term": "2026SP",
  "target_credits": 15
}

---

### Planner Logic Pipeline

1. Load student info
2. Load degree requirements
3. Load completed courses
4. Determine remaining required courses
5. Load available offerings
6. Filter:
   - No time conflicts
   - Prerequisites satisfied
   - Seats available
7. Select best combination to meet credit target
8. Return JSON response

---

### Output Example

{
  "student_id": 1,
  "term": "2026SP",
  "target_credits": 15,
  "total_credits": 12,
  "selected_courses": [...],
  "conflicts": [],
  "reasoning": [
    "Core requirement prioritized",
    "No schedule conflicts detected"
  ]
}