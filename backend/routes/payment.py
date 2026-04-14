from fastapi import APIRouter
from database import SessionLocal
from models import Order
import json

router = APIRouter()


@router.post("/create-checkout-session")
def checkout(data: dict):
    db = SessionLocal()

    items = data.get("items", [])
    email = data.get("email")

    total = sum([i["qty"] * 50 for i in items])

    order = Order(
        email=email,
        total=total,
        items=json.dumps(items)
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "url": f"/success.html?order_id={order.id}"
    }
