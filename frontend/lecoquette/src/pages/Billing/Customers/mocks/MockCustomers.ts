export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalInvoices: number;
  totalRevenue: number;
  status: 'activo' | 'inactivo';
  lastInvoice: string;
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    totalInvoices: 12,
    totalRevenue: 45230.00,
    status: 'activo',
    lastInvoice: '2025-10-15',
  },
  {
    id: '2',
    name: 'Tech Startup Inc',
    email: 'billing@techstartup.com',
    phone: '+1 (555) 234-5678',
    totalInvoices: 8,
    totalRevenue: 28900.00,
    status: 'activo',
    lastInvoice: '2025-10-14',
  },
  {
    id: '3',
    name: 'Global Solutions',
    email: 'finance@globalsolutions.com',
    phone: '+1 (555) 345-6789',
    totalInvoices: 15,
    totalRevenue: 67500.00,
    status: 'activo',
    lastInvoice: '2025-09-30',
  },
  {
    id: '4',
    name: 'Digital Agency',
    email: 'accounts@digitalagency.com',
    phone: '+1 (555) 456-7890',
    totalInvoices: 6,
    totalRevenue: 15800.00,
    status: 'activo',
    lastInvoice: '2025-10-13',
  },
  {
    id: '5',
    name: 'Retail Co.',
    email: 'billing@retailco.com',
    phone: '+1 (555) 567-8901',
    totalInvoices: 3,
    totalRevenue: 8200.00,
    status: 'inactivo',
    lastInvoice: '2025-08-20',
  },
];