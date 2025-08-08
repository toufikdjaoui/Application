from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import asyncio
from typing import Optional

from app.core.config import settings

# MongoDB client
client: Optional[AsyncIOMotorClient] = None

async def get_database():
    """Get MongoDB database instance"""
    return client[settings.DATABASE_NAME]

async def connect_to_mongo():
    """Create database connection"""
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    print("✅ Connected to MongoDB")

async def close_mongo_connection():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("❌ Disconnected from MongoDB")

async def init_db():
    """Initialize database with Beanie ODM"""
    await connect_to_mongo()
    
    # Import all models
    from app.models.user import User
    from app.models.boutique import Boutique
    from app.models.product import Product
    from app.models.order import Order
    from app.models.review import Review
    from app.models.wishlist import Wishlist
    from app.models.chat import ChatRoom, ChatMessage
    from app.models.inspiration import InspirationPost
    
    # Initialize Beanie with all models
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[
            User,
            Boutique, 
            Product,
            Order,
            Review,
            Wishlist,
            ChatRoom,
            ChatMessage,
            InspirationPost
        ]
    )
    print("✅ Database initialized with Beanie ODM")

# Database dependency for FastAPI
async def get_db():
    db = await get_database()
    try:
        yield db
    finally:
        pass
