from fastapi import APIRouter

router = APIRouter()

@router.get("/rooms")
async def get_chat_rooms():
    """Obtenir les salles de chat"""
    return {"message": "Chat rooms coming soon"}
