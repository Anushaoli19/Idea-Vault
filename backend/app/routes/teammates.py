from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Application, Idea, Notification, OpenRole, User
from app.schemas import RoleApplyRequest, RoleApplyResponse

router = APIRouter(prefix="/teammates", tags=["Teammates"])

@router.get("/roles")
def list_open_roles(
    domain: Optional[str] = Query("All", description="Domain filter e.g. Frontend, AI/ML, Hardware, UI/UX"),
    department: Optional[str] = Query("All", description="Department filter"),
    db: Session = Depends(get_db),
):
    query = db.query(OpenRole).join(Idea)

    roles = query.all()
    results = []
    for r in roles:
        idea = r.idea
        if domain and domain.lower() != "all":
            if domain.lower() not in r.role_title.lower() and domain.lower() not in r.skills_required.lower():
                continue
        if department and department.lower() != "all":
            if department.lower() not in r.department_required.lower() and department.lower() not in idea.department.lower():
                continue

        results.append({
            "id": r.id,
            "role_title": r.role_title,
            "department_required": r.department_required,
            "skills_required": r.skills_required,
            "total_slots": r.total_slots,
            "filled_slots": r.filled_slots,
            "kickoff_date": r.kickoff_date,
            "idea_id": idea.id,
            "idea_title": idea.title,
            "idea_category": idea.category,
            "idea_department": idea.department,
            "author_name": idea.author_name,
            "author_dept": idea.author_dept,
            "author_avatar": idea.author_avatar,
        })
    return results

@router.post("/apply", response_model=RoleApplyResponse, status_code=status.HTTP_201_CREATED)
def apply_for_role(payload: RoleApplyRequest, db: Session = Depends(get_db)):
    role = db.query(OpenRole).filter(OpenRole.id == payload.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Open role not found")

    user = db.query(User).filter(User.id == payload.applicant_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Applicant user profile not found")

    if role.filled_slots >= role.total_slots:
        raise HTTPException(status_code=400, detail="This role has already filled its capacity")

    # Check for existing application
    existing_app = db.query(Application).filter(
        Application.role_id == payload.role_id,
        Application.applicant_id == payload.applicant_id,
    ).first()
    if existing_app:
        return RoleApplyResponse(
            success=True,
            application_id=existing_app.id,
            message="You have already submitted an application for this vacancy.",
        )

    app = Application(
        role_id=role.id,
        applicant_id=user.id,
        applicant_name=user.name,
        applicant_dept=user.department,
        applicant_batch=user.batch,
        note=payload.note or f"Interested in joining as {role.role_title}",
    )
    db.add(app)

    # Trigger notification to project owner
    owner_id = role.idea.author_id
    notif = Notification(
        user_id=owner_id,
        type="teammates",
        title="Teammate Request",
        message=f"{user.name} ({user.batch}) requested to join as '{role.role_title}'.",
        action_link=f"/idea/{role.idea.id}",
        applicant_id=user.id,
        applicant_name=user.name,
        applicant_dept=f"{user.department} ({user.batch})",
        role_id=role.id,
        role_title=role.role_title,
        is_actionable=True,
        action_status="pending",
    )
    db.add(notif)
    db.commit()

    return RoleApplyResponse(
        success=True,
        application_id=app.id,
        message="Application submitted to project lead successfully!",
    )
