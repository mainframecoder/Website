from fastapi import APIRouter, Request
import stripe
import os

router = APIRouter(prefix="/payment")

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

FRONTEND_URL = os.getenv("FRONTEND_URL")

@router.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    data = await request.json()
    cart = data.get("cart", [])

    line_items = []

    for item in cart:
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
        success_url=f"{FRONTEND_URL}/success.html",
        cancel_url=f"{FRONTEND_URL}",
    )

    return {"url": session.url}
