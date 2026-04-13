# ================= PRODUCTS ================= #

PRODUCTS = {}

IMAGES = {
    "clothing": [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        "https://images.unsplash.com/photo-1520975922324-6c7c7b2b3c0f?w=500"
    ],
    "footwear": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        "https://images.unsplash.com/photo-1528701800489-20be3c3e9c7e?w=500"
    ],
    "accessories": [
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=500"
    ]
}

names = ["T-Shirt", "Jeans", "Hoodie", "Sneakers", "Jacket", "Cap", "Watch"]

# 🔥 GENERATE 50 PRODUCTS
for i in range(1, 51):
    category = ["clothing", "footwear", "accessories"][i % 3]
    image = IMAGES[category][i % len(IMAGES[category])]
    name = f"{names[i % len(names)]} {i}"

    PRODUCTS[i] = {
        "id": i,
        "name": name,
        "price": 20 + (i * 5),
        "category": category,

        # ✅ MAIN IMAGE
        "image": image,

        # ✅ MULTIPLE IMAGES (FOR PRODUCT PAGE)
        "images": [
            image,
            IMAGES[category][(i + 1) % len(IMAGES[category])],
            IMAGES[category][(i + 2) % len(IMAGES[category])]
        ],

        # ✅ EXTRA DETAILS (NEW)
        "description": "Premium quality product. Comfortable, stylish, and durable.",
        "sizes": ["S", "M", "L"]
    }

# ================= ORDERS ================= #

ORDERS = []

# ================= USERS ================= #

USERS = {}
