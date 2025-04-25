from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LowStockAlert

router = APIRouter(prefix="/api", tags=["alerts"])

@router.get("/low-stock")
def get_low_stock_alerts(db: Session = Depends(get_db)):
    alerts = db.query(LowStockAlert).all()
    return [
        {"item_id": alert.id, "item_name": alert.item_name, "quantity": alert.quantity}
        for alert in alerts
    ]
