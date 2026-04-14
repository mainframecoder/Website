import stripe
from fastapi import APIRouter

stripe.api_key = "sk_test"

router = APIRouter()

@router.post("/create-checkout-session")
def checkout():
    return {"url": "https://checkout.stripe.com"}
