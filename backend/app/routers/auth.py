from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db
from app.models import User
from app.utils import get_password_hash, verify_password
from app.utils import create_access_token, get_current_user
from pydantic import BaseModel

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

# @auth_router.post("/register")
# def register_staff(data: RegisterSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     if current_user.role != "store_manager":
#         raise HTTPException(status_code=403, detail="Only store managers can register staff")

#     if data.role not in ["staff", "store_manager"]:
#         raise HTTPException(status_code=400, detail="Invalid role. Must be 'staff' or 'store_manager'")

#     existing = db.query(User).filter(User.username == data.username).first()
#     if existing:
#         raise HTTPException(status_code=409, detail="Username already taken")

#     new_user = User(
#         username=data.username,
#         hashed_password=get_password_hash(data.password),
#         role=data.role
#     )
#     db.add(new_user)
#     db.commit()
#     return {"msg": f"{data.role.capitalize()} '{data.username}' registered successfully"}

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
        raise HTTPException(status_code=409, detail="Username already taken")

    new_user = User(
        username=data.username,
        hashed_password=get_password_hash(data.password),
        role=data.role
    )
    db.add(new_user)
    db.commit()
    return {"msg": f"{data.role.capitalize()} '{data.username}' registered successfully"}

