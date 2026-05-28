import type { Invoice } from '../types/invoice.types';

export const mockInvoices: Invoice[] = [
  { id: 'INV-001', cliente: 'Acme Corporation',  monto: 5200.00, total: 5200.00, estado: 'pagada',   fecha: '2025-10-15', fechaVencimiento: '2025-10-30' },
  { id: 'INV-002', cliente: 'Tech Startup Inc',  monto: 3450.00, total: 3450.00, estado: 'pendiente', fecha: '2025-10-14', fechaVencimiento: '2025-10-28' },
  { id: 'INV-003', cliente: 'Global Solutions',  monto: 8900.00, total: 8900.00, estado: 'atrasada',  fecha: '2025-09-30', fechaVencimiento: '2025-10-14' },
  { id: 'INV-004', cliente: 'Digital Agency',    monto: 2100.00, total: 2100.00, estado: 'pagada',   fecha: '2025-10-13', fechaVencimiento: '2025-10-27' },
  { id: 'INV-005', cliente: 'Retail Co.',        monto: 4750.00, total: 4750.00, estado: 'pendiente', fecha: '2025-10-12', fechaVencimiento: '2025-10-26' },
  { id: 'INV-006', cliente: 'Marketing Firm',    monto: 6300.00, total: 6300.00, estado: 'borrador',  fecha: '2025-10-16', fechaVencimiento: '2025-10-30' },
  { id: 'INV-007', cliente: 'Consulting Group',  monto: 9500.00, total: 9500.00, estado: 'pagada',   fecha: '2025-10-10', fechaVencimiento: '2025-10-24' },
  { id: 'INV-008', cliente: 'E-commerce Store',  monto: 1800.00, total: 1800.00, estado: 'pendiente', fecha: '2025-10-09', fechaVencimiento: '2025-10-23' },
];

// Ejemplo: si total = monto + 10% de impuesto:
// { id: 'INV-001', cliente: 'Acme Corporation', monto: 5200.00, total: 5720.00, ... }