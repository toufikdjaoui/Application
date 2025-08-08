from typing import List, Optional, Tuple
from beanie import PydanticObjectId
from beanie.operators import RegEx, In, GTE, LTE, And, Or
from pymongo import ASCENDING, DESCENDING

from app.models.product import Product, ProductStatus, ProductCondition
from app.models.boutique import Boutique
from app.schemas.product import (
    ProductCreate, 
    ProductUpdate, 
    ProductFilters, 
    ProductSort,
    ProductResponse,
    ProductDetailResponse,
    ProductListResponse,
    CategoryResponse,
    BrandResponse
)
from app.core.config import settings
from app.utils.slug import generate_slug

class ProductService:
    
    @staticmethod
    async def create_product(product_data: ProductCreate, boutique_id: str) -> Product:
        """Create a new product"""
        
        # Verify boutique exists and is active
        boutique = await Boutique.get(boutique_id)
        if not boutique or boutique.status != "approved":
            raise ValueError("Boutique not found or not approved")
        
        # Generate slug
        slug = await ProductService.generate_unique_slug(product_data.name)
        
        # Create product
        product = Product(
            **product_data.dict(exclude={"boutique_id"}),
            boutique_id=str(boutique.id),
            boutique_name=boutique.name,
            slug=slug
        )
        
        await product.save()
        
        # Update boutique product count
        boutique.total_products += 1
        await boutique.save()
        
        return product
    
    @staticmethod
    async def get_product_by_id(product_id: str, user_id: Optional[str] = None) -> Optional[Product]:
        """Get product by ID and increment view count"""
        
        product = await Product.get(product_id)
        if not product:
            return None
        
        # Increment view count (but not for the boutique owner)
        if not user_id or user_id != product.boutique_id:
            product.add_view()
            await product.save()
        
        return product
    
    @staticmethod
    async def get_product_by_slug(slug: str, user_id: Optional[str] = None) -> Optional[Product]:
        """Get product by slug"""
        
        product = await Product.find_one(Product.slug == slug)
        if not product:
            return None
        
        # Increment view count
        if not user_id or user_id != product.boutique_id:
            product.add_view()
            await product.save()
        
        return product
    
    @staticmethod
    async def search_products(
        filters: ProductFilters,
        sort: ProductSort = ProductSort.RELEVANCE,
        page: int = 1,
        size: int = 20
    ) -> ProductListResponse:
        """Search and filter products"""
        
        # Build query
        query_conditions = []
        
        # Status filter (always apply)
        if filters.status:
            query_conditions.append(Product.status == filters.status)
        
        # Stock filter
        if filters.in_stock_only:
            query_conditions.append(Product.total_stock > 0)
        
        # Category filters
        if filters.category:
            query_conditions.append(Product.category == filters.category)
        if filters.subcategory:
            query_conditions.append(Product.subcategory == filters.subcategory)
        
        # Boutique filter
        if filters.boutique_id:
            query_conditions.append(Product.boutique_id == filters.boutique_id)
        
        # Brand filter
        if filters.brand:
            query_conditions.append(Product.brand == filters.brand)
        
        # Price range
        if filters.min_price is not None:
            query_conditions.append(Product.base_price >= filters.min_price)
        if filters.max_price is not None:
            query_conditions.append(Product.base_price <= filters.max_price)
        
        # Color filter
        if filters.color:
            query_conditions.append(RegEx(Product.colors, filters.color, "i"))
        
        # Size filter
        if filters.size:
            query_conditions.append(RegEx(Product.variants, filters.size, "i"))
        
        # Condition filter
        if filters.condition:
            query_conditions.append(Product.condition == filters.condition)
        
        # Featured/Trending filters
        if filters.is_featured is not None:
            query_conditions.append(Product.is_featured == filters.is_featured)
        if filters.is_trending is not None:
            query_conditions.append(Product.is_trending == filters.is_trending)
        
        # Text search
        if filters.search:
            search_conditions = [
                RegEx(Product.name, filters.search, "i"),
                RegEx(Product.description, filters.search, "i"),
                RegEx(Product.tags, filters.search, "i"),
                RegEx(Product.brand, filters.search, "i") if filters.search else None
            ]
            search_conditions = [cond for cond in search_conditions if cond is not None]
            if search_conditions:
                query_conditions.append(Or(*search_conditions))
        
        # Combine all conditions
        query = And(*query_conditions) if query_conditions else {}
        
        # Build sort
        sort_options = {
            ProductSort.RELEVANCE: [("is_featured", DESCENDING), ("rating", DESCENDING), ("views", DESCENDING)],
            ProductSort.PRICE_ASC: [("base_price", ASCENDING)],
            ProductSort.PRICE_DESC: [("base_price", DESCENDING)],
            ProductSort.NEWEST: [("created_at", DESCENDING)],
            ProductSort.OLDEST: [("created_at", ASCENDING)],
            ProductSort.POPULARITY: [("views", DESCENDING), ("sales_count", DESCENDING)],
            ProductSort.RATING: [("rating", DESCENDING), ("rating_count", DESCENDING)],
            ProductSort.SALES: [("sales_count", DESCENDING)]
        }
        
        sort_criteria = sort_options.get(sort, sort_options[ProductSort.RELEVANCE])
        
        # Execute query with pagination
        skip = (page - 1) * size
        
        if query_conditions:
            products = await Product.find(query).sort(*sort_criteria).skip(skip).limit(size).to_list()
            total = await Product.find(query).count()
        else:
            products = await Product.find_all().sort(*sort_criteria).skip(skip).limit(size).to_list()
            total = await Product.count()
        
        # Calculate pagination info
        total_pages = (total + size - 1) // size
        has_next = page < total_pages
        has_prev = page > 1
        
        # Convert to response format
        product_responses = [
            ProductResponse(
                id=str(product.id),
                name=product.name,
                name_ar=product.name_ar,
                slug=product.slug,
                description=product.description,
                description_ar=product.description_ar,
                boutique_id=product.boutique_id,
                boutique_name=product.boutique_name,
                category=product.category,
                subcategory=product.subcategory,
                tags=product.tags,
                brand=product.brand,
                base_price=product.base_price,
                sale_price=product.sale_price,
                current_price=product.current_price,
                discount_percentage=product.discount_percentage,
                currency=product.currency,
                main_image=product.main_image,
                images=product.images,
                condition=product.condition,
                status=product.status,
                is_featured=product.is_featured,
                is_trending=product.is_trending,
                is_in_stock=product.is_in_stock,
                total_stock=product.total_stock,
                rating=product.rating,
                rating_count=product.rating_count,
                sales_count=product.sales_count,
                views=product.views,
                created_at=product.created_at.isoformat()
            )
            for product in products
        ]
        
        return ProductListResponse(
            products=product_responses,
            total=total,
            page=page,
            size=size,
            total_pages=total_pages,
            has_next=has_next,
            has_prev=has_prev
        )
    
    @staticmethod
    async def update_product(product_id: str, product_data: ProductUpdate, user_id: str) -> Optional[Product]:
        """Update product (only by boutique owner or admin)"""
        
        product = await Product.get(product_id)
        if not product:
            return None
        
        # Check ownership (simplified - should check user role)
        if product.boutique_id != user_id:
            raise PermissionError("Not authorized to update this product")
        
        # Update fields
        update_data = product_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        
        await product.save()
        return product
    
    @staticmethod
    async def delete_product(product_id: str, user_id: str) -> bool:
        """Delete product (only by boutique owner or admin)"""
        
        product = await Product.get(product_id)
        if not product:
            return False
        
        # Check ownership
        if product.boutique_id != user_id:
            raise PermissionError("Not authorized to delete this product")
        
        await product.delete()
        
        # Update boutique product count
        boutique = await Boutique.get(product.boutique_id)
        if boutique and boutique.total_products > 0:
            boutique.total_products -= 1
            await boutique.save()
        
        return True
    
    @staticmethod
    async def get_categories() -> List[CategoryResponse]:
        """Get all product categories with counts"""
        
        pipeline = [
            {"$match": {"status": "active"}},
            {"$group": {
                "_id": {
                    "category": "$category",
                    "subcategory": "$subcategory"
                },
                "count": {"$sum": 1}
            }},
            {"$group": {
                "_id": "$_id.category",
                "total_count": {"$sum": "$count"},
                "subcategories": {
                    "$push": {
                        "$cond": [
                            {"$ne": ["$_id.subcategory", None]},
                            "$_id.subcategory",
                            "$$REMOVE"
                        ]
                    }
                }
            }},
            {"$sort": {"total_count": -1}}
        ]
        
        result = await Product.aggregate(pipeline).to_list()
        
        categories = []
        for item in result:
            categories.append(CategoryResponse(
                name=item["_id"],
                slug=generate_slug(item["_id"]),
                product_count=item["total_count"],
                subcategories=list(set(item.get("subcategories", [])))
            ))
        
        return categories
    
    @staticmethod
    async def get_brands() -> List[BrandResponse]:
        """Get all brands with product counts"""
        
        pipeline = [
            {"$match": {"status": "active", "brand": {"$ne": None}}},
            {"$group": {
                "_id": "$brand",
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}}
        ]
        
        result = await Product.aggregate(pipeline).to_list()
        
        brands = []
        for item in result:
            brands.append(BrandResponse(
                name=item["_id"],
                product_count=item["count"]
            ))
        
        return brands
    
    @staticmethod
    async def get_featured_products(limit: int = 10) -> List[ProductResponse]:
        """Get featured products"""
        
        products = await Product.find(
            Product.status == ProductStatus.ACTIVE,
            Product.is_featured == True,
            Product.total_stock > 0
        ).sort([("created_at", DESCENDING)]).limit(limit).to_list()
        
        return [ProductService._product_to_response(product) for product in products]
    
    @staticmethod
    async def get_trending_products(limit: int = 10) -> List[ProductResponse]:
        """Get trending products"""
        
        products = await Product.find(
            Product.status == ProductStatus.ACTIVE,
            Product.is_trending == True,
            Product.total_stock > 0
        ).sort([("views", DESCENDING), ("sales_count", DESCENDING)]).limit(limit).to_list()
        
        return [ProductService._product_to_response(product) for product in products]
    
    @staticmethod
    async def get_new_arrivals(limit: int = 10) -> List[ProductResponse]:
        """Get new arrival products"""
        
        products = await Product.find(
            Product.status == ProductStatus.ACTIVE,
            Product.total_stock > 0
        ).sort([("created_at", DESCENDING)]).limit(limit).to_list()
        
        return [ProductService._product_to_response(product) for product in products]
    
    @staticmethod
    async def get_similar_products(product_id: str, limit: int = 8) -> List[ProductResponse]:
        """Get similar products based on category and tags"""
        
        product = await Product.get(product_id)
        if not product:
            return []
        
        # Find products in same category with similar tags
        similar_products = await Product.find(
            Product.status == ProductStatus.ACTIVE,
            Product.total_stock > 0,
            Product.id != product.id,
            Or(
                Product.category == product.category,
                In(Product.tags, product.tags[:3])  # Use first 3 tags
            )
        ).sort([("rating", DESCENDING), ("views", DESCENDING)]).limit(limit).to_list()
        
        return [ProductService._product_to_response(p) for p in similar_products]
    
    @staticmethod
    async def generate_unique_slug(name: str) -> str:
        """Generate unique slug for product"""
        base_slug = generate_slug(name)
        slug = base_slug
        counter = 1
        
        while await Product.find_one(Product.slug == slug):
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        return slug
    
    @staticmethod
    def _product_to_response(product: Product) -> ProductResponse:
        """Convert Product model to ProductResponse"""
        return ProductResponse(
            id=str(product.id),
            name=product.name,
            name_ar=product.name_ar,
            slug=product.slug,
            description=product.description,
            description_ar=product.description_ar,
            boutique_id=product.boutique_id,
            boutique_name=product.boutique_name,
            category=product.category,
            subcategory=product.subcategory,
            tags=product.tags,
            brand=product.brand,
            base_price=product.base_price,
            sale_price=product.sale_price,
            current_price=product.current_price,
            discount_percentage=product.discount_percentage,
            currency=product.currency,
            main_image=product.main_image,
            images=product.images,
            condition=product.condition,
            status=product.status,
            is_featured=product.is_featured,
            is_trending=product.is_trending,
            is_in_stock=product.is_in_stock,
            total_stock=product.total_stock,
            rating=product.rating,
            rating_count=product.rating_count,
            sales_count=product.sales_count,
            views=product.views,
            created_at=product.created_at.isoformat()
        )
