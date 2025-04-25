from celery import shared_task
from backend.app.database import SessionLocal
from backend.app.models import InventoryItem

@shared_task(name="backend.tasks.check_low_stock")
def check_low_stock():
    db = SessionLocal()
    try:
        low_stock_items = db.query(InventoryItem).filter(
            InventoryItem.quantity < InventoryItem.low_stock_threshold
        ).all()
        for item in low_stock_items:
            print(f"⚠️ Low stock: {item.name} (Qty: {item.quantity})")
        return f"{len(low_stock_items)} low stock items checked."
    finally:
        db.close()
