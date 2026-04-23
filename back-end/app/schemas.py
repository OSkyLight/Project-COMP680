from pydantic import BaseModel, Field
from typing import List, Optional


class StudentCreate(BaseModel):
    name: str
    degree: str


class StudentOut(BaseModel):
    student_id: int
    name: str
    degree: str

    class Config:
        from_attributes = True


class CourseCreate(BaseModel):
    course_code: str = Field(..., examples=["COMP 680"])
    course_name: str
    units: int = Field(..., examples=[3])
    day: str = Field(..., examples=["Mon", "Tue/Thu", "Mon/Wed", "ARR"])
    start_time: str = Field(..., examples=["18:00"])
    end_time: str = Field(..., examples=["20:45"])
    instructor: Optional[str] = Field(None, examples=["Boctor,Maged N"])
    mode: str = Field(..., examples=["OnCampus", "FullyOnline", "SUP"])


class CourseOut(CourseCreate):
    course_id: int

    class Config:
        from_attributes = True


class FreeTimeCreate(BaseModel):
    student_id: int
    day: str = Field(..., examples=["Mon"])
    start_time: str = Field(..., examples=["18:00"])
    end_time: str = Field(..., examples=["23:59"])


class FreeTimeOut(FreeTimeCreate):
    id: int

    class Config:
        from_attributes = True



class AuditCreate(BaseModel):
    student_id: int
    degree: str
    course_code: str = Field(..., examples=["COMP 620"])
    course_name: str
    category: str = Field(..., examples=["Electives", "Foundations"])
    status: str = Field(..., examples=["missing", "completed"])
    elective_code: Optional[int] = Field(None, examples=[4, 5, 6])
    grade: Optional[str] = Field(None, examples=["A", "B+", None])


class AuditOut(AuditCreate):
    id: int

    class Config:
        from_attributes = True


class PlanRequest(BaseModel):
    student_id: int
    prefer_missing_only: bool = True


class PlanCourseItem(BaseModel):
    course_id: int
    course_code: str
    course_name: str
    units: int
    day: str
    start_time: str
    end_time: str
    instructor: Optional[str] = None
    mode: str


class PlanResponse(BaseModel):
    student_id: int
    recommended: List[PlanCourseItem]
    reasoning: List[str]