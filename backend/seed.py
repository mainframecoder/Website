from database import SessionLocal
from models import Product, Variant

db = SessionLocal()

p = Product(name="Nike Shoes", description="Premium shoes")
db.add(p)
db.commit()
db.refresh(p)

db.add_all([
    Variant(product_id=p.id, color="Red", size="M", price=100,
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"),

    Variant(product_id=p.id, color="Black", size="M", price=120,
            image="https://images.unsplash.com/photo-1528701800489-20be3c3e9c7e?w=500")
])

db.commit()

print("Seed done")
