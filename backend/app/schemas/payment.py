from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class PaymentCreate(BaseModel):
    invoice_id: int
    payment_method_id: int | None = None
    amount: Decimal
    payment_date: date
    reference: str | None = None
    notes: str | None = None


class PaymentRead(BaseModel):
    id: int
    invoice_id: int
    payment_method_id: int | None = None
    amount: Decimal
    payment_date: date
    reference: str | None = None
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
