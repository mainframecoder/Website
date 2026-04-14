from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models import User
from passlib.hash import bcrypt
from jose import jwt

SECRET = "SECRET_KEY"

router = APIRouter()

@router.post("/register")
def register(data: dict):
    db = SessionLocal()

    if db.query(User).filter(User.email == data["email"]).first():
        raise HTTPException(400, "User exists")

    user = User(
        email=data["email"],
        password=bcrypt.hash(data["password"]),
        store_id=1
    )

    db.add(user)
    db.commit()

    return {"msg": "Registered"}


@router.post("/login")
def login(data: dict):
    db = SessionLocal()

    user = db.query(User).filter(User.email == data["email"]).first()

    if not user or not bcrypt.verify(data["password"], user.password):
        raise HTTPException(401, "Invalid")

    token = jwt.encode({"email": user.email, "store_id": user.store_id}, SECRET)

    return {"token": token}
