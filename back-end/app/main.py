from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .db import Base, engine, get_db
from . import models, schemas
from .planner import simple_plan

app = FastAPI(title="COMP680 Backend", version="0.1.0")

# Create tables if not exist (for quick local dev)
Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}

# ---- Students ----
@app.post("/students", response_model=schemas.StudentOut)
def create_student(payload: schemas.StudentCreate, db: Session = Depends(get_db)):
    s = models.Student(full_name=payload.full_name, degree_id=payload.degree_id)
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

# ---- Courses ----
@app.post("/courses", response_model=schemas.CourseOut)
def upsert_course(payload: schemas.CourseCreate, db: Session = Depends(get_db)):
    c = db.query(models.Course).filter(models.Course.course_id == payload.course_id).first()
    if c:
        c.title = payload.title
        c.credits = payload.credits
        c.prereq_expr = payload.prereq_expr
    else:
        c = models.Course(**payload.model_dump())
        db.add(c)
    db.commit()
    return c

@app.get("/courses", response_model=List[schemas.CourseOut])
def list_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).order_by(models.Course.course_id.asc()).all()

# ---- Offerings ----
@app.post("/offerings", response_model=schemas.OfferingOut)
def create_offering(payload: schemas.OfferingCreate, db: Session = Depends(get_db)):
    # Ensure course exists
    c = db.query(models.Course).filter(models.Course.course_id == payload.course_id).first()
    if not c:
        raise HTTPException(status_code=400, detail="course_id not found in courses")
    off = models.Offering(**payload.model_dump())
    db.add(off)
    db.commit()
    db.refresh(off)
    return off

@app.get("/offerings", response_model=List[schemas.OfferingOut])
def list_offerings(term: str, db: Session = Depends(get_db)):
    return (
        db.query(models.Offering)
        .filter(models.Offering.term == term)
        .order_by(models.Offering.course_id.asc(), models.Offering.section.asc())
        .all()
    )

# ---- Schedule blocks ----
@app.post("/schedule-blocks", response_model=schemas.ScheduleBlockOut)
def create_schedule_block(payload: schemas.ScheduleBlockCreate, db: Session = Depends(get_db)):
    s = db.query(models.Student).filter(models.Student.student_id == payload.student_id).first()
    if not s:
        raise HTTPException(status_code=400, detail="student_id not found")
    b = models.StudentScheduleBlock(**payload.model_dump())
    db.add(b)
    db.commit()
    db.refresh(b)
    return b

@app.get("/schedule-blocks", response_model=List[schemas.ScheduleBlockOut])
def list_schedule_blocks(student_id: int, term: str, db: Session = Depends(get_db)):
    return (
        db.query(models.StudentScheduleBlock)
        .filter(models.StudentScheduleBlock.student_id == student_id,
                models.StudentScheduleBlock.term == term)
        .order_by(models.StudentScheduleBlock.day_of_week.asc(),
                  models.StudentScheduleBlock.start_time.asc())
        .all()
    )

# ---- Degree requirements ----
@app.post("/degree-requirements", response_model=schemas.DegreeReqOut)
def create_degree_req(payload: schemas.DegreeReqCreate, db: Session = Depends(get_db)):
    req = models.DegreeRequirement(**payload.model_dump())
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

@app.get("/degree-requirements", response_model=List[schemas.DegreeReqOut])
def list_degree_req(degree_id: str, db: Session = Depends(get_db)):
    return (
        db.query(models.DegreeRequirement)
        .filter(models.DegreeRequirement.degree_id == degree_id)
        .order_by(models.DegreeRequirement.req_id.asc())
        .all()
    )

# ---- Planner ----
@app.post("/plan", response_model=schemas.PlanResponse)
def plan(payload: schemas.PlanRequest, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.student_id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    selected, total, conflicts, reasoning = simple_plan(
        db=db,
        student_id=payload.student_id,
        term=payload.term,
        target_credits=payload.target_credits
    )

    items = []
    for off, course in selected:
        items.append(schemas.PlanCourseItem(
            offering_id=off.offering_id,
            course_id=off.course_id,
            section=off.section,
            days=off.days,
            start_time=off.start_time,
            end_time=off.end_time,
            credits=course.credits,
        ))

    return schemas.PlanResponse(
        student_id=payload.student_id,
        term=payload.term,
        target_credits=payload.target_credits,
        total_credits=total,
        selected_courses=items,
        conflicts=conflicts,
        reasoning=reasoning
    )