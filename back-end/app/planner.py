from sqlalchemy.orm import Session
from . import models

def simple_plan(db: Session, student_id: int, term: str, target_credits: int):
    # NOTE: This is a stub planner:
    # - picks offerings in the term until reaching target credits
    # - does NOT check conflicts or prerequisites yet (you'll implement later)
    offerings = (
        db.query(models.Offering)
        .filter(models.Offering.term == term)
        .order_by(models.Offering.course_id.asc())
        .all()
    )

    selected = []
    total = 0
    reasoning = []
    for off in offerings:
        course = db.query(models.Course).filter(models.Course.course_id == off.course_id).first()
        if not course:
            continue
        if total + course.credits > target_credits:
            continue
        selected.append((off, course))
        total += course.credits
        reasoning.append(f"Selected {off.course_id}-{off.section} (stub rule: fill credits)")

    return selected, total, [], reasoning