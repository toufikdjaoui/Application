from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, products, boutiques, orders, chat, reviews, wishlists, inspiration

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(boutiques.router, prefix="/boutiques", tags=["boutiques"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(wishlists.router, prefix="/wishlists", tags=["wishlists"])
api_router.include_router(inspiration.router, prefix="/inspiration", tags=["inspiration"])
