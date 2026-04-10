from fastapi import APIRouter
import stripe
import os

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.post("/create-checkout-session")
async def create_checkout_session(data: dict):
    items = data.get("items", [])

    line_items = []

    for item in items:
        line_items.append({
            "price_data": {
                "currency": "cad",
                "product_data": {
                    "name": item["name"],
                },
                "unit_amount": int(item["price"] * 100),
            },
            "quantity": item["qty"],
        })

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=line_items,
        mode="payment",

        success_url="https://website-9gq9.onrender.com",
        cancel_url="https://website-9gq9.onrender.com",
    )

    return {"url": session.url}
