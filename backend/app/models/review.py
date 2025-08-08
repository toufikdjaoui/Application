from beanie import Document, Indexed
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ReviewImages(BaseModel):
    url: str
    caption: Optional[str] = None

class Review(Document):
    # Basic Information
    product_id: Indexed(str)
    customer_id: Indexed(str)
    order_id: Optional[str] = None  # Link to order if applicable
    
    # Review Content
    rating: int = Field(..., ge=1, le=5)  # 1-5 stars
    title: Optional[str] = None
    comment: str
    comment_ar: Optional[str] = None  # Arabic comment
    
    # Additional Details
    images: List[ReviewImages] = []
    
    # Product Variant Details (what was actually purchased)
    color: Optional[str] = None
    size: Optional[str] = None
    
    # Helpful metrics
    helpful_count: int = 0
    not_helpful_count: int = 0
    
    # Moderation
    is_verified_purchase: bool = False
    is_approved: bool = True
    is_featured: bool = False
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "reviews"
        indexes = [
            "product_id",
            "customer_id", 
            "rating",
            "is_approved",
            "is_verified_purchase",
            "created_at"
        ]
    
    @property
    def helpfulness_ratio(self) -> float:
        """Calculate helpfulness ratio"""
        total_votes = self.helpful_count + self.not_helpful_count
        if total_votes == 0:
            return 0.0
        return self.helpful_count / total_votes
