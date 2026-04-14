from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔥 IMPORT ROUTES
from routes import products, auth, orders, payment

app = FastAPI()

# ================= CORS FIX ================= #
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://website99998.netlify.app",  # your frontend
        "http://localhost:3000",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= HEALTH CHECK ================= #
@app.get("/")
def home():
    return {"message": "API running 🚀"}

# ================= ROUTES ================= #
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(payment.router, prefix="/payment", tags=["Payment"])
