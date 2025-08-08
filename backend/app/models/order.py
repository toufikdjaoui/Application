from beanie import Document, Indexed
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentMethod(str, Enum):
    CASH_ON_DELIVERY = "cash_on_delivery"
    CIB = "cib"
    EDAHABIA = "edahabia"
    BANK_TRANSFER = "bank_transfer"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class DeliveryMethod(str, Enum):
    HOME_DELIVERY = "home_delivery"
    PICKUP_POINT = "pickup_point"
    BOUTIQUE_PICKUP = "boutique_pickup"

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    product_image: str
    boutique_id: str
    boutique_name: str
    
    # Variant details
    color: Optional[str] = None
    size: Optional[str] = None
    sku: Optional[str] = None
    
    # Pricing
    unit_price: float
    quantity: int
    total_price: float
    
    # Status (for partial shipments)
    status: OrderStatus = OrderStatus.PENDING

class ShippingAddress(BaseModel):
    first_name: str
    last_name: str
    phone: str
    email: Optional[str] = None
    street: str
    city: str
    state: str
    postal_code: str
    country: str = "Algeria"
    additional_info: Optional[str] = None

class PaymentInfo(BaseModel):
    method: PaymentMethod
    status: PaymentStatus = PaymentStatus.PENDING
    transaction_id: Optional[str] = None
    payment_date: Optional[datetime] = None
    amount: float
    fees: float = 0.0

class TrackingInfo(BaseModel):
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    tracking_url: Optional[str] = None
    
class StatusHistory(BaseModel):
    status: OrderStatus
    timestamp: datetime
    notes: Optional[str] = None
    updated_by: Optional[str] = None  # User ID who updated

class Order(Document):
    # Order Identification
    order_number: Indexed(str, unique=True)
    
    # Customer Information
    customer_id: Indexed(str)
    customer_email: str
    customer_phone: str
    
    # Order Items
    items: List[OrderItem]
    
    # Pricing
    subtotal: float
    shipping_cost: float = 0.0
    tax: float = 0.0
    discount: float = 0.0
    total_amount: float
    
    # Shipping & Delivery
    shipping_address: ShippingAddress
    delivery_method: DeliveryMethod = DeliveryMethod.HOME_DELIVERY
    delivery_notes: Optional[str] = None
    
    # Payment
    payment_info: PaymentInfo
    
    # Status & Tracking
    status: OrderStatus = OrderStatus.PENDING
    status_history: List[StatusHistory] = []
    tracking_info: Optional[TrackingInfo] = None
    
    # Special Instructions
    special_instructions: Optional[str] = None
    gift_message: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    confirmed_at: Optional[datetime] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    
    class Settings:
        name = "orders"
        indexes = [
            "order_number",
            "customer_id",
            "status",
            "payment_info.method",
            "payment_info.status",
            "delivery_method",
            "created_at",
            "total_amount"
        ]
    
    def add_status_update(self, new_status: OrderStatus, notes: Optional[str] = None, updated_by: Optional[str] = None):
        """Add status update to history"""
        self.status = new_status
        self.status_history.append(StatusHistory(
            status=new_status,
            timestamp=datetime.utcnow(),
            notes=notes,
            updated_by=updated_by
        ))
        
        # Update specific timestamps
        if new_status == OrderStatus.CONFIRMED:
            self.confirmed_at = datetime.utcnow()
        elif new_status == OrderStatus.SHIPPED:
            self.shipped_at = datetime.utcnow()
        elif new_status == OrderStatus.DELIVERED:
            self.delivered_at = datetime.utcnow()
    
    def calculate_total(self):
        """Recalculate order total"""
        self.subtotal = sum(item.total_price for item in self.items)
        self.total_amount = self.subtotal + self.shipping_cost + self.tax - self.discount
    
    def get_boutiques(self) -> List[str]:
        """Get list of unique boutique IDs in this order"""
        return list(set(item.boutique_id for item in self.items))
    
    def get_items_by_boutique(self, boutique_id: str) -> List[OrderItem]:
        """Get order items for specific boutique"""
        return [item for item in self.items if item.boutique_id == boutique_id]
    
    @property
    def can_be_cancelled(self) -> bool:
        """Check if order can be cancelled"""
        return self.status in [OrderStatus.PENDING, OrderStatus.CONFIRMED]
    
    @property
    def is_paid(self) -> bool:
        """Check if order is paid"""
        return self.payment_info.status == PaymentStatus.COMPLETED
    
    @property
    def days_since_order(self) -> int:
        """Get number of days since order was placed"""
        return (datetime.utcnow() - self.created_at).days
