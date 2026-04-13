from fastapi import APIRouter, HTTPException
from db import PRODUCTS

router = APIRouter()


# ---------------- GET ALL PRODUCTS ---------------- #
@router.get("/")
def get_products():
    return PRODUCTS


# ---------------- GET SINGLE PRODUCT ---------------- #
@router.get("/{product_id}")
def get_product(product_id: int):
    product = PRODUCTS.get(product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product
