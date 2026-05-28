import { StatsGrid } from "./components/StatsGrid";
import { RecentInvoices } from "./components/RecentInvoices";
import { useDashboardData } from "./hooks/useDashboadData";

export function Dashboard() {
  const {
    recentInvoices,
    totalFacturado,
    facturasPendientes,
    montoVencido,
  } = useDashboardData();

  return (
    <div className="px-4 sm:px-6 lg:px-8 background-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-(--color-fondo)">
          Panel Principal
        </h2>
        <p className="mt-1 text-gray-600">
          ¡Bienvenid@! Aquí tienes una descripción general de tu facturación.
        </p>
      </div>

      <StatsGrid
        totalFacturado={totalFacturado}
        facturasPendientes={facturasPendientes}
        montoVencido={montoVencido}
        recentInvoices={recentInvoices}
      />

      <RecentInvoices invoices={recentInvoices} />
    </div>
  );
}

export default Dashboard;