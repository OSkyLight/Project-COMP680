from pydantic import BaseModel, Field
from typing import List, Optional, Any


# ---------- Schema introspection ----------
class ColumnInfo(BaseModel):
    cid: int
    name: str
    type: str
    not_null: bool
    default_value: Optional[Any]
    primary_key: bool


class ForeignKeyInfo(BaseModel):
    id: int
    seq: int
    table: str
    from_column: str
    to_column: str
    on_update: str
    on_delete: str


class TableSchema(BaseModel):
    table_name: str
    columns: List[ColumnInfo]
    foreign_keys: List[ForeignKeyInfo]


class DatabaseSchema(BaseModel):
    tables: List[TableSchema]


# ---------- Student ----------
class StudentCreate(BaseModel):
    name: str
    degree: str


class StudentOut(BaseModel):
    student_id: int
    name: str
    degree: str

    class Config:
        from_attributes = True


# ---------- Course ----------
class CourseCreate(BaseModel):
    course_code: str = Field(..., examples=["COMP 680"])
    course_name: str
    day: str = Field(..., examples=["Mon", "Tue"])
    start_time: str = Field(..., examples=["18:00"])
    end_time: str = Field(..., examples=["20:45"])


class CourseOut(BaseModel):
    course_id: int
    course_code: str
    course_name: str
    day: str
    start_time: str
    end_time: str

    class Config:
        from_attributes = True


# ---------- Free time ----------
class FreeTimeCreate(BaseModel):
    student_id: int
    day: str = Field(..., examples=["Mon"])
    start_time: str = Field(..., examples=["18:00"])
    end_time: str = Field(..., examples=["23:59"])


class FreeTimeOut(BaseModel):
    id: int
    student_id: int
    day: str
    start_time: str
    end_time: str

    class Config:
        from_attributes = True


# ---------- Audit ----------
class AuditCreate(BaseModel):
    student_id: int
    course_code: str = Field(..., examples=["COMP 620"])
    course_name: str
    status: str = Field(..., examples=["missing", "completed"])


class AuditOut(BaseModel):
    id: int
    student_id: int
    course_code: str
    course_name: str
    status: str

    class Config:
        from_attributes = True


# ---------- Plan ----------
class PlanRequest(BaseModel):
    student_id: int
    prefer_missing_only: bool = True


class PlanCourseItem(BaseModel):
    course_id: int
    course_code: str
    course_name: str
    day: str
    start_time: str
    end_time: str


class PlanResponse(BaseModel):
    student_id: int
    recommended: List[PlanCourseItem]
    reasoning: List[str]