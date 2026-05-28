from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.models.user import User
from app.schemas.invoice import InvoiceCreate, InvoiceFrontend, InvoiceRead
from app.services.invoice_service import calculate_invoice_totals

router = APIRouter()


class InvoiceStatusUpdate(BaseModel):
    status: str


STATUS_TRANSLATIONS = {
    "draft": "draft",
    "pendiente": "draft",
    "borrador": "draft",

    "paid": "paid",
    "pagada": "paid",
    "pagado": "paid",

    "overdue": "overdue",
    "vencida": "overdue",
    "vencido": "overdue",

    "cancelled": "cancelled",
    "canceled": "cancelled",
    "anulada": "cancelled",
    "anulado": "cancelled",
}

ALLOWED_STATUSES = ["draft", "paid", "overdue", "cancelled"]


@router.get("/", response_model=list[InvoiceFrontend])
def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[InvoiceFrontend]:
    invoices = (
        db.query(Invoice)
        .options(joinedload(Invoice.customer))
        .order_by(Invoice.created_at.desc())
        .all()
    )

    return [
        InvoiceFrontend(
            id=invoice.id,
            cliente=invoice.customer.full_name if invoice.customer else "Cliente no encontrado",
            monto=float(invoice.subtotal or 0),
            total=float(invoice.total_amount or 0),
            estado=invoice.status,
            fecha=invoice.issue_date.isoformat() if invoice.issue_date else None,
            fechaVencimiento=invoice.due_date.isoformat() if invoice.due_date else None,
            numeroFactura=invoice.invoice_number,
        )
        for invoice in invoices
    ]


@router.post("/", response_model=InvoiceRead, status_code=status.HTTP_201_CREATED)
def create_invoice(
    payload: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Invoice:
    customer = (
        db.query(Customer)
        .filter(Customer.id == payload.customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )

    if not payload.items or len(payload.items) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La factura debe tener al menos un item",
        )

    totals = calculate_invoice_totals(payload.items)

    if totals["total_amount"] <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El total de la factura debe ser mayor que cero",
        )

    count = db.query(Invoice).count() + 1
    invoice_number = f"FAC-{date.today().year}-{count:05d}"

    existing_invoice = (
        db.query(Invoice)
        .filter(Invoice.invoice_number == invoice_number)
        .first()
    )

    while existing_invoice:
        count += 1
        invoice_number = f"FAC-{date.today().year}-{count:05d}"
        existing_invoice = (
            db.query(Invoice)
            .filter(Invoice.invoice_number == invoice_number)
            .first()
        )

    normalized_status = STATUS_TRANSLATIONS.get(
        str(payload.status).lower(),
        str(payload.status).lower(),
    )

    if normalized_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Estado de factura no válido",
        )

    invoice = Invoice(
        customer_id=payload.customer_id,
        created_by_user_id=current_user.id,
        invoice_number=invoice_number,
        issue_date=payload.issue_date,
        due_date=payload.due_date,
        status=normalized_status,
        currency_code=payload.currency_code,
        subtotal=totals["subtotal"],
        tax_amount=totals["tax_amount"],
        discount_amount=totals["discount_amount"],
        total_amount=totals["total_amount"],
        balance_due=totals["balance_due"],
        notes=payload.notes,
    )

    try:
        db.add(invoice)
        db.flush()

        for item in totals["items"]:
            db.add(InvoiceItem(invoice_id=invoice.id, **item))

        db.commit()
        db.refresh(invoice)

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear la factura",
        )

    return (
        db.query(Invoice)
        .options(joinedload(Invoice.items), joinedload(Invoice.customer))
        .filter(Invoice.id == invoice.id)
        .first()
    )


@router.get("/{invoice_id}", response_model=InvoiceRead)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Invoice:
    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.items), joinedload(Invoice.customer))
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Factura no encontrada",
        )

    return invoice


@router.put("/{invoice_id}/status", response_model=InvoiceRead)
def update_invoice_status(
    invoice_id: int,
    payload: InvoiceStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Invoice:
    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.items), joinedload(Invoice.customer))
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Factura no encontrada",
        )

    requested_status = payload.status.strip().lower()
    normalized_status = STATUS_TRANSLATIONS.get(requested_status)

    if normalized_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Estado de factura no válido. Usa: draft, paid, overdue o cancelled",
        )

    invoice.status = normalized_status

    if normalized_status in ["paid", "cancelled"]:
        invoice.balance_due = 0

    db.commit()
    db.refresh(invoice)

    return (
        db.query(Invoice)
        .options(joinedload(Invoice.items), joinedload(Invoice.customer))
        .filter(Invoice.id == invoice.id)
        .first()
    )


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.items))
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Factura no encontrada",
        )

    protected_statuses = ["paid", "pagada", "pagado", "completed", "completada"]

    if invoice.status and invoice.status.lower() in protected_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar una factura pagada o completada",
        )

    try:
        db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice_id).delete()
        db.delete(invoice)
        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar la factura",
        )

    return None