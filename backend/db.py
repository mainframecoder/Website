# ---------------- PRODUCTS (50 ITEMS) ---------------- #

PRODUCTS = {}

names = [
    "T-Shirt", "Jeans", "Hoodie", "Sneakers",
    "Jacket", "Cap", "Watch", "Shirt",
    "Shorts", "Sweatshirt"
]

categories = ["clothing", "footwear", "accessories"]

for i in range(1, 51):
    PRODUCTS[i] = {
        "id": i,
        "name": f"{names[i % len(names)]} {i}",
        "price": 20 + (i % 10) * 10,   # prices from 20 → 110
        "category": categories[i % len(categories)]
    }

# ---------------- ORDERS ---------------- #

ORDERS = {}
