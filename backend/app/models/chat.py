from beanie import Document, Indexed
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"
    PRODUCT_LINK = "product_link"
    ORDER_UPDATE = "order_update"

class MessageStatus(str, Enum):
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"

class ChatType(str, Enum):
    CUSTOMER_SUPPORT = "customer_support"
    MERCHANT_CUSTOMER = "merchant_customer"
    GROUP = "group"

class MessageAttachment(BaseModel):
    type: str  # image, file, product
    url: str
    filename: Optional[str] = None
    size: Optional[int] = None
    mime_type: Optional[str] = None

class ChatMessage(Document):
    # Message Identity
    chat_room_id: Indexed(str)
    sender_id: Indexed(str)
    sender_role: str  # customer, merchant, admin
    
    # Message Content
    message_type: MessageType = MessageType.TEXT
    content: str
    content_ar: Optional[str] = None  # Arabic translation
    
    # Attachments
    attachments: List[MessageAttachment] = []
    
    # Product reference (for product_link messages)
    product_id: Optional[str] = None
    order_id: Optional[str] = None
    
    # Message Status
    status: MessageStatus = MessageStatus.SENT
    
    # Reply/Thread
    reply_to_message_id: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None
    
    class Settings:
        name = "chat_messages"
        indexes = [
            "chat_room_id",
            "sender_id",
            "created_at",
            "status"
        ]

class ChatParticipant(BaseModel):
    user_id: str
    role: str  # customer, merchant, admin
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    last_read_at: Optional[datetime] = None
    is_active: bool = True

class ChatRoom(Document):
    # Room Identity
    room_type: ChatType
    title: Optional[str] = None
    
    # Participants
    participants: List[ChatParticipant] = []
    
    # Product/Order Context
    product_id: Optional[str] = None
    order_id: Optional[str] = None
    boutique_id: Optional[str] = None
    
    # Room Status
    is_active: bool = True
    is_archived: bool = False
    
    # Last Activity
    last_message_id: Optional[str] = None
    last_message_at: Optional[datetime] = None
    last_message_preview: Optional[str] = None
    
    # Metadata
    unread_count: Dict[str, int] = {}  # user_id -> unread_count
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "chat_rooms"
        indexes = [
            "room_type",
            "product_id",
            "order_id", 
            "boutique_id",
            "is_active",
            "last_message_at",
            "created_at"
        ]
    
    def add_participant(self, user_id: str, role: str) -> bool:
        """Add participant to chat room"""
        # Check if already participant
        if any(p.user_id == user_id for p in self.participants):
            return False
        
        self.participants.append(ChatParticipant(user_id=user_id, role=role))
        self.unread_count[user_id] = 0
        return True
    
    def remove_participant(self, user_id: str) -> bool:
        """Remove participant from chat room"""
        original_length = len(self.participants)
        self.participants = [p for p in self.participants if p.user_id != user_id]
        
        if user_id in self.unread_count:
            del self.unread_count[user_id]
        
        return len(self.participants) < original_length
    
    def update_last_read(self, user_id: str):
        """Update last read timestamp for user"""
        participant = next((p for p in self.participants if p.user_id == user_id), None)
        if participant:
            participant.last_read_at = datetime.utcnow()
            self.unread_count[user_id] = 0
    
    def increment_unread(self, exclude_user_id: str):
        """Increment unread count for all participants except sender"""
        for participant in self.participants:
            if participant.user_id != exclude_user_id and participant.is_active:
                current_count = self.unread_count.get(participant.user_id, 0)
                self.unread_count[participant.user_id] = current_count + 1
    
    def get_other_participants(self, user_id: str) -> List[ChatParticipant]:
        """Get all participants except the specified user"""
        return [p for p in self.participants if p.user_id != user_id]
    
    @property
    def participant_count(self) -> int:
        """Get active participant count"""
        return len([p for p in self.participants if p.is_active])
