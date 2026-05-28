from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.schemas.role import RoleRead


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    password: str
    role_id: int


class UserRead(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None = None
    is_active: bool
    email_verified: bool
    last_login_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    role: RoleRead | None = None

    model_config = ConfigDict(from_attributes=True)
