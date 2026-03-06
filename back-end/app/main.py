import re

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import List, Optional

from .db import get_db, engine
from .init_db import ensure_db_initialized
from . import models, schemas


app = FastAPI(title="COMP680 Backend", version="1.0.0")


@app.on_event("startup")
def on_startup():
    ensure_db_initialized()


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------- Schema ----------------
_SAFE_IDENTIFIER = re.compile(r'^[a-zA-Z_][a-zA-Z0-9_]*$')


@app.get("/schema", response_model=schemas.DatabaseSchema)
def get_schema():
    """Return the names, columns, and foreign keys for every user table in the database."""
    tables: list[schemas.TableSchema] = []

    with engine.connect() as conn:
        # List all user-created tables (exclude SQLite internal tables)
        table_rows = conn.execute(
            text("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
        ).fetchall()

        for (table_name,) in table_rows:
            # Validate table name is a safe SQL identifier before interpolating it
            # into PRAGMA statements (PRAGMA does not support bound parameters).
            if not _SAFE_IDENTIFIER.match(table_name):
                continue

            # Column info via PRAGMA
            col_rows = conn.execute(text(f"PRAGMA table_info({table_name})")).fetchall()
            columns = [
                schemas.ColumnInfo(
                    cid=row[0],
                    name=row[1],
                    type=row[2],
                    not_null=bool(row[3]),
                    default_value=row[4],
                    primary_key=bool(row[5]),
                )
                for row in col_rows
            ]

            # Foreign key info via PRAGMA
            fk_rows = conn.execute(text(f"PRAGMA foreign_key_list({table_name})")).fetchall()
            foreign_keys = [
                schemas.ForeignKeyInfo(
                    id=row[0],
                    seq=row[1],
                    table=row[2],
                    from_column=row[3],
                    to_column=row[4],
                    on_update=row[5],
                    on_delete=row[6],
                )
                for row in fk_rows
            ]

            tables.append(
                schemas.TableSchema(
                    table_name=table_name,
                    columns=columns,
                    foreign_keys=foreign_keys,
                )
            )

    return schemas.DatabaseSchema(tables=tables)


# ---------------- Students ----------------
@app.post("/students", response_model=schemas.StudentOut)
def create_student(payload: schemas.StudentCreate, db: Session = Depends(get_db)):
    s = models.Student(name=payload.name, degree=payload.degree)
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


@app.get("/students/{student_id}", response_model=schemas.StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    s = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Student not found")
    return s


# ---------------- Courses ----------------
@app.post("/courses", response_model=schemas.CourseOut)
def create_course(payload: schemas.CourseCreate, db: Session = Depends(get_db)):
    c = models.Course(**payload.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@app.get("/courses", response_model=List[schemas.CourseOut])
def list_courses(
    course_code: Optional[str] = None,
    day: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(models.Course)
    if course_code:
        q = q.filter(models.Course.course_code == course_code)
    if day:
        q = q.filter(models.Course.day == day)
    return q.order_by(models.Course.course_id.asc()).all()


# ---------------- Free time ----------------
@app.post("/freetime", response_model=schemas.FreeTimeOut)
def add_freetime(payload: schemas.FreeTimeCreate, db: Session = Depends(get_db)):
    s = db.query(models.Student).filter(models.Student.student_id == payload.student_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Student not found")

    ft = models.StudentFreeTime(**payload.model_dump())
    db.add(ft)
    db.commit()
    db.refresh(ft)
    return ft


@app.get("/freetime", response_model=List[schemas.FreeTimeOut])
def list_freetime(student_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.StudentFreeTime)
        .filter(models.StudentFreeTime.student_id == student_id)
        .order_by(models.StudentFreeTime.day.asc(), models.StudentFreeTime.start_time.asc())
        .all()
    )


# ---------------- Audit ----------------
@app.post("/audit", response_model=schemas.AuditOut)
def add_audit(payload: schemas.AuditCreate, db: Session = Depends(get_db)):
    s = db.query(models.Student).filter(models.Student.student_id == payload.student_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Student not found")

    a = models.Audit(**payload.model_dump())
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


@app.get("/audit", response_model=List[schemas.AuditOut])
def list_audit(student_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.Audit)
        .filter(models.Audit.student_id == student_id)
        .order_by(models.Audit.id.asc())
        .all()
    )


# ---------------- Planner (simple) ----------------
def _time_to_minutes(t: str) -> int:
    hh, mm = t.split(":")
    return int(hh) * 60 + int(mm)


def _fits_in_freetime(course: models.Course, blocks: List[models.StudentFreeTime]) -> bool:
    c_start = _time_to_minutes(course.start_time)
    c_end = _time_to_minutes(course.end_time)
    for b in blocks:
        if b.day != course.day:
            continue
        b_start = _time_to_minutes(b.start_time)
        b_end = _time_to_minutes(b.end_time)
        if c_start >= b_start and c_end <= b_end:
            return True
    return False


@app.post("/plan", response_model=schemas.PlanResponse)
def plan(payload: schemas.PlanRequest, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.student_id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    freetime = (
        db.query(models.StudentFreeTime)
        .filter(models.StudentFreeTime.student_id == payload.student_id)
        .all()
    )

    if not freetime:
        return schemas.PlanResponse(
            student_id=payload.student_id,
            recommended=[],
            reasoning=["No free time blocks found for this student."]
        )

    # audit missing set
    missing_codes = set()
    if payload.prefer_missing_only:
        missing_codes = {
            a.course_code for a in db.query(models.Audit)
            .filter(models.Audit.student_id == payload.student_id, models.Audit.status == "missing")
            .all()
        }

    courses = db.query(models.Course).order_by(models.Course.course_id.asc()).all()

    recommended = []
    for c in courses:
        if payload.prefer_missing_only and missing_codes and c.course_code not in missing_codes:
            continue
        if _fits_in_freetime(c, freetime):
            recommended.append(
                schemas.PlanCourseItem(
                    course_id=c.course_id,
                    course_code=c.course_code,
                    course_name=c.course_name,
                    day=c.day,
                    start_time=c.start_time,
                    end_time=c.end_time,
                )
            )

    reasoning = [
        "Filtered courses by whether they fit inside the student's free-time blocks.",
    ]
    if payload.prefer_missing_only:
        reasoning.append("Prefer courses whose course_code appears in audit with status='missing'.")

    return schemas.PlanResponse(
        student_id=payload.student_id,
        recommended=recommended,
        reasoning=reasoning,
    )