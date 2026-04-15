from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import products, payment, orders

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"msg": "API running"}

app.include_router(products.router, prefix="/products")
app.include_router(payment.router, prefix="/payment")
app.include_router(orders.router, prefix="/orders")
