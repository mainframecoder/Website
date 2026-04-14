from database import SessionLocal
from models import Product, Variant

db = SessionLocal()

p = Product(name="Nike Shoes", description="Premium", store_id=1)
db.add(p)
db.commit()
db.refresh(p)

v = Variant(product_id=p.id, color="Black", size="M", price=120,
            image="https://res.cloudinary.com/demo/image/upload/sample.jpg")

db.add(v)
db.commit()

print("Seeded")
