from pydantic import BaseModel
from typing import List

class CartItem(BaseModel):
    name: str
    price: float
    qty: int

class Order(BaseModel):
    items: List[CartItem]
    total: float
    name: str
    address: str
