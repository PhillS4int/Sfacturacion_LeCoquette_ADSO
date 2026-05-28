import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { invoiceService, type Invoice } from '../../../../services/invoice.service';

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
};

function getInvoiceDate(invoice: Invoice): string {
  return invoice.issue_date || invoice.fecha || '';
}

function getInvoiceTotal(invoice: Invoice): number {
  return Number(invoice.total_amount ?? invoice.total ?? invoice.monto ?? 0);
}

function getInvoiceStatus(invoice: Invoice): string {
  return String(invoice.status ?? invoice.estado ?? 'draft').toLowerCase();
}

function getMonthLabel(dateValue: string): string {
  if (!dateValue) {
    return 'Sin fecha';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }

  return date.toLocaleDateString('es-CO', {
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function RevenueTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        const data = await invoiceService.getAll();
        setInvoices(data);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error cargando ingresos');
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  const revenueData = useMemo(() => {
    const grouped = new Map<
      string,
      {
        month: string;
        revenue: number;
        invoices: number;
      }
    >();

    invoices.forEach((invoice) => {
      const month = getMonthLabel(getInvoiceDate(invoice));
      const total = getInvoiceTotal(invoice);

      const current = grouped.get(month) || {
        month,
        revenue: 0,
        invoices: 0,
      };

      current.revenue += total;
      current.invoices += 1;

      grouped.set(month, current);
    });

    return Array.from(grouped.values());
  }, [invoices]);

  const summaryCards = useMemo(() => {
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce(
      (sum, invoice) => sum + getInvoiceTotal(invoice),
      0
    );

    const paidInvoices = invoices.filter(
      (invoice) => getInvoiceStatus(invoice) === 'paid'
    );

    const paidRevenue = paidInvoices.reduce(
      (sum, invoice) => sum + getInvoiceTotal(invoice),
      0
    );

    const averageInvoice =
      totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    const collectionRate =
      totalInvoices > 0 ? (paidInvoices.length / totalInvoices) * 100 : 0;

    return [
      {
        title: 'Ingresos totales',
        value: formatCurrency(totalRevenue),
        description: `En ${totalInvoices} factura${totalInvoices === 1 ? '' : 's'}`,
      },
      {
        title: 'Valor promedio de la factura',
        value: formatCurrency(averageInvoice),
        description: 'Promedio por factura registrada',
      },
      {
        title: 'Tasa de cobro',
        value: `${collectionRate.toFixed(1)}%`,
        description: `${paidInvoices.length} factura${paidInvoices.length === 1 ? '' : 's'} pagada${paidInvoices.length === 1 ? '' : 's'} por ${formatCurrency(paidRevenue)}`,
      },
    ];
  }, [invoices]);

  if (loading) {
    return <p>Cargando ingresos...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900">{card.value}</div>
              <p className="text-xs text-gray-600 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingresos por mes</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <p className="text-sm text-gray-500">No hay facturas registradas para calcular ingresos.</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="revenue" fill="#CCAD7C" name="Ingresos reales" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}