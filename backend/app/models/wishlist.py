from beanie import Document, Indexed
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class WishlistPrivacy(str, Enum):
    PRIVATE = "private"
    PUBLIC = "public"
    FRIENDS_ONLY = "friends_only"

class WishlistItem(BaseModel):
    product_id: str
    added_at: datetime = Field(default_factory=datetime.utcnow)
    notes: Optional[str] = None
    priority: int = 0  # 0=normal, 1=high, 2=urgent
    
    # Variant preferences
    preferred_color: Optional[str] = None
    preferred_size: Optional[str] = None

class Wishlist(Document):
    # Basic Information
    name: str
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    
    # Owner
    owner_id: Indexed(str)
    
    # Privacy & Sharing
    privacy: WishlistPrivacy = WishlistPrivacy.PRIVATE
    is_shareable: bool = True
    share_code: Optional[str] = None  # Unique code for sharing
    
    # Items
    items: List[WishlistItem] = []
    
    # Social Features
    followers: List[str] = []  # User IDs following this wishlist
    likes: int = 0
    
    # Metadata
    is_default: bool = False  # User's default wishlist
    category: Optional[str] = None  # e.g., "Wedding", "Birthday", "Summer"
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "wishlists"
        indexes = [
            "owner_id",
            "privacy",
            "share_code",
            "is_default",
            "created_at"
        ]
    
    def add_item(self, product_id: str, notes: Optional[str] = None, 
                 priority: int = 0, preferred_color: Optional[str] = None,
                 preferred_size: Optional[str] = None) -> bool:
        """Add item to wishlist"""
        # Check if item already exists
        if any(item.product_id == product_id for item in self.items):
            return False
        
        self.items.append(WishlistItem(
            product_id=product_id,
            notes=notes,
            priority=priority,
            preferred_color=preferred_color,
            preferred_size=preferred_size
        ))
        self.updated_at = datetime.utcnow()
        return True
    
    def remove_item(self, product_id: str) -> bool:
        """Remove item from wishlist"""
        original_length = len(self.items)
        self.items = [item for item in self.items if item.product_id != product_id]
        
        if len(self.items) < original_length:
            self.updated_at = datetime.utcnow()
            return True
        return False
    
    def get_item(self, product_id: str) -> Optional[WishlistItem]:
        """Get specific item from wishlist"""
        return next((item for item in self.items if item.product_id == product_id), None)
    
    @property
    def item_count(self) -> int:
        """Get number of items in wishlist"""
        return len(self.items)
    
    def generate_share_code(self) -> str:
        """Generate unique share code"""
        import secrets
        import string
        
        if not self.share_code:
            alphabet = string.ascii_letters + string.digits
            self.share_code = ''.join(secrets.choice(alphabet) for _ in range(8))
        return self.share_code
