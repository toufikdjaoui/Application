from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import (
    UserRegister, 
    UserLogin, 
    AuthResponse, 
    RefreshTokenRequest,
    TokenResponse,
    EmailVerification,
    ResendVerification,
    PasswordReset,
    PasswordResetConfirm
)
from app.services.auth_service import AuthService
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """
    Inscription d'un nouvel utilisateur
    
    - **email**: Email unique de l'utilisateur
    - **password**: Mot de passe (min. 8 caractères, contenant lettres et chiffres)
    - **confirm_password**: Confirmation du mot de passe
    - **first_name**: Prénom
    - **last_name**: Nom de famille
    - **phone**: Numéro de téléphone (optionnel)
    - **language**: Langue préférée (fr ou ar)
    """
    user = await AuthService.register_user(user_data)
    return await AuthService.login_user(UserLogin(
        email=user_data.email,
        password=user_data.password
    ))

@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    """
    Connexion utilisateur
    
    - **email**: Email de l'utilisateur
    - **password**: Mot de passe
    - **remember_me**: Maintenir la connexion plus longtemps
    """
    return await AuthService.login_user(credentials)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_data: RefreshTokenRequest):
    """
    Renouveller le token d'accès
    
    - **refresh_token**: Token de rafraîchissement
    """
    return await AuthService.refresh_access_token(refresh_data.refresh_token)

@router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(verification_data: EmailVerification):
    """
    Vérifier l'email avec le token reçu
    
    - **token**: Token de vérification reçu par email
    """
    success = await AuthService.verify_email(verification_data.token)
    return {"message": "Email vérifié avec succès" if success else "Erreur de vérification"}

@router.post("/resend-verification", status_code=status.HTTP_200_OK)
async def resend_verification(resend_data: ResendVerification):
    """
    Renvoyer l'email de vérification
    
    - **email**: Email de l'utilisateur
    """
    success = await AuthService.resend_verification_email(resend_data.email)
    return {"message": "Email de vérification renvoyé" if success else "Erreur d'envoi"}

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(reset_data: PasswordReset):
    """
    Demander la réinitialisation du mot de passe
    
    - **email**: Email de l'utilisateur
    """
    success = await AuthService.request_password_reset(reset_data.email)
    return {"message": "Instructions de réinitialisation envoyées par email"}

@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(reset_data: PasswordResetConfirm):
    """
    Réinitialiser le mot de passe avec le token
    
    - **token**: Token de réinitialisation
    - **new_password**: Nouveau mot de passe
    - **confirm_password**: Confirmation du nouveau mot de passe
    """
    success = await AuthService.reset_password(reset_data.token, reset_data.new_password)
    return {"message": "Mot de passe réinitialisé avec succès" if success else "Erreur de réinitialisation"}

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Obtenir les informations de l'utilisateur connecté
    """
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "language": current_user.preferences.language,
        "avatar": current_user.avatar,
        "phone": current_user.phone,
        "created_at": current_user.created_at,
        "last_login": current_user.last_login
    }

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(current_user: User = Depends(get_current_user)):
    """
    Déconnexion utilisateur
    
    Note: Côté client, supprimez les tokens du stockage local
    """
    return {"message": "Déconnexion réussie"}
