from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class InvoiceItemCreate(BaseModel):
    description: str
    quantity: Decimal
    unit_price: Decimal
    tax_rate: Decimal = Decimal("0.00")
    discount_amount: Decimal = Decimal("0.00")


class InvoiceItemRead(BaseModel):
    id: int
    description: str
    quantity: Decimal
    unit_price: Decimal
    tax_rate: Decimal
    discount_amount: Decimal
    line_total: Decimal

    model_config = ConfigDict(from_attributes=True)


class InvoiceCreate(BaseModel):
    customer_id: int
    issue_date: date
    due_date: date | None = None
    currency_code: str = "USD"
    notes: str | None = None
    status: str = "draft"
    items: list[InvoiceItemCreate]


class InvoiceRead(BaseModel):
    id: int
    customer_id: int
    invoice_number: str
    issue_date: date
    due_date: date | None = None
    status: str
    currency_code: str
    subtotal: Decimal
    tax_amount: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    balance_due: Decimal
    notes: str | None = None
    created_at: datetime
    updated_at: datetime
    items: list[InvoiceItemRead] = []

    model_config = ConfigDict(from_attributes=True)


class InvoiceFrontend(BaseModel):
    id: int
    cliente: str
    monto: float
    total: float
    estado: str
    fecha: str
    fechaVencimiento: str | None = None
    numeroFactura: str
