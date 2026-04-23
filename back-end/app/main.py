from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text, inspect
from typing import List, Optional, Any

from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .db import get_db, engine
from .init_db import ensure_db_initialized
from . import models, schemas

app = FastAPI(title="COMP680 Backend", version="1.0.0")

@app.on_event("startup")
def on_startup():
    ensure_db_initialized()

STATIC_DIR = Path(__file__).parent / "static"
FAVICON_PATH = STATIC_DIR / "favicon.ico"

# Only mount if the folder exists (prevents crashes if missing)
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    if not FAVICON_PATH.exists():
        raise HTTPException(status_code=404, detail="favicon not found")
    return FileResponse(FAVICON_PATH)

@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------- Debug (demo-only) ----------------
def _allowed_tables() -> list[str]:
    """Return table names that actually exist in the DB."""
    inspector = inspect(engine)
    return inspector.get_table_names()


@app.get("/debug/tables", response_model=List[str])
def debug_tables():
    """Return all table names in the SQLite database."""
    return _allowed_tables()


@app.get("/debug/table/{table_name}")
def debug_table(
    table_name: str,
    limit: int = 50,
    db: Session = Depends(get_db),
) -> List[dict[str, Any]]:
    """Return up to `limit` rows from `table_name`.
    Only tables that exist in the DB are allowed (prevents SQL injection)."""
    allowed = _allowed_tables()
    if table_name not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown table '{table_name}'. Allowed: {allowed}",
        )
    # Table name is validated against the inspector whitelist — safe to interpolate.
    rows = db.execute(text(f"SELECT * FROM {table_name} LIMIT :lim"), {"lim": limit})
    cols = list(rows.keys())
    return [dict(zip(cols, row)) for row in rows]


# ---------------- Students ----------------
@app.post("/students", response_model=schemas.StudentOut)
def create_student(payload: schemas.StudentCreate, db: Session = Depends(get_db)):
    s = models.Student(name=payload.name, degree=payload.degree)
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


@app.get("/students", response_model=List[schemas.StudentOut])
def list_students(db: Session = Depends(get_db)):
    return db.query(models.Student).order_by(models.Student.student_id.asc()).all()


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
                    units=c.units,
                    day=c.day,
                    start_time=c.start_time,
                    end_time=c.end_time,
                    instructor=c.instructor,
                    mode=c.mode,
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