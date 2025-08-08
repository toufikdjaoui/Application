from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

from app.models.user import User, UserRole
from app.services.auth_service import AuthService

# Security scheme
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Get current authenticated user"""
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token d'authentification requis"
        )
    
    return await AuthService.get_current_user(credentials.credentials)

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte utilisateur inactif"
        )
    
    return current_user

async def get_current_verified_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Get current verified user"""
    
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email non vérifié"
        )
    
    return current_user

def require_role(required_role: UserRole):
    """Dependency factory for role-based access control"""
    
    async def role_checker(
        current_user: User = Depends(get_current_verified_user)
    ) -> User:
        if current_user.role != required_role and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissions insuffisantes"
            )
        return current_user
    
    return role_checker

def require_roles(required_roles: list[UserRole]):
    """Dependency factory for multiple role access control"""
    
    async def roles_checker(
        current_user: User = Depends(get_current_verified_user)
    ) -> User:
        if current_user.role not in required_roles and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissions insuffisantes"
            )
        return current_user
    
    return roles_checker

# Common role dependencies
get_admin_user = require_role(UserRole.ADMIN)
get_merchant_user = require_role(UserRole.MERCHANT)
get_customer_user = require_role(UserRole.CUSTOMER)
get_merchant_or_admin = require_roles([UserRole.MERCHANT, UserRole.ADMIN])

# Optional authentication (for public endpoints that can benefit from user context)
async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[User]:
    """Get current user if authenticated, otherwise None"""
    
    if not credentials:
        return None
    
    try:
        return await AuthService.get_current_user(credentials.credentials)
    except HTTPException:
        return None
