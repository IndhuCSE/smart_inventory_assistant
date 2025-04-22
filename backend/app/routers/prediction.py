from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.ml import predict_from_db
import pandas as pd

router = APIRouter(prefix="/predict", tags=["predict"])

@router.post("/sales/predict")
def predict_from_sales_file(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file)

        # Rename columns to match DB model fields
        df = df.rename(columns={"date": "sale_date", "quantity": "quantity_sold"})

        # Convert sale_date to datetime
        df["sale_date"] = pd.to_datetime(df["sale_date"])

        # Convert to list of dictionaries
        sales_data = df.to_dict(orient="records")

        # Run ML prediction
        predictions = predict_from_db(sales_data)
        return predictions

    except Exception as e:
        print("❌ Error during prediction:", e)
        raise HTTPException(status_code=500, detail="Prediction failed")
