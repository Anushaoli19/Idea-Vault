from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Application, Notification, OpenRole
from app.schemas import ActionResponse, NotificationActionRequest, NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
def list_notifications(
    category: Optional[str] = Query("all", description="Filter: all, teammates, upvotes, comments, grants"),
    user_id: Optional[str] = Query("usr-rohan-cse"),
    db: Session = Depends(get_db),
):
    query = db.query(Notification).filter(Notification.user_id == user_id)
    if category and category.lower() != "all":
        query = query.filter(Notification.type.ilike(f"%{category}%"))

    notifs = query.order_by(Notification.created_at.desc()).all()
    return notifs

@router.post("/{id}/action", response_model=ActionResponse)
def handle_notification_action(
    id: str,
    payload: NotificationActionRequest,
    db: Session = Depends(get_db),
):
    notif = db.query(Notification).filter(Notification.id == id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    action = payload.action.lower()
    if action not in ["accept", "decline"]:
        raise HTTPException(status_code=400, detail="Invalid action. Must be 'accept' or 'decline'.")

    notif.action_status = "accepted" if action == "accept" else "declined"
    notif.is_read = True

    # If accepted and associated with a role, increment filled slot
    if action == "accept" and notif.role_id:
        role = db.query(OpenRole).filter(OpenRole.id == notif.role_id).first()
        if role and role.filled_slots < role.total_slots:
            role.filled_slots += 1

        # Also update Application status if present
        app = db.query(Application).filter(
            Application.role_id == notif.role_id,
            Application.applicant_id == notif.applicant_id,
        ).first()
        if app:
            app.status = "accepted"

    db.commit()
    msg = f"Applicant {action}ed successfully"
    return ActionResponse(success=True, message=msg)

@router.post("/mark-all-read", response_model=ActionResponse)
def mark_all_read(user_id: str = "usr-rohan-cse", db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == user_id).update({Notification.is_read: True})
    db.commit()
    return ActionResponse(success=True, message="All notifications marked as read")
