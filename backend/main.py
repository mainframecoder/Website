from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter, Request
import stripe
import os

app = FastAPI()

# =========================
# 🔥 CORS (VERY IMPORTANT)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🔥 STRIPE SETUP
# =========================
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "https://your-vercel-url.vercel.app"
)

# =========================
# 🔥 PRODUCTS ROUTE
# =========================
products_router = APIRouter(prefix="/products")

PRODUCTS = [
    {
        "id": 1,
        "name": "Classic T-Shirt",
        "price": 25,
        "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },
    {
        "id": 2,
        "name": "Blue Jeans",
        "price": 60,
        "image": "https://images.unsplash.com/photo-1514996937319-344454492b37"
    },
    {
        "id": 3,
        "name": "Black Hoodie",
        "price": 45,
        "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7"
    },
    {
        "id": 4,
        "name": "Running Sneakers",
        "price": 90,
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
        "id": 5,
        "name": "Denim Jacket",
        "price": 120,
        "image": "https://images.unsplash.com/photo-1520975922284-9e0f1c1d3a73"
    },
    {
        "id": 6,
        "name": "Formal Shirt",
        "price": 50,
        "image": "https://images.unsplash.com/photo-1521334884684-d80222895322"
    },
    {
        "id": 7,
        "name": "Casual Shorts",
        "price": 35,
        "image": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7"
    },
    {
        "id": 8,
        "name": "Leather Belt",
        "price": 40,
        "image": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7"
    },
    {
        "id": 9,
        "name": "Stylish Watch",
        "price": 150,
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
        "id": 10,
        "name": "Cap",
        "price": 20,
        "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad"
    },
]

@products_router.get("/")
def get_products():
    return PRODUCTS


# =========================
# 🔥 PAYMENT ROUTE
# =========================
payment_router = APIRouter(prefix="/payment")

@payment_router.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    try:
        data = await request.json()
        cart = data.get("cart", [])

        if not cart:
            return {"error": "Cart is empty"}

        line_items = []

        for item in cart:
            line_items.append({
                "price_data": {
                    "currency": "cad",
                    "product_data": {
                        "name": item["name"],
                    },
                    "unit_amount": int(item["price"] * 100),
                },
                "quantity": item["qty"],
            })

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{FRONTEND_URL}/success.html",
            cancel_url=f"{FRONTEND_URL}",
        )

        return {"url": session.url}

    except Exception as e:
        print("ERROR:", str(e))
        return {"error": str(e)}


# =========================
# 🔥 ORDERS (BASIC)
# =========================
orders_router = APIRouter(prefix="/orders")

ORDERS = []

@orders_router.post("/")
async def create_order(request: Request):
    data = await request.json()

    order = {
        "id": len(ORDERS) + 1,
        "items": data.get("cart", []),
        "address": data.get("address"),
        "status": "Processing"
    }

    ORDERS.append(order)

    return order

@orders_router.get("/{order_id}")
def get_order(order_id: int):
    for o in ORDERS:
        if o["id"] == order_id:
            return o
    return {"error": "Order not found"}


# =========================
# 🔥 INCLUDE ROUTES
# =========================
app.include_router(products_router)
app.include_router(payment_router)
app.include_router(orders_router)

# =========================
# 🔥 HEALTH CHECK
# =========================
@app.get("/")
def home():
    return {"status": "running"}
