from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_inspiration_posts():
    """Obtenir les posts d'inspiration"""
    return {"message": "Inspiration posts coming soon"}
