import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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

const statusColors: Record<string, string> = {
  paid: '#22c55e',
  draft: '#9ca3af',
  overdue: '#ef4444',
  cancelled: '#737373',
};

const statusLabels: Record<string, string> = {
  paid: 'Pagadas',
  draft: 'Pendientes',
  overdue: 'Vencidas',
  cancelled: 'Anuladas',
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

export function OverviewTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        const data = await invoiceService.getAll();
        setInvoices(data);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error cargando análisis');
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
      const dateValue = getInvoiceDate(invoice);
      const month = getMonthLabel(dateValue);
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

  const statusData = useMemo(() => {
    const totalInvoices = invoices.length;

    if (totalInvoices === 0) {
      return [];
    }

    const grouped = new Map<string, number>();

    invoices.forEach((invoice) => {
      const status = getInvoiceStatus(invoice);
      grouped.set(status, (grouped.get(status) || 0) + 1);
    });

    return Array.from(grouped.entries()).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: Math.round((count / totalInvoices) * 100),
      count,
      color: statusColors[status] || '#9ca3af',
    }));
  }, [invoices]);

  if (loading) {
    return <p>Cargando análisis...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tendencias de ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <p className="text-sm text-gray-500">No hay facturas registradas.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#CCAD7C"
                    strokeWidth={2}
                    name="Ingresos ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución del estado de las facturas</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-sm text-gray-500">No hay estados de facturas para mostrar.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recuento de facturas mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <p className="text-sm text-gray-500">No hay facturas para graficar.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="invoices" fill="#CCAD7C" name="Facturas" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}