from beanie import Document, Indexed
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class BoutiqueStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    SUSPENDED = "suspended"
    REJECTED = "rejected"

class BoutiqueType(str, Enum):
    LOCAL = "local"
    INTERNATIONAL = "international"

class BusinessHours(BaseModel):
    day: str  # monday, tuesday, etc.
    open_time: str  # "09:00"
    close_time: str  # "18:00"
    is_open: bool = True

class SocialMedia(BaseModel):
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    tiktok: Optional[str] = None
    website: Optional[str] = None

class ShippingInfo(BaseModel):
    free_shipping_threshold: Optional[float] = None
    shipping_cost: float = 0.0
    delivery_time_days: int = 3
    cities_served: List[str] = []
    international_shipping: bool = False

class Boutique(Document):
    # Basic Information
    name: Indexed(str, unique=True)
    slug: Indexed(str, unique=True)
    description: str
    logo: Optional[str] = None
    banner: Optional[str] = None
    
    # Owner Information
    owner_id: Indexed(str)  # User ID
    contact_email: str
    contact_phone: str
    
    # Business Details
    business_type: BoutiqueType = BoutiqueType.LOCAL
    business_license: Optional[str] = None
    tax_number: Optional[str] = None
    
    # Address
    address: str
    city: str
    state: str
    country: str = "Algeria"
    
    # Status & Verification
    status: BoutiqueStatus = BoutiqueStatus.PENDING
    is_verified: bool = False
    verification_date: Optional[datetime] = None
    
    # Business Hours
    business_hours: List[BusinessHours] = []
    
    # Social Media & Website
    social_media: SocialMedia = SocialMedia()
    
    # Shipping & Delivery
    shipping_info: ShippingInfo = ShippingInfo()
    
    # Statistics
    total_products: int = 0
    total_orders: int = 0
    total_revenue: float = 0.0
    rating: float = 0.0
    rating_count: int = 0
    
    # Categories this boutique sells
    categories: List[str] = []
    
    # Subscription & Payment
    subscription_plan: str = "free"  # free, premium, pro
    commission_rate: float = 0.05  # 5% default
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "boutiques"
        indexes = [
            "name",
            "slug",
            "owner_id",
            "status",
            "business_type",
            "city",
            "categories",
            "rating",
            "created_at"
        ]
    
    def update_rating(self, new_rating: float):
        """Update boutique rating"""
        total_points = self.rating * self.rating_count + new_rating
        self.rating_count += 1
        self.rating = round(total_points / self.rating_count, 2)
    
    def is_open_now(self) -> bool:
        """Check if boutique is currently open"""
        from datetime import datetime
        now = datetime.now()
        current_day = now.strftime("%A").lower()
        current_time = now.strftime("%H:%M")
        
        for hours in self.business_hours:
            if (hours.day == current_day and 
                hours.is_open and 
                hours.open_time <= current_time <= hours.close_time):
                return True
        return False
