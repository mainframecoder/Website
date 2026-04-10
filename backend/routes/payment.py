import os
import stripe
from fastapi import APIRouter

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET")

@router.post("/create-checkout-session")
def create_checkout():
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "usd",
                "product_data": {"name": "Test Product"},
                "unit_amount": 5000,
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url="http://localhost:5500/success.html",
        cancel_url="http://localhost:5500",
    )
    return {"url": session.url}
