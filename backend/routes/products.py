from fastapi import APIRouter
from db import PRODUCTS

router = APIRouter()


@router.get("/")
def get_products():
    """
    Returns all products
    """
    return PRODUCTS


@router.get("/{product_id}")
def get_product(product_id: int):
    """
    Returns a single product by ID
    """
    product = PRODUCTS.get(product_id)

    if not product:
        return {"error": "Product not found"}

    return product
