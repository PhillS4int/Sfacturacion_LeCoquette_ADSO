from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthUser(BaseModel):
    id: int
    full_name: str
    email: str
    role: str


class AuthResponse(Token):
    user: AuthUser
