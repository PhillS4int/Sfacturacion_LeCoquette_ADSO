import { apiRequest } from "./api";
import { authService } from "./auth.service";

export interface Customer {
  id: number;
  full_name: string;
  company_name?: string | null;
  email: string;
  phone: string;
  tax_id?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerPayload {
  full_name: string;
  email: string;
  phone: string;
  status?: string;
}

export const customerService = {
  async getAll(): Promise<Customer[]> {
    return apiRequest<Customer[]>("/customers/", {
      token: authService.getToken(),
    });
  },

  async create(payload: CreateCustomerPayload): Promise<Customer> {
    return apiRequest<Customer>("/customers/", {
      method: "POST",
      body: payload,
      token: authService.getToken(),
    });
  },
};