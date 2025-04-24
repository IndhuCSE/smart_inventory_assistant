from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import database, models
from sklearn.linear_model import LinearRegression
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

router = APIRouter(prefix="/analytics", tags=["analytics"])

# Dependency: session injection
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# @router.get("/predict/{item_id}")
# def predict_demand(item_id: int, db: Session = Depends(get_db)):
#     sales = db.query(models.Sale).filter(models.Sale.item_id == item_id).all()
#     if not sales:
#         return {"error": "No sales data"}
    
#     df = pd.DataFrame([(s.sale_date, s.quantity_sold) for s in sales], columns=["date", "sold"])
#     df["date"] = pd.to_datetime(df["date"])  # ✅ Ensure datetime format
#     df["days"] = (df["date"] - df["date"].min()).dt.days

#     if df["days"].nunique() < 2:
#         return {"error": "Not enough data for prediction"}

#     model = LinearRegression()
#     model.fit(df[["days"]], df["sold"])
#     future = model.predict([[df["days"].max() + 7]])[0]
#     return {"predicted_sales_in_7_days": round(float(future), 2)}

# @router.get("/plot/{item_id}")
# def plot_sales(item_id: int, db: Session = Depends(get_db)):
#     sales = db.query(models.Sale).filter(models.Sale.item_id == item_id).all()
#     if not sales:
#         return {"error": "No data"}

#     df = pd.DataFrame([(s.sale_date, s.quantity_sold) for s in sales], columns=["date", "sold"])
#     df["date"] = pd.to_datetime(df["date"])  # ✅ Ensure datetime format

#     plt.figure(figsize=(8, 4))
#     plt.plot(df["date"], df["sold"], marker='o')
#     plt.title(f"Sales Trend for Item {item_id}")
#     plt.xlabel("Date")
#     plt.ylabel("Quantity Sold")
#     plt.tight_layout()

#     buf = io.BytesIO()
#     plt.savefig(buf, format='png')
#     buf.seek(0)
#     img_bytes = base64.b64encode(buf.read()).decode('utf-8')
#     return {"plot": img_bytes}

@router.get("/plot/{item_id}")
def plot_sales(item_id: int, db: Session = Depends(get_db)):
    sales = db.query(models.Sale).filter(models.Sale.item_id == item_id).all()
    if not sales:
        return {"error": "No data"}

    df = pd.DataFrame([(s.sale_date, s.quantity_sold) for s in sales], columns=["date", "sold"])
    df["date"] = pd.to_datetime(df["date"])
    df["days"] = (df["date"] - df["date"].min()).dt.days

    # Fit regression model
    model = LinearRegression()
    model.fit(df[["days"]], df["sold"])
    df["predicted"] = model.predict(df[["days"]])

    # Plot
    plt.figure(figsize=(8, 4))
    plt.plot(df["date"], df["sold"], marker='o', label="Actual Sales")
    plt.plot(df["date"], df["predicted"], linestyle='--', color='red', label="Regression Line")
    plt.title(f"Sales Trend for Item {item_id}")
    plt.xlabel("Date")
    plt.ylabel("Quantity Sold")
    plt.legend()
    plt.tight_layout()

    # Encode plot to base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_bytes = base64.b64encode(buf.read()).decode('utf-8')
    return {"plot": img_bytes}
