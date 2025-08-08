from beanie import Document, Indexed
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class PostType(str, Enum):
    OUTFIT = "outfit"
    STYLE_TIP = "style_tip"
    TREND = "trend"
    COLLECTION = "collection"

class ProductReference(BaseModel):
    product_id: str
    product_name: str
    boutique_name: str
    price: float
    image_url: str
    position: Optional[dict] = None  # x, y coordinates on image for hotspot

class InspirationPost(Document):
    # Basic Information
    title: str
    title_ar: Optional[str] = None
    description: str
    description_ar: Optional[str] = None
    
    # Creator
    creator_id: Indexed(str)  # Can be user, boutique, or admin
    creator_type: str  # user, boutique, admin
    
    # Content
    post_type: PostType = PostType.OUTFIT
    main_image: str
    additional_images: List[str] = []
    
    # Product References
    featured_products: List[ProductReference] = []
    
    # Categories & Tags
    style_tags: List[str] = []  # casual, formal, street, vintage, etc.
    occasion_tags: List[str] = []  # work, party, wedding, daily, etc.
    season_tags: List[str] = []  # spring, summer, fall, winter
    color_tags: List[str] = []
    
    # Social Metrics
    likes: int = 0
    saves: int = 0  # How many times saved to personal inspiration
    shares: int = 0
    comments_count: int = 0
    
    # Engagement
    views: int = 0
    click_through_rate: float = 0.0  # CTR to products
    
    # Visibility & Status
    is_featured: bool = False
    is_trending: bool = False
    is_public: bool = True
    is_approved: bool = True
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    featured_until: Optional[datetime] = None
    
    class Settings:
        name = "inspiration_posts"
        indexes = [
            "creator_id",
            "creator_type",
            "post_type",
            "style_tags",
            "occasion_tags",
            "season_tags",
            "is_featured",
            "is_trending",
            "is_public",
            "likes",
            "saves",
            "views",
            "created_at"
        ]
    
    def add_view(self):
        """Increment view count"""
        self.views += 1
    
    def add_like(self):
        """Increment like count"""
        self.likes += 1
    
    def remove_like(self):
        """Decrement like count"""
        if self.likes > 0:
            self.likes -= 1
    
    def add_save(self):
        """Increment save count"""
        self.saves += 1
    
    def remove_save(self):
        """Decrement save count"""
        if self.saves > 0:
            self.saves -= 1
    
    def calculate_engagement_score(self) -> float:
        """Calculate engagement score based on likes, saves, shares, CTR"""
        if self.views == 0:
            return 0.0
        
        # Weighted engagement score
        engagement = (
            (self.likes * 1.0) +
            (self.saves * 2.0) +  # Saves are more valuable
            (self.shares * 3.0) +  # Shares are most valuable
            (self.click_through_rate * 100)  # CTR bonus
        )
        
        return engagement / self.views if self.views > 0 else 0.0
    
    @property
    def total_products(self) -> int:
        """Get total number of featured products"""
        return len(self.featured_products)
    
    @property
    def price_range(self) -> Optional[tuple]:
        """Get price range of featured products"""
        if not self.featured_products:
            return None
        
        prices = [product.price for product in self.featured_products]
        return (min(prices), max(prices))
