from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)

    variants = relationship("Variant", back_populates="product")


class Variant(Base):
    __tablename__ = "variants"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"))

    color = Column(String)
    size = Column(String)
    price = Column(Float)
    image = Column(String)

    product = relationship("Product", back_populates="variants")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    total = Column(Float)
    status = Column(String, default="placed")
    items = Column(Text)
