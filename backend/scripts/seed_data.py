from sqlalchemy.orm import Session

from app.db import base  # noqa: F401
from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.role import Role
from app.models.user import User


def seed_roles(db: Session) -> None:
    defaults = [
        ("administrador", "Acceso total al sistema"),
        ("empleado", "Acceso operativo al sistema"),
    ]
    for name, description in defaults:
        exists = db.query(Role).filter(Role.name == name).first()
        if not exists:
            db.add(Role(name=name, description=description))
    db.commit()


def seed_admin(db: Session) -> None:
    admin_role = db.query(Role).filter(Role.name == "administrador").first()
    if not admin_role:
        print("No existe el rol administrador")
        return

    exists = db.query(User).filter(User.email == "admin@lecoquette.com").first()
    if exists:
        db.delete(exists)
        db.commit()

    user = User(
        role_id=admin_role.id,
        full_name="Administrador Principal",
        email="admin@lecoquette.com",
        phone="3000000000",
        password_hash=get_password_hash("admin123"),
        is_active=True,
        email_verified=True,
    )
    db.add(user)
    db.commit()
    print("Usuario administrador creado correctamente")


def main() -> None:
    db = SessionLocal()
    try:
        seed_roles(db)
        seed_admin(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()