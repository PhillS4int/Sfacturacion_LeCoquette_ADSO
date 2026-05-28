from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.user import User
from app.schemas.customer import (
    CustomerCreate,
    CustomerFrontend,
    CustomerRead,
    CustomerUpdate,
)

router = APIRouter()


@router.get("/", response_model=list[CustomerFrontend])
def list_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customers = (
        db.query(Customer)
        .order_by(Customer.id.desc())
        .all()
    )

    return [
        {
            "id": customer.id,
            "name": customer.full_name,
            "email": customer.email,
            "phone": customer.phone,
            "totalInvoices": 0,
            "totalRevenue": 0,
            "status": "activo" if customer.is_active else "inactivo",
            "lastInvoice": None,
        }
        for customer in customers
    ]


@router.post("/", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_customer = (
        db.query(Customer)
        .filter(Customer.email == customer_data.email)
        .first()
    )

    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un cliente con este correo electrónico",
        )

    customer = Customer(**customer_data.model_dump())

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


@router.get("/{customer_id}", response_model=CustomerRead)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )

    return customer


@router.put("/{customer_id}", response_model=CustomerRead)
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )

    update_data = customer_data.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"]:
        existing_customer = (
            db.query(Customer)
            .filter(
                Customer.email == update_data["email"],
                Customer.id != customer_id,
            )
            .first()
        )

        if existing_customer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe otro cliente con este correo electrónico",
            )

    for field, value in update_data.items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)

    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )

    invoices_count = (
        db.query(Invoice)
        .filter(Invoice.customer_id == customer_id)
        .count()
    )

    if invoices_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar el cliente porque tiene facturas asociadas",
        )

    db.delete(customer)
    db.commit()

    return None