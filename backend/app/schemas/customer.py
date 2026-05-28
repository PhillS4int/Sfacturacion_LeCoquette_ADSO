from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class CustomerCreate(BaseModel):
    full_name: str
    company_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    tax_id: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str | None = None
    notes: str | None = None
    is_active: bool = True


class CustomerUpdate(BaseModel):
    full_name: str | None = None
    company_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    tax_id: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str | None = None
    notes: str | None = None
    is_active: bool | None = None


class CustomerRead(BaseModel):
    id: int
    full_name: str
    company_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    tax_id: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str | None = None
    notes: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CustomerFrontend(BaseModel):
    id: int
    name: str
    email: str | None = None
    phone: str | None = None
    totalInvoices: int
    totalRevenue: float
    status: str
    lastInvoice: str | None = None
