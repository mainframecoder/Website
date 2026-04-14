from db import SessionLocal
from models import Product, Variant

db = SessionLocal()

print("Seeding database...")

# -------- CLEAR OLD DATA -------- #
db.query(Variant).delete()
db.query(Product).delete()
db.commit()

# -------- SAMPLE PRODUCTS -------- #

products_data = [
    {
        "name": "Nike Air Sneakers",
        "description": "Premium running sneakers",
        "variants": [
            {"color": "Black", "size": "M", "price": 120, "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"},
            {"color": "White", "size": "M", "price": 120, "image": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500"},
            {"color": "Red", "size": "L", "price": 130, "image": "https://images.unsplash.com/photo-1528701800489-20be3c3e9c7e?w=500"}
        ]
    },
    {
        "name": "Zara Denim Jacket",
        "description": "Stylish blue denim jacket",
        "variants": [
            {"color": "Blue", "size": "M", "price": 80, "image": "https://images.unsplash.com/photo-1520975922324-6c7c7b2b3c0f?w=500"},
            {"color": "Black", "size": "L", "price": 85, "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"}
        ]
    },
    {
        "name": "H&M Hoodie",
        "description": "Comfortable everyday hoodie",
        "variants": [
            {"color": "Grey", "size": "M", "price": 50, "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"},
            {"color": "Black", "size": "L", "price": 55, "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500"}
        ]
    },
    {
        "name": "Levi’s Jeans",
        "description": "Slim fit denim jeans",
        "variants": [
            {"color": "Blue", "size": "32", "price": 70, "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"},
            {"color": "Black", "size": "34", "price": 75, "image": "https://images.unsplash.com/photo-1514996937319-344454492b37?w=500"}
        ]
    },
    {
        "name": "Adidas Cap",
        "description": "Sporty adjustable cap",
        "variants": [
            {"color": "Black", "size": "Free", "price": 25, "image": "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500"},
            {"color": "White", "size": "Free", "price": 25, "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500"}
        ]
    }
]

# -------- INSERT -------- #

for pdata in products_data:
    product = Product(
        name=pdata["name"],
        description=pdata["description"]
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    for v in pdata["variants"]:
        variant = Variant(
            product_id=product.id,
            color=v["color"],
            size=v["size"],
            price=v["price"],
            image=v["image"]
        )
        db.add(variant)

    db.commit()

print("✅ Seed completed")
