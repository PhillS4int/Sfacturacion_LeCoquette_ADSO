from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    nombres: str
    apellidos: str
    email: EmailStr
    telefono: str | None = None
    password: str
    rol: str = "empleado"
