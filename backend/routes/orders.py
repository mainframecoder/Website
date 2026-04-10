from fastapi import APIRouter
from db import orders_collection

router = APIRouter()

@router.get("/{order_id}")
def track_order(order_id: str):
    order = orders_collection.find_one({"_id": order_id})

    if not order:
        return {"error": "Not found"}

    return {
        "status": order["status"],
        "name": order["name"],
        "address": order["address"]
    }
