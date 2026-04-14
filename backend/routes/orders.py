from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models import Order
import json

router = APIRouter()


@router.get("/{id}")
def get_order(id: int):
    db = SessionLocal()

    o = db.query(Order).filter(Order.id == id).first()

    if not o:
        raise HTTPException(404, "Not found")

    return {
        "id": o.id,
        "status": o.status,
        "total": o.total,
        "items": json.loads(o.items)
    }


@router.get("/user/{email}")
def user_orders(email: str):
    db = SessionLocal()

    orders = db.query(Order).filter(Order.email == email).all()

    return [
        {"id": o.id, "total": o.total, "status": o.status}
        for o in orders
    ]
