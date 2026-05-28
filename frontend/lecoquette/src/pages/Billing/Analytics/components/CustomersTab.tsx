import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { invoiceService, type Invoice } from '../../../../services/invoice.service';

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
};

function getInvoiceCustomer(invoice: Invoice): string {
  return (
    invoice.customer ||
    invoice.cliente ||
    (invoice.customer_id ? `Cliente #${invoice.customer_id}` : 'Sin cliente')
  );
}

function getInvoiceTotal(invoice: Invoice): number {
  return Number(invoice.total_amount ?? invoice.total ?? invoice.monto ?? 0);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function CustomersTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        const data = await invoiceService.getAll();
        setInvoices(data);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error cargando clientes');
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  const topCustomers = useMemo(() => {
    const grouped = new Map<
      string,
      {
        name: string;
        invoices: number;
        revenue: number;
      }
    >();

    invoices.forEach((invoice) => {
      const customerName = getInvoiceCustomer(invoice);
      const total = getInvoiceTotal(invoice);

      const current = grouped.get(customerName) || {
        name: customerName,
        invoices: 0,
        revenue: 0,
      };

      current.invoices += 1;
      current.revenue += total;

      grouped.set(customerName, current);
    });

    return Array.from(grouped.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [invoices]);

  if (loading) {
    return <p>Cargando clientes...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Principales clientes por ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          {topCustomers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay facturas registradas para calcular ingresos por cliente.
            </p>
          ) : (
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div
                  key={customer.name}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-(--color-fondo) text-(--color-primario)">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-600">
                        {customer.invoices} factura{customer.invoices === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-900">
                      {formatCurrency(customer.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desglose de ingresos por cliente</CardTitle>
        </CardHeader>
        <CardContent>
          {topCustomers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay datos suficientes para mostrar el gráfico.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCustomers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={150} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="revenue" fill="#CCAD7C" name="Ingresos reales" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}