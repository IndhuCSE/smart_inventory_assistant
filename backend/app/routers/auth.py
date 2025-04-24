from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db
from app.models import User
from app.utils import get_password_hash, verify_password
from app.utils import create_access_token, get_current_user
from pydantic import BaseModel
from typing import List

auth_router = APIRouter()

class RegisterSchema(BaseModel):
    username: str
    password: str
    role: str  # Must be 'staff'

@auth_router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}


@auth_router.post("/register")
def register_user(
    data: RegisterSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "store_manager":
        raise HTTPException(
            status_code=403,
            detail="Access denied: only store managers can register users"
        )

    if data.role not in ["staff", "store_manager"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid role. Must be 'staff' or 'store_manager'"
        )

    existing = db.query(User).filter(User.username == data.username).first()
    
    if existing:
        if existing.is_active:
            # User exists and is active – can't register again
            raise HTTPException(status_code=409, detail="Username already taken")
        else:
            # Soft-deleted user — reactivate
            existing.hashed_password = get_password_hash(data.password)
            existing.role = data.role
            existing.is_active = True
            db.commit()
            return {
                "msg": f"{data.role.capitalize()} '{data.username}' reactivated successfully"
            }
    else:
        # Create new user
        new_user = User(
            username=data.username,
            hashed_password=get_password_hash(data.password),
            role=data.role
        )
        db.add(new_user)
        db.commit()
        return {
            "msg": f"{data.role.capitalize()} '{data.username}' registered successfully"
        }



# Dependency to restrict access to store_manager only
def store_manager_only(current_user: User = Depends(get_current_user)):
    if current_user.role != "store_manager":
        raise HTTPException(status_code=403, detail="Only store managers allowed")
    return current_user

@auth_router.get("/staff", response_model=List[dict])
def get_all_staff(db: Session = Depends(get_db), get_current_user: User = Depends(store_manager_only)):
    staff = db.query(User).filter(User.role == "staff", User.is_active == True).all()
    return [{"username": u.username, "role": u.role} for u in staff]




# Delete staff - Only store managers
@auth_router.delete("/staff/{username}")
def delete_staff(username: str, db: Session = Depends(get_db), get_current_user: User = Depends(store_manager_only)):
    user = db.query(User).filter(User.username == username, User.role == "staff").first()
    if not user:
        raise HTTPException(status_code=404, detail="Staff member not found")
    user.is_active = False  # Soft delete
    db.commit()
    return {"msg": f"Staff '{username}' deactivated"}