from fastapi import FastAPI
from database import Base, engine
from routes import products, auth, orders, payment

app = FastAPI()

# create tables

app.include_router(products.router, prefix="/products")
app.include_router(auth.router, prefix="/auth")
app.include_router(orders.router, prefix="/orders")
app.include_router(payment.router, prefix="/payment")

@app.get("/")
def root():
    return {"status": "ok"}
