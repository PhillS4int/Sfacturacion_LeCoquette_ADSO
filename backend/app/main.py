from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import base  # noqa: F401
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(title=settings.APP_NAME, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    return {"message": "API de facturacion activa"}


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(api_router, prefix=settings.API_V1_STR)
