from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_boutiques():
    """Obtenir la liste des boutiques"""
    return {"message": "Boutiques list coming soon"}

@router.get("/{boutique_id}")
async def get_boutique(boutique_id: str):
    """Obtenir les détails d'une boutique"""
    return {"message": f"Boutique {boutique_id} details coming soon"}
