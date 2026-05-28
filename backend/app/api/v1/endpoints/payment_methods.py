from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.payment_method import PaymentMethod
from app.models.user import User

router = APIRouter()


@router.get("/")
def list_payment_methods(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    methods = (
        db.query(PaymentMethod)
        .filter(PaymentMethod.is_enabled.is_(True))
        .order_by(PaymentMethod.name.asc())
        .all()
    )

    return [
        {
            "id": method.id,
            "name": method.name,
        }
        for method in methods
    ]