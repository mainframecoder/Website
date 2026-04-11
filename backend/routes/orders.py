from fastapi import APIRouter, HTTPException
from db import ORDERS

# ✅ THIS IS REQUIRED
router = APIRouter()


@router.get("/{order_id}")
def get_order(order_id: str):
    order = ORDERS.get(order_id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order
