from fastapi import APIRouter

from app.api.v1.endpoints import auth, customers, invoices, payment_methods, payments, roles, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(payment_methods.router, prefix="/payment-methods", tags=["payment-methods"])
api_router.include_router(customers.router, prefix="/customers", tags=["customers"])
api_router.include_router(invoices.router, prefix="/invoices", tags=["invoices"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
