export interface Invoice {
  id: string;
  cliente: string;
  monto: number;
  total: number;
  estado: 'pagada' | 'pendiente' | 'atrasada' | 'borrador';
  fecha: string;
  fechaVencimiento: string;
}
 
export type InvoiceStatus = Invoice['estado'];