from pydantic import BaseModel
from typing import Optional, List

class StudentCreate(BaseModel):
    full_name: Optional[str] = None
    degree_id: str

class StudentOut(BaseModel):
    student_id: int
    full_name: Optional[str] = None
    degree_id: str

class CourseCreate(BaseModel):
    course_id: str
    title: str
    credits: int
    prereq_expr: Optional[str] = None

class CourseOut(CourseCreate):
    pass

class OfferingCreate(BaseModel):
    term: str
    course_id: str
    section: str
    days: str
    start_time: str
    end_time: str
    location: Optional[str] = None
    instructor: Optional[str] = None
    capacity: Optional[int] = None
    enrolled: int = 0

class OfferingOut(OfferingCreate):
    offering_id: int

class ScheduleBlockCreate(BaseModel):
    student_id: int
    term: str
    day_of_week: int
    start_time: str
    end_time: str
    block_type: Optional[str] = None
    note: Optional[str] = None

class ScheduleBlockOut(ScheduleBlockCreate):
    block_id: int

class DegreeReqCreate(BaseModel):
    degree_id: str
    req_type: str
    rule_expr: str
    credits_needed: Optional[int] = None

class DegreeReqOut(DegreeReqCreate):
    req_id: int

class PlanRequest(BaseModel):
    student_id: int
    term: str
    target_credits: int = 15

class PlanCourseItem(BaseModel):
    offering_id: int
    course_id: str
    section: str
    days: str
    start_time: str
    end_time: str
    credits: int

class PlanResponse(BaseModel):
    student_id: int
    term: str
    target_credits: int
    total_credits: int
    selected_courses: List[PlanCourseItem]
    conflicts: List[str]
    reasoning: List[str]