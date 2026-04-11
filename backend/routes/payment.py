from fastapi import APIRouter, HTTPException
import stripe
import os

from models import CheckoutRequest
from db import PRODUCTS

router = APIRouter()

# ✅ Load env variables
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL")

# ✅ Set Stripe key
stripe.api_key = STRIPE_SECRET_KEY


@router.post("/create-checkout-session")
def create_checkout(data: CheckoutRequest):

    # 🚨 Safety checks
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe key missing")

    if not FRONTEND_URL:
        raise HTTPException(status_code=500, detail="Frontend URL missing")

    if not data.cart:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # ✅ Build Stripe line items
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
                "unit_amount": int(product["price"] * 100),  # cents
            },
            "quantity": item.qty,
        })

    if not line_items:
        raise HTTPException(status_code=400, detail="Invalid cart items")

    try:
        # ✅ Create Stripe session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            customer_email=data.email if data.email else None,

            # ✅ IMPORTANT FIX (NO .html)
            success_url=f"{FRONTEND_URL}/success",
            cancel_url=f"{FRONTEND_URL}",
        )

        return {"url": session.url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
