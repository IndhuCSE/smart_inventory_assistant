from fastapi import FastAPI,Form,File,UploadFile
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, inventory, sales, analytics,prediction,alerts
from fastapi.responses import JSONResponse
from app.database import Base, engine

from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # <-- tokenUrl must match


Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.auth_router)
app.include_router(inventory.router)
app.include_router(sales.router)
app.include_router(analytics.router)
app.include_router(prediction.router)
app.include_router(alerts.router)



@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Retail Inventory Assistant API"}

# # Setup Redis connection
# r = Redis(host='localhost', port=6379, db=1)

# @app.get("/api/low-stock")
# def get_low_stock_alerts():
#     # Fetch the low-stock alerts from Redis
#     data = r.get("low_stock_alerts")
#     if data:
#         return json.loads(data)  # Return the low stock items as JSON
#     return []  # If no alerts, return an empty list