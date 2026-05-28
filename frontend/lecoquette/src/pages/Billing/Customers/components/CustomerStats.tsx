import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import type { Customer } from '../mocks/MockCustomers';

interface CustomerStatsProps {
  customers: Customer[];
}

export function CustomerStats({ customers }: CustomerStatsProps) {
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);
  const activeCount = customers.filter((c) => c.status === 'activo').length;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-600">Clientes totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-gray-900">{customers.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-600">Clientes activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-gray-900">{activeCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-600">Ingresos totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-gray-900">
            ${totalRevenue.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}