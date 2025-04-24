import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def predict_from_db(sales_data: list[dict]):
    df = pd.DataFrame(sales_data)
    
    if df.empty:
        return {"message": "No sales data provided."}


    df["sale_date"] = pd.to_datetime(df["sale_date"], format="%d-%m-%Y")

    predictions = {}

    for (item_id, item_name), group in df.groupby(["item_id", "item_name"]):
        group = group.sort_values("sale_date")
        daily_totals = group.groupby("sale_date")["quantity_sold"].sum()

        if len(daily_totals) < 2:
            predictions[f"item_{item_id}_{item_name}"] = 0
            continue

        daily_totals = daily_totals.reset_index()
        daily_totals["day"] = (daily_totals["sale_date"] - daily_totals["sale_date"].min()).dt.days

        X = daily_totals[["day"]]
        y = daily_totals["quantity_sold"]

        model = LinearRegression()
        model.fit(X, y)

        last_day = daily_totals["day"].max()
        future_days = np.array([last_day + i for i in range(1, 31)]).reshape(-1, 1)
        predicted_sales = model.predict(future_days)
        predicted_next_month = int(round(predicted_sales.sum()))

        predictions[f"item_{item_id}_{item_name}"] = predicted_next_month
    
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
