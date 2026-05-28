# Backend FastAPI + MySQL para LeCoquette

Este backend esta pensado para trabajar con la base de datos MySQL `lecoquette_facturacion` y con tu frontend React/Vite.

## Que incluye

- Login con JWT
- Registro de usuarios
- Perfil del usuario autenticado
- CRUD de clientes
- CRUD basico de facturas
- Registro de pagos
- Recalculo de saldo pendiente de cada factura
- Script de semillas para crear usuario administrador inicial

## 1. Preparacion

Copia `.env.example` a `.env`.

```bash
cp .env.example .env
```

Instala dependencias:

```bash
pip install -r requirements.txt
```

## 2. Base de datos

Primero ejecuta tu script MySQL:

- `lecoquette_mysql_schema.sql`

Luego crea el usuario administrador inicial:

```bash
python -m scripts.seed_data
```

Credenciales iniciales por defecto:

- correo: `admin@lecoquette.com`
- contrasena: `admin123`

## 3. Ejecutar

```bash
uvicorn app.main:app --reload
```

## 4. Endpoints principales

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET /api/v1/users/me`
- `GET /api/v1/roles/`
- `GET /api/v1/payment-methods/`
- `GET /api/v1/customers/`
- `POST /api/v1/customers/`
- `PUT /api/v1/customers/{customer_id}`
- `GET /api/v1/invoices/`
- `POST /api/v1/invoices/`
- `GET /api/v1/invoices/{invoice_id}`
- `POST /api/v1/payments/`

## 5. Nota importante

Los nombres internos de la base estan en ingles, pero varias respuestas estan normalizadas para que tu frontend pueda usarlas en espanol sin problema.
