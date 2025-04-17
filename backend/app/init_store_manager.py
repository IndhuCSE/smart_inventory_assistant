# init_store_manager.py

from app.database import SessionLocal
from app.models import User
from app.utils import get_password_hash

def create_store_manager():
    db = SessionLocal()
    try:
        username = "thrisha"
        password = "thrish@123"
        hashed_pw = get_password_hash(password)

        existing = db.query(User).filter(User.username == username).first()
        if not existing:
            new_user = User(username=username, hashed_password=hashed_pw, role="store_manager")
            db.add(new_user)
            db.commit()
            print(f"✅ Store manager '{username}' created successfully!")
        else:
            print("⚠️ Store manager already exists.")
    finally:
        db.close()

if __name__ == "__main__":
    create_store_manager()
