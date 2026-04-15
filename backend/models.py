from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    domain = Column(String)

    users = relationship("User", back_populates="store")
    products = relationship("Product", back_populates="store")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)
    store_id = Column(Integer, ForeignKey("stores.id"))

    store = relationship("Store", back_populates="users")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    store_id = Column(Integer, ForeignKey("stores.id"))

    store = relationship("Store", back_populates="products")
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


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    total = Column(Float)
