from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import payment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payment.router, prefix="/payment")

@app.get("/")
def home():
    return {"msg": "Backend running"}
