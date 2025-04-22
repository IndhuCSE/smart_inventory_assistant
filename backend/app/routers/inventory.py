from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db  # Use the get_db function from database
from app.models import InventoryItem  # SQLAlchemy model
from app import schemas, models
from fastapi.responses import FileResponse
import csv
import json
router = APIRouter(prefix="/inventory", tags=["inventory"])

# List items endpoint (returning Pydantic model)
@router.get("/", response_model=List[schemas.InventoryOut])
def list_items(db: Session = Depends(get_db)):
    return db.query(models.InventoryItem).all()

# routes/inventory.py

# @router.get("/stock", response_model=List[schemas.StockItem])
# def get_current_stock(db: Session = Depends(get_db)):
#     try:
#       items = db.query(models.Inventory).all()
#       return items
#     except Exception as e:
#      raise HTTPException(status_code=500, detail=str(e))

@router.get("/stock", response_model=List[schemas.StockItem])
def get_current_stock(db: Session = Depends(get_db)):
    try:
        items = db.query(models.InventoryItem).all()
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/name/{item_name}", response_model=schemas.InventoryOut)
def get_item(item_name: str, db: Session = Depends(get_db)):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.name == item_name).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item with that name not found")
    return item


# Add item endpoint (using InventoryItemCreate schema for input)
@router.post("/", response_model=schemas.InventoryOut)  # Return the InventoryOut schema
async def add_inventory_item(item: schemas.InventoryItemCreate, db: Session = Depends(get_db)):
    # Create a new inventory item using the SQLAlchemy model
    new_item = models.InventoryItem(
        name=item.name,
        quantity=item.quantity,
        price=item.price,
        low_stock_threshold=item.low_stock_threshold
    )
    
    # Add the item to the database
    db.add(new_item)
    db.commit()
    db.refresh(new_item)  # Refresh the object to get the updated state from the DB
    
    return new_item  # Return the created item (now in Pydantic format)

# Update item endpoint (Pydantic schema used for the input)
@router.put("/{item_id}", response_model=schemas.InventoryOut)
def update_item(item_id: int, item: schemas.InventoryBase, db: Session = Depends(get_db)):
    db_item = db.query(models.InventoryItem).get(item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    db.commit()
    return db_item

# Delete item endpoint
@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.InventoryItem).get(item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"ok": True}


# @router.get("/stock/low", response_model=List[schemas.StockItem])
# def get_low_stock_items(db: Session = Depends(get_db)):
#     threshold = 10  # or fetch from a config table
#     items = db.query(models.Inventory).filter(models.Inventory.quantity < threshold).all()
#     return items

@router.get("/stock/low", response_model=List[schemas.StockItem])
def get_low_stock_items(db: Session = Depends(get_db)):
    threshold = 10
    items = db.query(models.InventoryItem).filter(models.InventoryItem.quantity < threshold).all()
    return items





@router.get("/report", response_class=FileResponse)
def download_report(format: str = "csv", db: Session = Depends(get_db)):
    items = db.query(models.InventoryItem).all()
    data = [{"id": i.id, "name": i.name, "quantity": i.quantity} for i in items]

    if format == "csv":
        filename = "report.csv"
        with open(filename, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["id", "name", "quantity"])
            writer.writeheader()
            writer.writerows(data)
    elif format == "json":
        filename = "report.json"
        with open(filename, "w") as f:
            json.dump(data, f)

    return FileResponse(filename, media_type="application/octet-stream", filename=filename)