from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_reviews():
    """Obtenir les avis"""
    return {"message": "Reviews coming soon"}
