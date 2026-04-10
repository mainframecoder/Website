import os
import stripe
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL")


class CartItem(BaseModel):
    name: str
    price: float
    qty: int


class CartRequest(BaseModel):
    items: list[CartItem]


@router.post("/create-checkout-session")
def create_checkout(data: CartRequest):

    line_items = []

    for item in data.items:
        line_items.append({
            "price_data": {
                "currency": "usd",   # change to "inr" if needed
                "product_data": {
                    "name": item.name
                },
                "unit_amount": int(item.price * 100),
            },
            "quantity": item.qty,
        })

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=line_items,
        mode="payment",
        success_url=f"{FRONTEND_URL}/success.html",
        cancel_url=f"{FRONTEND_URL}",
    )

    return {"url": session.url}
