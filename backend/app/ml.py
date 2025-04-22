import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def predict_from_db(sales_data: list[dict]):
    df = pd.DataFrame(sales_data)
    
    if df.empty:
        return {"message": "No sales data provided."}

    df["sale_date"] = pd.to_datetime(df["sale_date"])
    
    predictions = {}
    
    for item_id, group in df.groupby("item_id"):
        group = group.sort_values("sale_date")

        # Calculate daily totals
        daily_totals = group.groupby("sale_date")["quantity_sold"].sum()

        if len(daily_totals) < 2:  # Not enough data for regression
            predictions[f"item_{item_id}"] = 0
            continue
        
        # Prepare the data for linear regression
        daily_totals = daily_totals.reset_index()
        daily_totals["day"] = (daily_totals["sale_date"] - daily_totals["sale_date"].min()).dt.days
        
        # Feature matrix (X) and target vector (y)
        X = daily_totals[["day"]]
        y = daily_totals["quantity_sold"]
        
        # Initialize and train the linear regression model
        model = LinearRegression()
        model.fit(X, y)

        # Predict the next month's demand
        last_day = daily_totals["day"].max()
        days_in_next_month = 30
        future_days = np.array([last_day + i for i in range(1, days_in_next_month + 1)]).reshape(-1, 1)
        
        predicted_sales = model.predict(future_days)
        predicted_next_month = int(round(predicted_sales.sum()))

        predictions[f"item_{item_id}"] = predicted_next_month
    
    return predictions






# import pandas as pd
# from collections import defaultdict

# def predict_from_db(sales_data: list[dict]):
#     df = pd.DataFrame(sales_data)
    
#     if df.empty:
#         return {"message": "No sales data provided."}

#     df["sale_date"] = pd.to_datetime(df["sale_date"])
    
#     predictions = {}
    
#     for item_id, group in df.groupby("item_id"):
#         group = group.sort_values("sale_date")

#         # Calculate daily totals
#         daily_totals = group.groupby("sale_date")["quantity_sold"].sum()
        
#         if len(daily_totals) == 0:
#             predictions[f"item_{item_id}"] = 0
#             continue
        
#         avg_daily = daily_totals.mean()
#         predicted_next_month = int(round(avg_daily * 30))

#         predictions[f"item_{item_id}"] = predicted_next_month
    
#     return predictions
