from fastapi import APIRouter, Depends
from app.models.user import User
from app.utils.dependencies import get_current_user

router = APIRouter()

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    """Obtenir le profil utilisateur complet"""
    return current_user

@router.put("/profile")
async def update_profile(current_user: User = Depends(get_current_user)):
    """Mettre à jour le profil utilisateur"""
    # TODO: Implement profile update
    return {"message": "Profile update coming soon"}
