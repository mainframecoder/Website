import os
import stripe
from fastapi import APIRouter, Request
from pydantic import BaseModel
from db import orders_collection
from datetime import datetime

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


class CartItem(BaseModel):
    name: str
    price: float
    qty: int

class CheckoutRequest(BaseModel):
    items: list[CartItem]
    name: str
    address: str


@router.post("/create-checkout-session")
def create_checkout(data: CheckoutRequest):

    line_items = []

    for item in data.items:
        line_items.append({
            "price_data": {
                "currency": "cad",
                "product_data": {"name": item.name},
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
        metadata={
            "name": data.name,
            "address": data.address,
            "items": str([item.dict() for item in data.items])
        }
    )

    return {"url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    event = stripe.Webhook.construct_event(
        payload, sig_header, WEBHOOK_SECRET
    )

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        order = {
            "name": session["metadata"]["name"],
            "address": session["metadata"]["address"],
            "items": session["metadata"]["items"],
            "status": "Order Placed",
            "created_at": datetime.utcnow()
        }

        result = orders_collection.insert_one(order)

    return {"status": "ok"}
