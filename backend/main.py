from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import products, auth, orders, payment
from database import Base, engine

app = FastAPI()

# 🔥 CREATE TABLES
Base.metadata.create_all(bind=engine)

# 🔥 FORCE CORS (temporary open)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API running 🚀"}

app.include_router(products.router, prefix="/products")
app.include_router(auth.router, prefix="/auth")
app.include_router(orders.router, prefix="/orders")
app.include_router(payment.router, prefix="/payment")
