from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models import Product, Variant

router = APIRouter()


# ================= DB DEP ================= #
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================= GET ALL PRODUCTS ================= #
@router.get("/")
def get_products():
    db: Session = SessionLocal()

    products = db.query(Product).all()

    result = []

    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,

            # 👇 return ALL variants
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
        })

    return result


# ================= GET SINGLE PRODUCT ================= #
@router.get("/{product_id}")
def get_product(product_id: int):
    db: Session = SessionLocal()

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,

        "variants": [
            {
                "id": v.id,
                "color": v.color,
                "size": v.size,
                "price": v.price,
                "image": v.image
            }
            for v in product.variants
        ]
    }


# ================= CREATE PRODUCT ================= #
@router.post("/")
def create_product(data: dict):
    db: Session = SessionLocal()

    product = Product(
        name=data["name"],
        description=data.get("description", "")
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return {"msg": "Product created", "id": product.id}


# ================= ADD VARIANT ================= #
@router.post("/{product_id}/variant")
def add_variant(product_id: int, data: dict):
    db: Session = SessionLocal()

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    variant = Variant(
        product_id=product_id,
        color=data["color"],
        size=data["size"],
        price=data["price"],
        image=data["image"]
    )

    db.add(variant)
    db.commit()

    return {"msg": "Variant added"}


# ================= DELETE PRODUCT ================= #
@router.delete("/{product_id}")
def delete_product(product_id: int):
    db: Session = SessionLocal()

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"msg": "Deleted"}
