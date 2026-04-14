from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

from routes import products, auth, payment, orders

app = FastAPI()

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(products.router, prefix="/products")
app.include_router(auth.router, prefix="/auth")
app.include_router(payment.router, prefix="/payment")
app.include_router(orders.router, prefix="/orders")

@app.get("/")
def root():
    return {"status": "ok"}
