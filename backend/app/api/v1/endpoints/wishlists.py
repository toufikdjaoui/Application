from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_wishlists():
    """Obtenir les listes de souhaits"""
    return {"message": "Wishlists coming soon"}
