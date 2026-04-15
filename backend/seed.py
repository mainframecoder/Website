from database import SessionLocal
from models import Product

def seed_data():
    db = SessionLocal()

    if db.query(Product).first():
        print("Already seeded")
        return

    products = [
        Product(
            name="Nike Shoes",
            price=99,
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            category="footwear"
        ),
        Product(
            name="Blue Jeans",
            price=49,
            image="https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
            category="clothing"
        ),
        Product(
            name="Watch",
            price=199,
            image="https://images.unsplash.com/photo-1519741497674-611481863552",
            category="accessories"
        )
    ]

    db.add_all(products)
    db.commit()
    db.close()

    print("DB Seeded ✅")
