from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from database import SessionLocal
from models import Product, Variant
from cache import redis_client
import json

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_products(db: Session = Depends(get_db)):

    cache_key = "products"

    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    products = db.query(Product).options(
        joinedload(Product.variants)
    ).all()

    result = [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "variants": [
                {
                    "id": v.id,
                    "color": v.color,
                    "size": v.size,
                    "price": v.price,
                    "image": v.image
                }
                for v in p.variants
            ]
        }
        for p in products
    ]

    redis_client.setex(cache_key, 60, json.dumps(result))

    return result


@router.post("/")
def create_product(data: dict, db: Session = Depends(get_db)):

    product = Product(
        name=data["name"],
        description=data["description"],
        store_id=1
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    redis_client.delete("products")

    return {"id": product.id}


@router.post("/{product_id}/variant")
def add_variant(product_id: int, data: dict, db: Session = Depends(get_db)):

    variant = Variant(
        product_id=product_id,
        color=data["color"],
        size=data["size"],
        price=data["price"],
        image=data["image"]
    )

    db.add(variant)
    db.commit()

    redis_client.delete("products")

    return {"msg": "added"}
