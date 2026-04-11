from fastapi import APIRouter
import stripe
import os

from models import CheckoutRequest
from db import PRODUCTS

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL")


@router.post("/create-checkout-session")
def create_checkout(data: CheckoutRequest):

    if not stripe.api_key:
        return {"error": "Stripe key missing"}

    line_items = []

    for item in data.cart:
        product = PRODUCTS.get(item.id)
        if not product:
            continue

        line_items.append({
            "price_data": {
                "currency": "cad",
                "product_data": {
                    "name": product["name"],
                },
                "unit_amount": int(product["price"] * 100),
            },
            "quantity": item.qty,
        })

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=line_items,
        mode="payment",
        customer_email=data.email,
        success_url=f"{FRONTEND_URL}/success.html",
        cancel_url=f"{FRONTEND_URL}",
    )

    return {"url": session.url}
