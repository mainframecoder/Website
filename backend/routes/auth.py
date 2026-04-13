from fastapi import APIRouter, HTTPException
from db import USERS
from models import User

router = APIRouter()

@router.post("/register")
def register(user: User):
    if user.email in USERS:
        raise HTTPException(400, "User already exists")

    USERS[user.email] = user.password
    return {"msg": "Registered successfully"}

@router.post("/login")
def login(user: User):
    if USERS.get(user.email) != user.password:
        raise HTTPException(401, "Invalid credentials")

    return {"msg": "Login success"}
