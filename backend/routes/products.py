from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from database import SessionLocal
from models import Product, Variant
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
    products = db.query(Product).options(joinedload(Product.variants)).all()

    return [
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
                } for v in p.variants
            ]
        } for p in products
    ]


@router.get("/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    p = db.query(Product).options(joinedload(Product.variants)).filter(Product.id == id).first()

    if not p:
        return {"error": "not found"}

    return {
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
            } for v in p.variants
        ]
    }


@router.post("/")
def create_product(data: dict, db: Session = Depends(get_db)):
    p = Product(name=data["name"], description=data["description"])
    db.add(p)
    db.commit()
    db.refresh(p)

    return {"id": p.id}


@router.post("/{id}/variant")
def add_variant(id: int, data: dict, db: Session = Depends(get_db)):
    v = Variant(
        product_id=id,
        color=data["color"],
        size=data["size"],
        price=data["price"],
        image=data["image"]
    )
    db.add(v)
    db.commit()

    return {"msg": "added"}
