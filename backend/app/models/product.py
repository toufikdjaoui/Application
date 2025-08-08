from beanie import Document, Indexed
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class ProductStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    OUT_OF_STOCK = "out_of_stock"

class ProductCondition(str, Enum):
    NEW = "new"
    USED_LIKE_NEW = "used_like_new"
    USED_GOOD = "used_good"
    USED_FAIR = "used_fair"

class Size(BaseModel):
    size: str  # XS, S, M, L, XL, etc.
    stock: int = 0
    price_adjustment: float = 0.0  # Additional cost for this size

class Color(BaseModel):
    name: str
    color_code: str  # Hex color code
    images: List[str] = []  # Specific images for this color
    sizes: List[Size] = []

class ProductVariant(BaseModel):
    sku: str
    color: Optional[str] = None
    size: Optional[str] = None
    stock: int = 0
    price: float
    sale_price: Optional[float] = None
    images: List[str] = []

class ShippingDetails(BaseModel):
    weight: Optional[float] = None  # in kg
    dimensions: Optional[Dict[str, float]] = None  # width, height, depth in cm
    shipping_cost: Optional[float] = None
    free_shipping: bool = False

class SEO(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: List[str] = []

class Product(Document):
    # Basic Information
    name: str
    name_ar: Optional[str] = None  # Arabic name
    slug: Indexed(str, unique=True)
    description: str
    description_ar: Optional[str] = None  # Arabic description
    
    # Boutique
    boutique_id: Indexed(str)
    boutique_name: str
    
    # Categories & Tags
    category: Indexed(str)
    subcategory: Optional[str] = None
    tags: List[str] = []
    
    # Brand
    brand: Optional[str] = None
    model: Optional[str] = None
    
    # Pricing
    base_price: float
    sale_price: Optional[float] = None
    currency: str = "DZD"
    
    # Variants & Stock
    variants: List[ProductVariant] = []
    colors: List[Color] = []
    total_stock: int = 0
    min_stock_alert: int = 5
    
    # Product Details
    condition: ProductCondition = ProductCondition.NEW
    material: Optional[str] = None
    care_instructions: Optional[str] = None
    
    # Images & Media
    main_image: str
    images: List[str] = []
    video_url: Optional[str] = None
    
    # Shipping
    shipping_details: ShippingDetails = ShippingDetails()
    
    # Status & Visibility
    status: ProductStatus = ProductStatus.ACTIVE
    is_featured: bool = False
    is_trending: bool = False
    
    # SEO
    seo: SEO = SEO()
    
    # Statistics
    views: int = 0
    likes: int = 0
    rating: float = 0.0
    rating_count: int = 0
    sales_count: int = 0
    
    # Dates
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "products"
        indexes = [
            "name",
            "slug", 
            "boutique_id",
            "category",
            "subcategory",
            "brand",
            "status",
            "base_price",
            "is_featured",
            "is_trending",
            "rating",
            "sales_count",
            "created_at",
            [("name", "text"), ("description", "text"), ("tags", "text")]  # Text search
        ]
    
    @property
    def current_price(self) -> float:
        """Get current selling price"""
        return self.sale_price if self.sale_price else self.base_price
    
    @property
    def discount_percentage(self) -> Optional[float]:
        """Calculate discount percentage"""
        if self.sale_price and self.sale_price < self.base_price:
            return round(((self.base_price - self.sale_price) / self.base_price) * 100, 1)
        return None
    
    @property
    def is_on_sale(self) -> bool:
        """Check if product is on sale"""
        return self.sale_price is not None and self.sale_price < self.base_price
    
    @property
    def is_in_stock(self) -> bool:
        """Check if product is in stock"""
        return self.total_stock > 0
    
    def update_rating(self, new_rating: float):
        """Update product rating"""
        total_points = self.rating * self.rating_count + new_rating
        self.rating_count += 1
        self.rating = round(total_points / self.rating_count, 2)
    
    def add_view(self):
        """Increment view count"""
        self.views += 1
    
    def get_available_sizes(self, color: Optional[str] = None) -> List[str]:
        """Get available sizes for a specific color or all colors"""
        available_sizes = set()
        
        if color:
            color_obj = next((c for c in self.colors if c.name == color), None)
            if color_obj:
                available_sizes.update(s.size for s in color_obj.sizes if s.stock > 0)
        else:
            for color_obj in self.colors:
                available_sizes.update(s.size for s in color_obj.sizes if s.stock > 0)
        
        return list(available_sizes)
    
    def get_price_for_variant(self, color: Optional[str] = None, size: Optional[str] = None) -> float:
        """Get price for specific variant"""
        # Find variant
        variant = next(
            (v for v in self.variants if v.color == color and v.size == size),
            None
        )
        
        if variant:
            return variant.sale_price if variant.sale_price else variant.price
        
        # Fallback to base price with size adjustment
        if color and size:
            color_obj = next((c for c in self.colors if c.name == color), None)
            if color_obj:
                size_obj = next((s for s in color_obj.sizes if s.size == size), None)
                if size_obj:
                    return self.current_price + size_obj.price_adjustment
        
        return self.current_price
