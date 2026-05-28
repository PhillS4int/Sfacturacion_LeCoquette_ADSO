from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.core.security import get_password_hash
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead

router = APIRouter()


class UserUpdate(BaseModel):
    role_id: Optional[int] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    email_verified: Optional[bool] = None


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None


def get_user_with_role(
    db: Session,
    user_id: int,
) -> User | None:
    return (
        db.query(User)
        .options(joinedload(User.role))
        .filter(User.id == user_id)
        .first()
    )


def get_role_name(user: User | None) -> str:
    if not user or not user.role:
        return ""

    return str(user.role.name or "").lower()


def require_admin(
    db: Session,
    current_user: User,
) -> User:
    user = get_user_with_role(db, current_user.id)
    role_name = get_role_name(user)

    if role_name != "administrador":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para realizar esta acción",
        )

    return user


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> User:
    require_admin(db, current_user)

    existing_user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya existe",
        )

    user = User(
        role_id=payload.role_id,
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        password_hash=get_password_hash(payload.password),
        is_active=True,
        email_verified=False,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return (
        db.query(User)
        .options(joinedload(User.role))
        .filter(User.id == user.id)
        .first()
    )


@router.get("/", response_model=list[UserRead])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[User]:
    require_admin(db, current_user)

    users = (
        db.query(User)
        .options(joinedload(User.role))
        .order_by(User.id.desc())
        .all()
    )

    return users


@router.get("/me", response_model=UserRead)
def read_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    user = get_user_with_role(db, current_user.id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    return user


@router.put("/me", response_model=UserRead)
def update_my_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    user = get_user_with_role(db, current_user.id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    role_name = get_role_name(user)

    if role_name != "administrador":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo el administrador puede editar su perfil",
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"]:
        existing_user = (
            db.query(User)
            .filter(
                User.email == update_data["email"],
                User.id != current_user.id,
            )
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe otro usuario con este correo electrónico",
            )

    if "password" in update_data:
        password = update_data.pop("password")

        if password:
            user.password_hash = get_password_hash(password)

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return get_user_with_role(db, user.id)


@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> User:
    require_admin(db, current_user)

    user = get_user_with_role(db, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    return user


@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> User:
    require_admin(db, current_user)

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"]:
        existing_user = (
            db.query(User)
            .filter(
                User.email == update_data["email"],
                User.id != user_id,
            )
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe otro usuario con este correo electrónico",
            )

    if "password" in update_data:
        password = update_data.pop("password")

        if password:
            user.password_hash = get_password_hash(password)

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return get_user_with_role(db, user.id)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    require_admin(db, current_user)

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes desactivar tu propio usuario",
        )

    user.is_active = False

    db.commit()

    return None