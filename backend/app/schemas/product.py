from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict
from enum import Enum

class ProductCondition(str, Enum):
    NEW = "new"
    USED_LIKE_NEW = "used_like_new"
    USED_GOOD = "used_good"
    USED_FAIR = "used_fair"

class ProductStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    OUT_OF_STOCK = "out_of_stock"

class SizeCreate(BaseModel):
    size: str
    stock: int = 0
    price_adjustment: float = 0.0

class ColorCreate(BaseModel):
    name: str
    color_code: str
    images: List[str] = []
    sizes: List[SizeCreate] = []

class ProductVariantCreate(BaseModel):
    sku: str
    color: Optional[str] = None
    size: Optional[str] = None
    stock: int = 0
    price: float
    sale_price: Optional[float] = None
    images: List[str] = []

class ShippingDetailsCreate(BaseModel):
    weight: Optional[float] = None
    dimensions: Optional[Dict[str, float]] = None
    shipping_cost: Optional[float] = None
    free_shipping: bool = False

class SEOCreate(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: List[str] = []

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    name_ar: Optional[str] = None
    description: str = Field(..., min_length=10)
    description_ar: Optional[str] = None
    
    # Required fields
    boutique_id: str
    category: str
    base_price: float = Field(..., gt=0)
    main_image: str
    
    # Optional fields
    subcategory: Optional[str] = None
    tags: List[str] = []
    brand: Optional[str] = None
    model: Optional[str] = None
    sale_price: Optional[float] = None
    currency: str = "DZD"
    
    # Variants & Stock
    variants: List[ProductVariantCreate] = []
    colors: List[ColorCreate] = []
    total_stock: int = 0
    min_stock_alert: int = 5
    
    # Product Details
    condition: ProductCondition = ProductCondition.NEW
    material: Optional[str] = None
    care_instructions: Optional[str] = None
    
    # Images & Media
    images: List[str] = []
    video_url: Optional[str] = None
    
    # Shipping
    shipping_details: ShippingDetailsCreate = ShippingDetailsCreate()
    
    # Status
    status: ProductStatus = ProductStatus.ACTIVE
    is_featured: bool = False
    is_trending: bool = False
    
    # SEO
    seo: SEOCreate = SEOCreate()
    
    @validator("sale_price")
    def validate_sale_price(cls, v, values):
        if v is not None and "base_price" in values and v >= values["base_price"]:
            raise ValueError("Sale price must be less than base price")
        return v

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    tags: Optional[List[str]] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    base_price: Optional[float] = None
    sale_price: Optional[float] = None
    total_stock: Optional[int] = None
    condition: Optional[ProductCondition] = None
    material: Optional[str] = None
    care_instructions: Optional[str] = None
    status: Optional[ProductStatus] = None
    is_featured: Optional[bool] = None
    is_trending: Optional[bool] = None

class ProductFilters(BaseModel):
    category: Optional[str] = None
    subcategory: Optional[str] = None
    boutique_id: Optional[str] = None
    brand: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    color: Optional[str] = None
    size: Optional[str] = None
    condition: Optional[ProductCondition] = None
    status: Optional[ProductStatus] = ProductStatus.ACTIVE
    is_featured: Optional[bool] = None
    is_trending: Optional[bool] = None
    in_stock_only: bool = True
    search: Optional[str] = None

class ProductSort(str, Enum):
    RELEVANCE = "relevance"
    PRICE_ASC = "price_asc"
    PRICE_DESC = "price_desc"
    NEWEST = "newest"
    OLDEST = "oldest"
    POPULARITY = "popularity"
    RATING = "rating"
    SALES = "sales"

class ProductListParams(BaseModel):
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)
    sort: ProductSort = ProductSort.RELEVANCE
    filters: ProductFilters = ProductFilters()

class ProductResponse(BaseModel):
    id: str
    name: str
    name_ar: Optional[str]
    slug: str
    description: str
    description_ar: Optional[str]
    boutique_id: str
    boutique_name: str
    category: str
    subcategory: Optional[str]
    tags: List[str]
    brand: Optional[str]
    base_price: float
    sale_price: Optional[float]
    current_price: float
    discount_percentage: Optional[float]
    currency: str
    main_image: str
    images: List[str]
    condition: ProductCondition
    status: ProductStatus
    is_featured: bool
    is_trending: bool
    is_in_stock: bool
    total_stock: int
    rating: float
    rating_count: int
    sales_count: int
    views: int
    created_at: str
    
    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    size: int
    total_pages: int
    has_next: bool
    has_prev: bool

class ProductDetailResponse(ProductResponse):
    variants: List[dict]
    colors: List[dict]
    material: Optional[str]
    care_instructions: Optional[str]
    shipping_details: dict
    seo: dict
    available_sizes: List[str]
    available_colors: List[str]
    
class CategoryResponse(BaseModel):
    name: str
    slug: str
    product_count: int
    subcategories: List[str] = []

class BrandResponse(BaseModel):
    name: str
    product_count: int
    logo: Optional[str] = None
