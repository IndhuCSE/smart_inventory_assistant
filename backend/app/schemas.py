from pydantic import BaseModel, validator
from typing import Optional, List
import datetime

# ---------------------- User Schemas ----------------------

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

# ---------------------- Inventory Schemas ----------------------

class InventoryBase(BaseModel):
    name: str
    quantity: int
    price: float
    low_stock_threshold: int

    class Config:
        from_attributes = True

class InventoryItemCreate(InventoryBase):
    pass

class InventoryOut(InventoryBase):
    id: int

    class Config:
        from_attributes = True

class InventoryUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None
    low_stock_threshold: Optional[int] = None

    class Config:
        from_attributes = True

# ---------------------- Sales Schemas ----------------------

class SaleIn(BaseModel):
    item_id: int
    quantity_sold: int
    sale_date: Optional[datetime.datetime] = None

    @validator('sale_date', pre=True, always=True)
    def set_sale_date(cls, v):
        return v or datetime.datetime.utcnow()

class SaleOut(SaleIn):
    id: int

    class Config:
        from_attributes = True

class StaffResponse(BaseModel):
    username: str

class StockItem(BaseModel):
    id: int
    name: str
    quantity: int

    class Config:
        from_attributes = True