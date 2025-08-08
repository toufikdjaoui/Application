from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    CUSTOMER = "customer"
    MERCHANT = "merchant"
    ADMIN = "admin"

class UserPreferences(BaseModel):
    language: str = "fr"  # fr or ar
    size: Optional[str] = None
    preferred_colors: List[str] = []
    preferred_styles: List[str] = []
    budget_range: Optional[tuple] = None
    notifications_enabled: bool = True

class Address(BaseModel):
    street: str
    city: str
    state: str
    postal_code: str
    country: str = "Algeria"
    is_default: bool = False

class User(Document):
    # Basic Information
    email: Indexed(EmailStr, unique=True)
    password_hash: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    
    # Profile
    avatar: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None  # male, female, other
    
    # Account
    role: UserRole = UserRole.CUSTOMER
    is_active: bool = True
    is_verified: bool = False
    verification_token: Optional[str] = None
    
    # Preferences
    preferences: UserPreferences = UserPreferences()
    
    # Addresses
    addresses: List[Address] = []
    
    # Shopping
    wishlist_ids: List[str] = []
    recent_searches: List[str] = []
    viewed_products: List[str] = []
    
    # Social
    followers: List[str] = []
    following: List[str] = []
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Settings:
        name = "users"
        indexes = [
            "email",
            "role", 
            "is_active",
            "created_at"
        ]
    
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
    def get_default_address(self) -> Optional[Address]:
        for address in self.addresses:
            if address.is_default:
                return address
        return self.addresses[0] if self.addresses else None
