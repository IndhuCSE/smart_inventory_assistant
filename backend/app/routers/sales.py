from fastapi import APIRouter, UploadFile, File, HTTPException,Depends
from app.ml import predict_from_db
from sqlalchemy.orm import Session
import pandas as pd
from app import models
from app.database import get_db
router = APIRouter(prefix="/sales", tags=["sales"])

@router.post("/sales/import")
def import_sales(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        df = pd.read_csv(file.file)
        for _, row in df.iterrows():
            sale = models.Sale(
                item_id=row['item_id'],
                sale_date=pd.to_datetime(row['date']),
                quantity_sold=row['quantity']
            )
            db.add(sale)
        db.commit()
        return {"message": "Sales data imported successfully"}
    except Exception as e:
        print("❌ Error during import:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")










