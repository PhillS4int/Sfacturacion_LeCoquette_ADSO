import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';
import { Badge } from '../../../../components/ui/badge';
import { Mail, Phone, Building2 } from 'lucide-react';
import type { Customer } from '../mocks/MockCustomers';

interface CustomerTableProps {
  customers: Customer[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Facturas</TableHead>
            <TableHead>Ingresos totales</TableHead>
            <TableHead>Última factura</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-(--color-fondo) flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-(--color-primario)" />
                  </div>
                  <p className="text-gray-900">{customer.name}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {customer.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell>{customer.totalInvoices}</TableCell>
              <TableCell>${customer.totalRevenue.toLocaleString()}</TableCell>
              <TableCell>{customer.lastInvoice}</TableCell>
              <TableCell>
                <Badge
                  variant={customer.status === 'activo' ? 'default' : 'secondary'}
                  className={
                    customer.status === 'activo'
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                  }
                >
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}