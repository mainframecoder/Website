from fastapi import APIRouter
from db import PRODUCTS

router = APIRouter()


@router.get("/")
def get_products():
    return PRODUCTS


@router.get("/{product_id}")
def get_product(product_id: int):
    product = PRODUCTS.get(product_id)

    if not product:
        return {"error": "Product not found"}

    return product
