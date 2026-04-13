from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from db import ORDERS
from reportlab.pdfgen import canvas

router = APIRouter()

@router.get("/{order_id}")
def get_order(order_id: str):
    order = ORDERS.get(order_id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order


# USER ORDER HISTORY
@router.get("/user/{email}")
def get_user_orders(email: str):
    return [o for o in ORDERS.values() if o.get("email") == email]


# INVOICE PDF
@router.get("/invoice/{order_id}")
def invoice(order_id: str):
    order = ORDERS.get(order_id)

    if not order:
        raise HTTPException(404, "Order not found")

    file = f"invoice_{order_id}.pdf"

    c = canvas.Canvas(file)
    c.drawString(100, 800, f"Order ID: {order_id}")
    c.drawString(100, 780, f"Total: ${order['total']}")
    c.drawString(100, 760, f"Status: {order['status']}")

    y = 720
    for item in order["items"]:
        c.drawString(100, y, f"Product {item['id']} x {item['qty']}")
        y -= 20

    c.save()

    return FileResponse(file, filename=file)
