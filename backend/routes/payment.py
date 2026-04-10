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

        success_url="https://website-xxxx.vercel.app/success.html",
        cancel_url="https://website-xxxx.vercel.app/index.html",
    )

    return {"url": session.url}
