from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

from app.models.order import OrderStatus, PaymentMethod, PaymentStatus, DeliveryMethod

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(..., ge=1)
    color: Optional[str] = None
    size: Optional[str] = None
    sku: Optional[str] = None

class ShippingAddressCreate(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    phone: str = Field(..., min_length=10)
    email: Optional[str] = None
    street: str = Field(..., min_length=5)
    city: str = Field(..., min_length=2)
    state: str = Field(..., min_length=2)
    postal_code: str
    country: str = "Algeria"
    additional_info: Optional[str] = None

class PaymentInfoCreate(BaseModel):
    method: PaymentMethod
    transaction_id: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItemCreate] = Field(..., min_items=1)
    shipping_address: ShippingAddressCreate
    delivery_method: DeliveryMethod = DeliveryMethod.HOME_DELIVERY
    delivery_notes: Optional[str] = None
    payment_info: PaymentInfoCreate
    special_instructions: Optional[str] = None
    gift_message: Optional[str] = None
    
    @validator("items")
    def validate_items(cls, v):
        if not v:
            raise ValueError("Au moins un article est requis")
        return v

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    delivery_notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    product_id: str
    product_name: str
    product_image: str
    boutique_id: str
    boutique_name: str
    color: Optional[str]
    size: Optional[str]
    sku: Optional[str]
    unit_price: float
    quantity: int
    total_price: float
    status: OrderStatus

class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer_id: str
    customer_email: str
    items: List[OrderItemResponse]
    subtotal: float
    shipping_cost: float
    tax: float
    discount: float
    total_amount: float
    shipping_address: dict
    delivery_method: DeliveryMethod
    payment_info: dict
    status: OrderStatus
    tracking_info: Optional[dict]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class OrderListResponse(BaseModel):
    orders: List[OrderResponse]
    total: int
    page: int
    size: int
    total_pages: int

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    notes: Optional[str] = None

class CartItem(BaseModel):
    product_id: str
    quantity: int = Field(..., ge=1)
    color: Optional[str] = None
    size: Optional[str] = None

class CartResponse(BaseModel):
    items: List[dict]
    total_items: int
    subtotal: float
    shipping_cost: float
    tax: float
    total_amount: float

class OrderSummary(BaseModel):
    total_orders: int
    pending_orders: int
    completed_orders: int
    total_revenue: float
    recent_orders: List[OrderResponse]
