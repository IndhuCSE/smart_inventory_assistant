from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)  # Ensure password is not null
    role = Column(String) 
    is_active = Column(Boolean, default=True) 
class InventoryItem(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(Integer)
    price = Column(Float)
    low_stock_threshold = Column(Integer)

    # Optional: Create a bidirectional relationship with Sale
    sales = relationship("Sale", back_populates="item")

class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory.id"))
    quantity_sold = Column(Integer, nullable=False)  # Ensure quantity is always provided
    sale_date = Column(Date , nullable=False)

    # Bidirectional relationship with InventoryItem
    item = relationship("InventoryItem", back_populates="sales")
