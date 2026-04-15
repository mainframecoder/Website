from pydantic import BaseModel
from typing import List, Optional

class CartItem(BaseModel):
    id: int
    qty: int

class CheckoutRequest(BaseModel):
    cart: List[CartItem]
    email: Optional[str] = None
    address: Optional[str] = None
