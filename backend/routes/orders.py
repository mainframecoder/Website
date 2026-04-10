from fastapi import APIRouter
from db import orders_collection

router = APIRouter()

@router.post("/")
def create_order(order: dict):
    orders_collection.insert_one(order)
    return {"msg": "Order placed"}
