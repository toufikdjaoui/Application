from fastapi import APIRouter, Depends, Query, HTTPException, status
from typing import Optional, List
from app.models.user import User
from app.utils.dependencies import get_optional_user, get_current_verified_user
from app.services.product_service import ProductService
from app.schemas.product import (
    ProductCreate,
    ProductUpdate, 
    ProductFilters,
    ProductSort,
    ProductListResponse,
    ProductResponse,
    ProductDetailResponse,
    CategoryResponse,
    BrandResponse
)

router = APIRouter()

@router.get("/", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Items per page"),
    sort: ProductSort = Query(ProductSort.RELEVANCE, description="Sort option"),
    
    # Filters
    category: Optional[str] = Query(None, description="Filter by category"),
    subcategory: Optional[str] = Query(None, description="Filter by subcategory"),
    boutique_id: Optional[str] = Query(None, description="Filter by boutique"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    color: Optional[str] = Query(None, description="Filter by color"),
    size: Optional[str] = Query(None, description="Filter by size"),
    condition: Optional[str] = Query(None, description="Filter by condition"),
    search: Optional[str] = Query(None, description="Search query"),
    in_stock_only: bool = Query(True, description="Show only in-stock products"),
    is_featured: Optional[bool] = Query(None, description="Filter featured products"),
    is_trending: Optional[bool] = Query(None, description="Filter trending products"),
    
    current_user: Optional[User] = Depends(get_optional_user)
):
    """
    Obtenir la liste des produits avec filtres avancés
    
    Supports filtering by:
    - Category and subcategory
    - Boutique
    - Brand
    - Price range
    - Color and size
    - Product condition
    - Stock availability
    - Featured/trending status
    - Text search
    
    Supports sorting by:
    - Relevance (default)
    - Price (ascending/descending)
    - Date (newest/oldest)
    - Popularity (views, sales)
    - Rating
    """
    filters = ProductFilters(
        category=category,
        subcategory=subcategory,
        boutique_id=boutique_id,
        brand=brand,
        min_price=min_price,
        max_price=max_price,
        color=color,
        size=size,
        condition=condition,
        search=search,
        in_stock_only=in_stock_only,
        is_featured=is_featured,
        is_trending=is_trending
    )
    
    return await ProductService.search_products(
        filters=filters,
        sort=sort,
        page=page,
        size=size
    )

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    """Obtenir toutes les catégories avec le nombre de produits"""
    return await ProductService.get_categories()

@router.get("/brands", response_model=List[BrandResponse])
async def get_brands():
    """Obtenir toutes les marques avec le nombre de produits"""
    return await ProductService.get_brands()

@router.get("/featured", response_model=List[ProductResponse])
async def get_featured_products(
    limit: int = Query(10, ge=1, le=50, description="Number of products to return")
):
    """Obtenir les produits mis en avant"""
    return await ProductService.get_featured_products(limit=limit)

@router.get("/trending", response_model=List[ProductResponse])
async def get_trending_products(
    limit: int = Query(10, ge=1, le=50, description="Number of products to return")
):
    """Obtenir les produits tendance"""
    return await ProductService.get_trending_products(limit=limit)

@router.get("/new-arrivals", response_model=List[ProductResponse])
async def get_new_arrivals(
    limit: int = Query(10, ge=1, le=50, description="Number of products to return")
):
    """Obtenir les nouveautés"""
    return await ProductService.get_new_arrivals(limit=limit)

@router.get("/{product_id}", response_model=ProductDetailResponse)
async def get_product(
    product_id: str,
    current_user: Optional[User] = Depends(get_optional_user)
):
    """
    Obtenir les détails complets d'un produit
    
    Incrémente automatiquement le compteur de vues
    """
    user_id = str(current_user.id) if current_user else None
    
    product = await ProductService.get_product_by_id(product_id, user_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit non trouvé"
        )
    
    return ProductDetailResponse(
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
        created_at=product.created_at.isoformat(),
        # Additional detail fields
        variants=[v.dict() for v in product.variants],
        colors=[c.dict() for c in product.colors],
        material=product.material,
        care_instructions=product.care_instructions,
        shipping_details=product.shipping_details.dict(),
        seo=product.seo.dict(),
        available_sizes=product.get_available_sizes(),
        available_colors=[c.name for c in product.colors]
    )

@router.get("/slug/{slug}", response_model=ProductDetailResponse)
async def get_product_by_slug(
    slug: str,
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Obtenir un produit par son slug"""
    user_id = str(current_user.id) if current_user else None
    
    product = await ProductService.get_product_by_slug(slug, user_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit non trouvé"
        )
    
    return ProductDetailResponse(
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
        created_at=product.created_at.isoformat(),
        # Additional detail fields
        variants=[v.dict() for v in product.variants],
        colors=[c.dict() for c in product.colors],
        material=product.material,
        care_instructions=product.care_instructions,
        shipping_details=product.shipping_details.dict(),
        seo=product.seo.dict(),
        available_sizes=product.get_available_sizes(),
        available_colors=[c.name for c in product.colors]
    )

@router.get("/{product_id}/similar", response_model=List[ProductResponse])
async def get_similar_products(
    product_id: str,
    limit: int = Query(8, ge=1, le=20, description="Number of similar products")
):
    """Obtenir des produits similaires"""
    return await ProductService.get_similar_products(product_id, limit)

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_verified_user)
):
    """
    Créer un nouveau produit (pour les marchands)
    
    Nécessite d'être connecté et vérifié
    """
    try:
        product = await ProductService.create_product(
            product_data, 
            str(current_user.id)
        )
        return ProductService._product_to_response(product)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_verified_user)
):
    """Mettre à jour un produit (propriétaire uniquement)"""
    try:
        product = await ProductService.update_product(
            product_id, 
            product_data, 
            str(current_user.id)
        )
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produit non trouvé"
            )
        return ProductService._product_to_response(product)
    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Non autorisé à modifier ce produit"
        )

@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_verified_user)
):
    """Supprimer un produit (propriétaire uniquement)"""
    try:
        success = await ProductService.delete_product(
            product_id, 
            str(current_user.id)
        )
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produit non trouvé"
            )
        return {"message": "Produit supprimé avec succès"}
    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Non autorisé à supprimer ce produit"
        )
