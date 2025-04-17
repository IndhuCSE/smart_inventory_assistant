from typing import Any
import csv
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models
import pandas as pd
router = APIRouter(prefix="/sales", tags=["sales"])



@router.post("/upload")
def upload_sales_data(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(file.file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a .csv or .xlsx file.")

        for _, row in df.iterrows():
            try:
                item_id = int(row["item_id"])
                quantity_sold = int(row["quantity_sold"])
                sale_date_str = row.get("sale_date")
                sale_date = datetime.strptime(sale_date_str, "%Y-%m-%d") if pd.notnull(sale_date_str) else datetime.utcnow()

                sale = models.Sale(
                    item_id=item_id,
                    quantity_sold=quantity_sold,
                    sale_date=sale_date
                )
                db.add(sale)

            except (ValueError, KeyError) as e:
                raise HTTPException(status_code=400, detail=f"Data error in row: {row.to_dict()}")

        db.commit()
        return {"status": "uploaded"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
