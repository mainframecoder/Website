from fastapi import APIRouter
from db import PRODUCTS

router = APIRouter()

@router.get("/")
def get_products():
    return PRODUCTS
