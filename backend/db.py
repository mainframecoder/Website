# ================= PRODUCTS ================= #

PRODUCTS = {}

def img(url):
    return url + "&auto=format"

IMAGES = {
    "clothing": [
        img("https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"),
        img("https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"),
        img("https://images.unsplash.com/photo-1520975922324-6c7c7b2b3c0f?w=500")
    ],
    "footwear": [
        img("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"),
        img("https://images.unsplash.com/photo-1528701800489-20be3c3e9c7e?w=500")
    ],
    "accessories": [
        img("https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500"),
        img("https://images.unsplash.com/photo-1519741497674-611481863552?w=500")
    ]
}

names = ["T-Shirt", "Jeans", "Hoodie", "Sneakers", "Jacket", "Cap", "Watch"]

for i in range(1, 51):
    category = ["clothing", "footwear", "accessories"][i % 3]
    imgs = IMAGES[category]

    PRODUCTS[i] = {
        "id": i,
        "name": f"{names[i % len(names)]} {i}",
        "price": 20 + (i * 5),
        "category": category,

        "image": imgs[0],
        "images": imgs,

        "description": "Premium product. Stylish and durable.",
        "sizes": ["S", "M", "L"],
        "colors": ["Black", "Blue", "Red"]
    }

# ================= ORDERS ================= #
ORDERS = []

# ================= USERS ================= #
USERS = {}
