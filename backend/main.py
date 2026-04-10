from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import products, orders, payment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # keep * for now
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/products")
app.include_router(orders.router, prefix="/orders")
app.include_router(payment.router, prefix="/payment")

@app.get("/")
def home():
    return {"msg": "API running"}
