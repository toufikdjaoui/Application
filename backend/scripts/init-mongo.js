// MongoDB initialization script
// This script creates the initial database structure and indexes

// Switch to the mode_dz database
db = db.getSiblingDB('mode_dz');

// Create collections and indexes
db.createCollection('users');
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "is_active": 1 });
db.users.createIndex({ "created_at": 1 });

db.createCollection('boutiques');
db.boutiques.createIndex({ "name": 1 }, { unique: true });
db.boutiques.createIndex({ "slug": 1 }, { unique: true });
db.boutiques.createIndex({ "owner_id": 1 });
db.boutiques.createIndex({ "status": 1 });
db.boutiques.createIndex({ "business_type": 1 });
db.boutiques.createIndex({ "city": 1 });
db.boutiques.createIndex({ "categories": 1 });
db.boutiques.createIndex({ "rating": 1 });
db.boutiques.createIndex({ "created_at": 1 });

db.createCollection('products');
db.products.createIndex({ "name": "text", "description": "text", "tags": "text" });
db.products.createIndex({ "slug": 1 }, { unique: true });
db.products.createIndex({ "boutique_id": 1 });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "subcategory": 1 });
db.products.createIndex({ "brand": 1 });
db.products.createIndex({ "status": 1 });
db.products.createIndex({ "base_price": 1 });
db.products.createIndex({ "is_featured": 1 });
db.products.createIndex({ "is_trending": 1 });
db.products.createIndex({ "rating": 1 });
db.products.createIndex({ "sales_count": 1 });
db.products.createIndex({ "created_at": 1 });

db.createCollection('orders');
db.orders.createIndex({ "order_number": 1 }, { unique: true });
db.orders.createIndex({ "customer_id": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "payment_info.method": 1 });
db.orders.createIndex({ "payment_info.status": 1 });
db.orders.createIndex({ "delivery_method": 1 });
db.orders.createIndex({ "created_at": 1 });
db.orders.createIndex({ "total_amount": 1 });

db.createCollection('reviews');
db.reviews.createIndex({ "product_id": 1 });
db.reviews.createIndex({ "customer_id": 1 });
db.reviews.createIndex({ "rating": 1 });
db.reviews.createIndex({ "is_approved": 1 });
db.reviews.createIndex({ "is_verified_purchase": 1 });
db.reviews.createIndex({ "created_at": 1 });

db.createCollection('wishlists');
db.wishlists.createIndex({ "owner_id": 1 });
db.wishlists.createIndex({ "privacy": 1 });
db.wishlists.createIndex({ "share_code": 1 });
db.wishlists.createIndex({ "is_default": 1 });
db.wishlists.createIndex({ "created_at": 1 });

db.createCollection('chat_rooms');
db.chat_rooms.createIndex({ "room_type": 1 });
db.chat_rooms.createIndex({ "product_id": 1 });
db.chat_rooms.createIndex({ "order_id": 1 });
db.chat_rooms.createIndex({ "boutique_id": 1 });
db.chat_rooms.createIndex({ "is_active": 1 });
db.chat_rooms.createIndex({ "last_message_at": 1 });
db.chat_rooms.createIndex({ "created_at": 1 });

db.createCollection('chat_messages');
db.chat_messages.createIndex({ "chat_room_id": 1 });
db.chat_messages.createIndex({ "sender_id": 1 });
db.chat_messages.createIndex({ "created_at": 1 });
db.chat_messages.createIndex({ "status": 1 });

db.createCollection('inspiration_posts');
db.inspiration_posts.createIndex({ "creator_id": 1 });
db.inspiration_posts.createIndex({ "creator_type": 1 });
db.inspiration_posts.createIndex({ "post_type": 1 });
db.inspiration_posts.createIndex({ "style_tags": 1 });
db.inspiration_posts.createIndex({ "occasion_tags": 1 });
db.inspiration_posts.createIndex({ "season_tags": 1 });
db.inspiration_posts.createIndex({ "is_featured": 1 });
db.inspiration_posts.createIndex({ "is_trending": 1 });
db.inspiration_posts.createIndex({ "is_public": 1 });
db.inspiration_posts.createIndex({ "likes": 1 });
db.inspiration_posts.createIndex({ "saves": 1 });
db.inspiration_posts.createIndex({ "views": 1 });
db.inspiration_posts.createIndex({ "created_at": 1 });

// Insert sample data (optional)
print("Database initialized successfully!");
print("Collections created: users, boutiques, products, orders, reviews, wishlists, chat_rooms, chat_messages, inspiration_posts");
print("Indexes created for optimal performance");
