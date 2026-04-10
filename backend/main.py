from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import products, payment, orders

app = FastAPI()

# ✅ VERY IMPORTANT (FIXES YOUR ERROR)
origins = [
    "https://website-nj7s7gu1g-mainframecoders-projects.vercel.app",
    "https://*.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 🔥 allow all (safe for now)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(products.router)
app.include_router(payment.router)
app.include_router(orders.router)

@app.get("/")
def home():
    return {"status": "running"}
