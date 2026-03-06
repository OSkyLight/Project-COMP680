from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .db import Base


class Student(Base):
    __tablename__ = "student"

    student_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    degree = Column(String, nullable=False)

    freetime = relationship("StudentFreeTime", back_populates="student", cascade="all, delete")
    audits = relationship("Audit", back_populates="student", cascade="all, delete")


class Course(Base):
    __tablename__ = "course"

    course_id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String, nullable=False)   # e.g., "COMP 680"
    course_name = Column(String, nullable=False)
    day = Column(String, nullable=False)           # "Mon", "Tue", ...
    start_time = Column(String, nullable=False)    # "HH:MM"
    end_time = Column(String, nullable=False)      # "HH:MM"


class StudentFreeTime(Base):
    __tablename__ = "student_schedule_freetime"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("student.student_id", ondelete="CASCADE"), nullable=False)
    day = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)

    student = relationship("Student", back_populates="freetime")


class Audit(Base):
    __tablename__ = "audit"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("student.student_id", ondelete="CASCADE"), nullable=False)
    course_code = Column(String, nullable=False)
    course_name = Column(String, nullable=False)
    status = Column(String, nullable=False)  # "missing", "completed", "required", ...

    student = relationship("Student", back_populates="audits")