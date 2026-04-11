from pydantic import BaseModel

class CartItem(BaseModel):
    id: int
    qty: int

class CheckoutRequest(BaseModel):
    cart: list[CartItem]
    address: str
    email: str
