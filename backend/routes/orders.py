from fastapi import APIRouter

router = APIRouter()

ORDERS = []

@router.post("/")
def create_order(order: dict):
    ORDERS.append(order)
    return {"msg": "Order stored"}

@router.get("/")
def get_orders():
    return ORDERS
