from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.session import get_db
from app.models.role import Role
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest
from app.schemas.token import AuthResponse, AuthUser

router = APIRouter()


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.query(User).join(Role).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Correo o contrasena incorrectos")

    user.last_login_at = datetime.utcnow()
    db.commit()

    access_token = create_access_token(
        subject=user.id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return AuthResponse(
        access_token=access_token,
        user=AuthUser(id=user.id, full_name=user.full_name, email=user.email, role=user.role.name),
    )


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> dict:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese correo")

    role = db.query(Role).filter(Role.name == payload.rol).first()
    if not role:
        raise HTTPException(status_code=400, detail="Rol invalido")

    user = User(
        role_id=role.id,
        full_name=f"{payload.nombres} {payload.apellidos}".strip(),
        email=payload.email,
        phone=payload.telefono,
        password_hash=get_password_hash(payload.password),
        is_active=True,
        email_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Usuario registrado correctamente", "id": user.id, "email": user.email}
