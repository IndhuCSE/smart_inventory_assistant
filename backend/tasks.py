# from celery import shared_task
# from backend.app.database import SessionLocal
# from backend.app.models import InventoryItem

# @shared_task(name="backend.tasks.check_low_stock")
# def check_low_stock():
#     db = SessionLocal()
#     try:
#         low_stock_items = db.query(InventoryItem).filter(
#             InventoryItem.quantity < InventoryItem.low_stock_threshold
#         ).all()
#         for item in low_stock_items:
#             print(f"⚠️ Low stock: {item.name} (Qty: {item.quantity})")
#         return f"{len(low_stock_items)} low stock items checked."
#     finally:
#         db.close()

# from celery import shared_task
# from backend.app.database import SessionLocal
# from backend.app.models import InventoryItem


# @shared_task(name="backend.tasks.check_low_stock")
# def check_low_stock():
#     db = SessionLocal()
#     try:
#         # Query low stock items from the database
#         low_stock_items = db.query(InventoryItem).filter(
#             InventoryItem.quantity < InventoryItem.low_stock_threshold
#         ).all()

#         for item in low_stock_items:
#             print(f"⚠️ Low stock: {item.name} (Qty: {item.quantity})")
#         # return f"{len(low_stock_items)} low stock items checked."

#         # Prepare data for Redis storage
#         low_stock_data = [
#             {"name": item.name, "quantity": item.quantity} for item in low_stock_items
#         ]

#         # Store the low stock data in Redis (as a JSON string)
#         if low_stock_data:
#             r.set("low_stock_alerts", json.dumps(low_stock_data))  # Overwrites the key

#         return f"{len(low_stock_items)} low stock items checked."
#     finally:
#         db.close()

import json
from celery import shared_task
from backend.app.database import SessionLocal
from backend.app.models import InventoryItem, LowStockAlert  # Make sure LowStockAlert is defined


@shared_task(name="backend.tasks.check_low_stock")
def check_low_stock():
    db = SessionLocal()
    try:
        # Query low stock items
        low_stock_items = db.query(InventoryItem).filter(
            InventoryItem.quantity < InventoryItem.low_stock_threshold
        ).all()

        # Clear previous alerts (optional: keep if you want a fresh snapshot each time)
        db.query(LowStockAlert).delete()

        # Insert new low stock alerts
        for item in low_stock_items:
            alert = LowStockAlert(
                id=item.id,
                item_name=item.name,
                quantity=item.quantity,
            )
            db.add(alert)

        db.commit()

        print(f"✅ Stored {len(low_stock_items)} low stock alerts.")
        return f"{len(low_stock_items)} low stock items checked and stored."
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
