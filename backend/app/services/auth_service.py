from typing import Optional, Tuple
from datetime import datetime, timedelta
import secrets
from fastapi import HTTPException, status

from app.models.user import User, UserRole, UserPreferences
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    create_refresh_token,
    verify_token
)
from app.schemas.auth import UserRegister, UserLogin, AuthResponse, UserResponse, TokenResponse

class AuthService:
    
    @staticmethod
    async def register_user(user_data: UserRegister) -> User:
        """Register a new user"""
        
        # Check if email already exists
        existing_user = await User.find_one(User.email == user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un utilisateur avec cet email existe déjà"
            )
        
        # Create user
        user = User(
            email=user_data.email,
            password_hash=get_password_hash(user_data.password),
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone=user_data.phone,
            role=UserRole.CUSTOMER,
            preferences=UserPreferences(language=user_data.language),
            verification_token=secrets.token_urlsafe(32)
        )
        
        await user.save()
        
        # TODO: Send verification email
        
        return user
    
    @staticmethod
    async def authenticate_user(credentials: UserLogin) -> User:
        """Authenticate user with email and password"""
        
        user = await User.find_one(User.email == credentials.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou mot de passe incorrect"
            )
        
        if not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou mot de passe incorrect"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Compte désactivé"
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        await user.save()
        
        return user
    
    @staticmethod
    def create_tokens(user_id: str, remember_me: bool = False) -> TokenResponse:
        """Create access and refresh tokens"""
        
        # Create access token
        access_token_expires = timedelta(minutes=30)
        if remember_me:
            access_token_expires = timedelta(hours=24)
            
        access_token = create_access_token(
            subject=user_id,
            expires_delta=access_token_expires
        )
        
        # Create refresh token
        refresh_token = create_refresh_token(subject=user_id)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=int(access_token_expires.total_seconds())
        )
    
    @staticmethod
    async def login_user(credentials: UserLogin) -> AuthResponse:
        """Complete login process"""
        
        user = await AuthService.authenticate_user(credentials)
        tokens = AuthService.create_tokens(str(user.id), credentials.remember_me)
        
        user_response = UserResponse(
            id=str(user.id),
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
            is_active=user.is_active,
            is_verified=user.is_verified,
            language=user.preferences.language,
            avatar=user.avatar,
            phone=user.phone
        )
        
        return AuthResponse(user=user_response, tokens=tokens)
    
    @staticmethod
    async def refresh_access_token(refresh_token: str) -> TokenResponse:
        """Refresh access token using refresh token"""
        
        user_id = verify_token(refresh_token, "refresh")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de rafraîchissement invalide"
            )
        
        # Verify user still exists and is active
        user = await User.get(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur introuvable ou inactif"
            )
        
        return AuthService.create_tokens(user_id)
    
    @staticmethod
    async def verify_email(token: str) -> bool:
        """Verify user email with token"""
        
        user = await User.find_one(User.verification_token == token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token de vérification invalide"
            )
        
        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email déjà vérifié"
            )
        
        user.is_verified = True
        user.verification_token = None
        await user.save()
        
        return True
    
    @staticmethod
    async def resend_verification_email(email: str) -> bool:
        """Resend verification email"""
        
        user = await User.find_one(User.email == email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utilisateur introuvable"
            )
        
        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email déjà vérifié"
            )
        
        # Generate new verification token
        user.verification_token = secrets.token_urlsafe(32)
        await user.save()
        
        # TODO: Send verification email
        
        return True
    
    @staticmethod
    async def request_password_reset(email: str) -> bool:
        """Request password reset"""
        
        user = await User.find_one(User.email == email)
        if not user:
            # Don't reveal if email exists for security
            return True
        
        # Generate reset token (expires in 1 hour)
        reset_token = secrets.token_urlsafe(32)
        
        # TODO: Store reset token with expiration in Redis or add field to user model
        # TODO: Send password reset email
        
        return True
    
    @staticmethod
    async def reset_password(token: str, new_password: str) -> bool:
        """Reset password with token"""
        
        # TODO: Verify reset token from Redis/database
        # For now, this is a placeholder
        
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Réinitialisation de mot de passe non implémentée"
        )
    
    @staticmethod
    async def get_current_user(access_token: str) -> User:
        """Get current user from access token"""
        
        user_id = verify_token(access_token, "access")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token d'accès invalide"
            )
        
        user = await User.get(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur introuvable ou inactif"
            )
        
        return user
