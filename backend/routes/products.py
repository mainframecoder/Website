from fastapi import APIRouter
from db import products_collection

router = APIRouter()

@router.get("/")
def get_products():
    products = list(products_collection.find({}, {"_id": 0}))
    return products
