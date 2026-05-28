import { apiRequest } from "./api";
import { authService } from "./auth.service";

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount_amount: number;
  line_total?: number;
}

export type InvoiceStatus = "draft" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: number;
  customer_id: number;
  invoice_number?: string;
  customer?: string;
  cliente?: string;
  issue_date?: string;
  fecha?: string;
  due_date?: string;
  fechaVencimiento?: string;
  status?: string;
  estado?: string;
  currency_code?: string;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  total?: number;
  monto?: number;
  balance_due?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  items?: InvoiceItem[];
}

export interface CreateInvoicePayload {
  customer_id: number;
  issue_date: string;
  due_date: string;
  currency_code: string;
  notes: string;
  status: string;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    discount_amount: number;
  }[];
}

export const invoiceService = {
  async getAll(): Promise<Invoice[]> {
    return apiRequest<Invoice[]>("/invoices/", {
      token: authService.getToken(),
    });
  },

  async create(payload: CreateInvoicePayload): Promise<Invoice> {
    return apiRequest<Invoice>("/invoices/", {
      method: "POST",
      body: payload,
      token: authService.getToken(),
    });
  },

  async updateStatus(invoiceId: number, status: InvoiceStatus): Promise<Invoice> {
    return apiRequest<Invoice>(`/invoices/${invoiceId}/status`, {
      method: "PUT",
      body: { status },
      token: authService.getToken(),
    });
  },

  async remove(invoiceId: number): Promise<void> {
    return apiRequest<void>(`/invoices/${invoiceId}`, {
      method: "DELETE",
      token: authService.getToken(),
    });
  },
};