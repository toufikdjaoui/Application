from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from app.models.user import UserRole

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    phone: Optional[str] = None
    language: str = Field(default="fr", regex="^(fr|ar)$")
    
    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Les mots de passe ne correspondent pas')
        return v
    
    @validator("password")
    def validate_password(cls, v):
        # Password should contain at least one letter and one number
        if not any(c.isalpha() for c in v):
            raise ValueError('Le mot de passe doit contenir au moins une lettre')
        if not any(c.isdigit() for c in v):
            raise ValueError('Le mot de passe doit contenir au moins un chiffre')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: UserRole
    is_active: bool
    is_verified: bool
    language: str
    avatar: Optional[str] = None
    phone: Optional[str] = None
    
    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    user: UserResponse
    tokens: TokenResponse

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str
    
    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Les mots de passe ne correspondent pas')
        return v

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class EmailVerification(BaseModel):
    token: str

class ResendVerification(BaseModel):
    email: EmailStr
