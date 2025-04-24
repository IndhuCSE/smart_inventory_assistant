from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error
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
        if isinstance(file, list):
         file = file[0]
        df = pd.read_csv(file.file)


        # Rename columns to match DB model fields
        df = df.rename(columns={"date": "sale_date", "quantity": "quantity_sold"})

        # Convert sale_date to datetime
        df["sale_date"] = pd.to_datetime(df["sale_date"], format="%d-%m-%Y")
        print(df[df["sale_date"].isna()])
        print(df.groupby(["item_id", "item_name"]).size())
        
        # Convert to list of dictionaries
        sales_data = df.to_dict(orient="records")

        # Run ML prediction
        predictions = predict_from_db(sales_data)
        return predictions

    except Exception as e:
      print("❌ Error during prediction:", e)
      raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
    
#Accuracy based on item_id alone
# @router.get("/predict/{item_id}")
# def predict_demand(item_id: int, db: Session = Depends(get_db)):
#     sales = db.query(models.Sale).filter(models.Sale.item_id == item_id).all()
#     if not sales:
#         raise HTTPException(status_code=404, detail="No sales data for this item")

#     df = pd.DataFrame([(s.sale_date, s.quantity_sold) for s in sales], columns=["date", "sold"])
#     df["date"] = pd.to_datetime(df["date"])
#     df["days"] = (df["date"] - df["date"].min()).dt.days

#     if df["days"].nunique() < 2:
#         raise HTTPException(status_code=400, detail="Not enough data for prediction")

#     model = LinearRegression()
#     X = df[["days"]]
#     y = df["sold"]
#     model.fit(X, y)

#     y_pred = model.predict(X)
#     r2 = r2_score(y, y_pred)
#     mae = mean_absolute_error(y, y_pred)

#     future = model.predict([[df["days"].max() + 7]])[0]

#     return {
#         "predicted_sales_in_7_days": round(float(future), 2),
#         "r2_score": round(r2, 4),
#         "mean_absolute_error": round(mae, 2)
#     }

@router.get("/predict/overall-accuracy")
def overall_model_accuracy(db: Session = Depends(get_db)):
    from sklearn.linear_model import LinearRegression
    from sklearn.metrics import r2_score, mean_absolute_error

    all_sales = db.query(models.Sale).all()
    if not all_sales:
        raise HTTPException(status_code=404, detail="No sales data available")

    # Group sales by item_id
    from collections import defaultdict
    grouped = defaultdict(list)
    for sale in all_sales:
        grouped[sale.item_id].append((sale.sale_date, sale.quantity_sold))

    all_r2 = []
    all_mae = []

    for item_id, records in grouped.items():
        df = pd.DataFrame(records, columns=["date", "sold"])
        df["date"] = pd.to_datetime(df["date"])
        df["days"] = (df["date"] - df["date"].min()).dt.days

        # Must have at least 2 unique days for valid regression
        if df["days"].nunique() < 2:
            continue

        model = LinearRegression()
        X = df[["days"]]
        y = df["sold"]
        model.fit(X, y)

        y_pred = model.predict(X)
        r2 = r2_score(y, y_pred)
        mae = mean_absolute_error(y, y_pred)

        all_r2.append(r2)
        all_mae.append(mae)

    if not all_r2:
        raise HTTPException(status_code=400, detail="Not enough data for overall evaluation")

    # Mean accuracy metrics across all items
    return {
        "average_r2_score": round(sum(all_r2) / len(all_r2), 4),
        "average_mae": round(sum(all_mae) / len(all_mae), 2),
        "items_evaluated": len(all_r2)
    }

