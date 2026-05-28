from decimal import Decimal

from app.schemas.invoice import InvoiceItemCreate


def calculate_invoice_totals(items: list[InvoiceItemCreate]) -> dict:
    subtotal = Decimal("0.00")
    tax_total = Decimal("0.00")
    discount_total = Decimal("0.00")
    parsed_items: list[dict] = []

    for item in items:
        line_subtotal = item.quantity * item.unit_price
        line_discount = item.discount_amount
        line_taxable = line_subtotal - line_discount
        line_tax = line_taxable * (item.tax_rate / Decimal("100.00"))
        line_total = line_taxable + line_tax

        subtotal += line_subtotal
        tax_total += line_tax
        discount_total += line_discount

        parsed_items.append(
            {
                "description": item.description,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "tax_rate": item.tax_rate,
                "discount_amount": item.discount_amount,
                "line_total": line_total,
            }
        )

    total_amount = subtotal - discount_total + tax_total
    return {
        "subtotal": subtotal,
        "tax_amount": tax_total,
        "discount_amount": discount_total,
        "total_amount": total_amount,
        "balance_due": total_amount,
        "items": parsed_items,
    }
