from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models import User
from passlib.hash import bcrypt

router = APIRouter()


@router.post("/register")
def register(data: dict):
    db = SessionLocal()

    if db.query(User).filter(User.email == data["email"]).first():
        raise HTTPException(400, "User exists")

    user = User(
        email=data["email"],
        password=bcrypt.hash(data["password"])
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

    return {"access_token": "ok"}
