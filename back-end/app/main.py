import os
import tempfile

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import text, inspect
from typing import List, Optional, Any

from pathlib import Path
from app.pdf_extractor import extract_student_progress_from_pdf
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .db import get_db, engine
from .init_db import ensure_db_initialized
from . import models, schemas

from fastapi import Query
from .planner_v1 import (
    build_freetime_map,
    course_fits_freetime,
    build_options_strict_pairing,
    option_conflicts,
)

app = FastAPI(title="COMP680 Backend", version="1.0.0")

@app.on_event("startup")
def on_startup():
    ensure_db_initialized()

STATIC_DIR = Path(__file__).parent / "static"
FAVICON_PATH = STATIC_DIR / "favicon.ico"


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
@app.get("/plan/options")
def plan_options_demo(
    student_id: int,
    target_units: int = Query(..., ge=1, le=30),
    max_options: int = Query(3, ge=1, le=10),
    db: Session = Depends(get_db),
):
    freetimes = (
        db.query(models.StudentFreeTime)
        .filter(models.StudentFreeTime.student_id == student_id)
        .all()
    )
    freetime_map = build_freetime_map(freetimes)
    missing_codes = [
        a.course_code
        for a in db.query(models.Audit)
        .filter(models.Audit.student_id == student_id, models.Audit.status == "missing")
        .all()
    ]

    if not missing_codes:
        return {
            "student_id": student_id,
            "target_units": target_units,
            "options": [],
            "note": "No missing courses found in audit for this student.",
        }
        
    offerings = db.query(models.Course).filter(models.Course.course_code.in_(missing_codes)).all()

    offerings = [c for c in offerings if course_fits_freetime(c, freetime_map)]

    if not offerings:
        return {
            "student_id": student_id,
            "target_units": target_units,
            "options": [],
            "note": "No course offerings fit the student's free time.",
        }

    options = build_options_strict_pairing(offerings, gap_min=10, gap_max=20)

    if not options:
        return {
            "student_id": student_id,
            "target_units": target_units,
            "options": [],
            "note": "No schedulable options after strict lecture-lab pairing rules.",
        }
    schedules = []
    for skip in range(0, min(max_options, len(options))):
        chosen = []
        units = 0

        for opt in options[skip:]:
            if units + opt["units"] > target_units:
                continue
            if option_conflicts(opt, chosen):
                continue
            chosen.append(opt)
            units += opt["units"]
            if units == target_units:
                break

        if chosen:
            schedules.append(chosen)

        if len(schedules) >= max_options:
            break

    # 7) format JSON output
    out = []
    for idx, sched in enumerate(schedules, start=1):
        total = sum(opt["units"] for opt in sched)

        items = []
        for opt in sched:
            items.append({
                "units": opt["units"],
                "courses": [
                    {
                        "course_id": c.course_id,
                        "course_code": c.course_code,
                        "course_name": c.course_name,
                        "units": c.units,
                        "day": c.day,
                        "start_time": c.start_time,
                        "end_time": c.end_time,
                        "instructor": getattr(c, "instructor", None),
                        # if your column is class_type instead of mode, replace below line:
                        "mode": getattr(c, "mode", getattr(c, "class_type", None)),
                    }
                    for c in opt["courses"]
                ],
            })

        out.append({
            "option_id": idx,
            "total_units": total,
            "course_options": items,
        })

    return {
        "student_id": student_id,
        "target_units": target_units,
        "options": out,
    }

@app.get("/test-pdf-extract")
def test_pdf_extract():
    pdf_path = Path(__file__).resolve().parent.parent / "sample_pdfs" / "student_progress_sample.pdf"
    data = extract_student_progress_from_pdf(str(pdf_path))
    return data


@app.post("/upload-progress-report")
async def upload_progress_report(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files are accepted."}

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp_path = tmp.name
            tmp.write(await file.read())

        extracted = extract_student_progress_from_pdf(tmp_path)
        return {"filename": file.filename, "extracted_data": extracted}
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


def _should_exclude_course(c: models.Course, excluded_codes: set) -> bool:
    if str(c.course_code) in excluded_codes:
        return True
    code = str(c.course_code).upper()
    name = str(c.course_name).upper()
    if "696" in code or "698" in code:
        return True
    if "THESIS" in name or "RESEARCH" in name:
        return True
    if (c.day or "").upper() in ("ARR", "TBA"):
        return True
    if (c.start_time or "") == "00:00" or (c.end_time or "") == "00:00":
        return True
    if (c.mode or "").upper() == "SUP":
        return True
    return False


def _course_score(c: models.Course) -> tuple:
    is_comp = 0 if str(c.course_code).upper().startswith("COMP") else 1
    digits = "".join(ch for ch in str(c.course_code) if ch.isdigit())
    number = int(digits) if digits else 9999
    in_target_range = 0 if 400 <= number <= 599 else 1
    return (is_comp, in_target_range, number)


@app.post("/recommend-from-pdf")
async def recommend_from_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files are accepted."}

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp_path = tmp.name
            tmp.write(await file.read())

        extracted = extract_student_progress_from_pdf(tmp_path)
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

    completed = {str(c["course_code"]) for c in extracted.get("completed_courses", [])}
    in_progress = {str(c["course_code"]) for c in extracted.get("in_progress_courses", [])}
    excluded = completed | in_progress

    courses = db.query(models.Course).order_by(models.Course.course_id.asc()).all()
    filtered = [c for c in courses if not _should_exclude_course(c, excluded)]
    filtered.sort(key=_course_score)

    recommended = [
        {
            "course_id": c.course_id,
            "course_code": c.course_code,
            "course_name": c.course_name,
            "units": c.units,
            "day": c.day,
            "start_time": c.start_time,
            "end_time": c.end_time,
            "instructor": c.instructor,
            "mode": c.mode,
        }
        for c in filtered[:15]
    ]

    return {
        "filename": file.filename,
        "student_name": extracted.get("student_name", ""),
        "student_id": extracted.get("student_id", ""),
        "degree_program": extracted.get("degree_program", ""),
        "excluded_course_codes": sorted(excluded),
        "recommended": recommended,
        "reasoning": [
            "Excluded courses already completed or currently in progress by the student.",
            "Excluded special topics and thesis/research courses (696, 698, THESIS, RESEARCH).",
            "Excluded courses without a real scheduled time (ARR/TBA days, 00:00 times, SUP mode).",
            "Prioritized COMP-prefixed courses over other departments.",
            "Prioritized 400-500 level courses as most relevant for degree completion.",
            "Returned the top 15 recommendations after filtering and sorting.",
        ],
    }