from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import products, orders, payment

app = FastAPI()

# ✅ CORS FIX (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://website-pxrk46uki-mainframecoders-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROUTES
app.include_router(products.router, prefix="/products")
app.include_router(orders.router, prefix="/orders")
app.include_router(payment.router, prefix="/payment")

# ✅ HEALTH CHECK
@app.get("/")
def home():
    return {"msg": "API running"}
