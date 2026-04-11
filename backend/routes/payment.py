from fastapi import APIRouter, HTTPException
import stripe
import os
import uuid

from models import CheckoutRequest
from db import PRODUCTS, ORDERS

router = APIRouter()

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL")

stripe.api_key = STRIPE_SECRET_KEY


@router.post("/create-checkout-session")
def create_checkout(data: CheckoutRequest):

    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe key missing")

    if not FRONTEND_URL:
        raise HTTPException(status_code=500, detail="Frontend URL missing")

    if not data.cart:
        raise HTTPException(status_code=400, detail="Cart is empty")

    line_items = []
    total = 0

    for item in data.cart:
        product = PRODUCTS.get(item.id)

        if not product:
            continue

        total += product["price"] * item.qty

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

    if not line_items:
        raise HTTPException(status_code=400, detail="Invalid cart items")

    try:
        # ✅ Create order FIRST
        order_id = str(uuid.uuid4())[:8]

        ORDERS[order_id] = {
            "id": order_id,
            "items": [item.dict() for item in data.cart],
            "total": total,
            "status": "Processing"
        }

        # ✅ Create Stripe session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            customer_email=data.email if data.email else None,

            success_url=f"{FRONTEND_URL}/success.html?order_id={order_id}",
            cancel_url=f"{FRONTEND_URL}",
        )

        return {"url": session.url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
