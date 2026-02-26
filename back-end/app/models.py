from sqlalchemy import Column, Integer, String, ForeignKey
from .db import Base

class Student(Base):
    __tablename__ = "students"
    student_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    degree_id = Column(String, nullable=False)

class Course(Base):
    __tablename__ = "courses"
    course_id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    credits = Column(Integer, nullable=False)
    prereq_expr = Column(String, nullable=True)

class Offering(Base):
    __tablename__ = "offerings"
    offering_id = Column(Integer, primary_key=True, index=True)
    term = Column(String, nullable=False, index=True)
    course_id = Column(String, ForeignKey("courses.course_id"), nullable=False, index=True)
    section = Column(String, nullable=False)
    days = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    location = Column(String, nullable=True)
    instructor = Column(String, nullable=True)
    capacity = Column(Integer, nullable=True)
    enrolled = Column(Integer, nullable=False, default=0)

class StudentScheduleBlock(Base):
    __tablename__ = "student_schedule_blocks"
    block_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False, index=True)
    term = Column(String, nullable=False, index=True)
    day_of_week = Column(Integer, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    block_type = Column(String, nullable=True)
    note = Column(String, nullable=True)

class StudentCourse(Base):
    __tablename__ = "student_courses"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False, index=True)
    course_id = Column(String, ForeignKey("courses.course_id"), nullable=False, index=True)
    term = Column(String, nullable=True)
    status = Column(String, nullable=False)  # completed | in_progress | planned
    grade = Column(String, nullable=True)

class DegreeRequirement(Base):
    __tablename__ = "degree_requirements"
    req_id = Column(Integer, primary_key=True, index=True)
    degree_id = Column(String, nullable=False, index=True)
    req_type = Column(String, nullable=False)  # core | elective_group | credits
    rule_expr = Column(String, nullable=False)
    credits_needed = Column(Integer, nullable=True)