from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentRead

router = APIRouter()


@router.get("/", response_model=list[PaymentRead])
def list_payments(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[Payment]:
    return db.query(Payment).order_by(Payment.created_at.desc()).all()


@router.post("/", response_model=PaymentRead, status_code=status.HTTP_201_CREATED)
def create_payment(
    payload: PaymentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Payment:
    invoice = db.query(Invoice).filter(Invoice.id == payload.invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    if Decimal(payload.amount) <= 0:
        raise HTTPException(status_code=400, detail="El monto del pago debe ser mayor que cero")

    if Decimal(payload.amount) > Decimal(invoice.balance_due):
        raise HTTPException(status_code=400, detail="El pago excede el saldo pendiente")

    payment = Payment(**payload.model_dump())
    db.add(payment)
    db.commit()
    db.refresh(payment)

    paid_total = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(Payment.invoice_id == payload.invoice_id).scalar()
    new_balance = Decimal(invoice.total_amount) - Decimal(paid_total)
    invoice.balance_due = new_balance
    invoice.status = "paid" if new_balance <= 0 else "sent"
    db.commit()

    return payment
