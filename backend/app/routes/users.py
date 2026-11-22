from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Idea, User
from app.schemas import ProfileUpdate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{id}/profile", response_model=UserResponse)
def get_user_profile(id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{id}/profile", response_model=UserResponse)
def update_user_profile(id: str, payload: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(user, field, val)

    db.commit()
    db.refresh(user)
    return user

@router.get("/{id}/submissions")
def get_user_submissions(id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    ideas = db.query(Idea).filter(Idea.author_id == id).all()

    total_endorsements = sum(i.upvotes_count for i in ideas)
    total_inquiries = sum(i.interested_count for i in ideas)

    return {
        "user": {
            "name": user.name,
            "usn": user.usn,
            "department": user.department,
            "batch": user.batch,
            "avatar_url": user.avatar_url,
        },
        "metrics": {
            "active_capstones": len(ideas),
            "total_endorsements": total_endorsements,
            "collaborator_inquiries": total_inquiries,
            "lab_status": user.lab_clearances,
        },
        "ideas": [
            {
                "id": i.id,
                "title": i.title,
                "category": i.category,
                "department": i.department,
                "maturity": i.maturity,
                "status": i.status,
                "upvotes_count": i.upvotes_count,
                "interested_count": i.interested_count,
                "faculty_mentor": i.faculty_mentor,
                "created_at": i.created_at,
            }
            for i in ideas
        ]
    }
