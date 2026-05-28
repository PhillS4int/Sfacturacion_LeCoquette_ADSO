import {
  DollarSign,
  FileText,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import type { Invoice } from "../types/types";

interface StatsGridProps {
  totalFacturado: number;
  facturasPendientes: number;
  montoVencido: number;
  recentInvoices: Invoice[];
}

export const StatsGrid = ({
  totalFacturado,
  facturasPendientes,
  montoVencido,
  recentInvoices,
}: StatsGridProps) => {
  const totalEsteMes = recentInvoices.reduce((acc, invoice) => {
    const montoLimpio = Number(
      String(invoice.monto).replace("$", "").replace(/,/g, "")
    );
    return acc + (isNaN(montoLimpio) ? 0 : montoLimpio);
  }, 0);

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Ingresos Totales"
        value={`$${Number(totalFacturado ?? 0).toFixed(2)}`}
        icon={<DollarSign className="h-4 w-4 text-gray-600" />}
        description={
          <p className="mt-1 flex items-center text-xs text-gray-600">
            <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
            <span className="text-green-600">Datos reales</span> de facturación
          </p>
        }
      />

      <StatsCard
        title="Facturas Pendientes"
        value={String(facturasPendientes ?? 0)}
        icon={<FileText className="h-4 w-4 text-gray-600" />}
        description={
          <p className="mt-1 text-xs text-gray-600">
            Facturas en borrador o pendientes
          </p>
        }
      />

      <StatsCard
        title="Montos Vencidos"
        value={`$${Number(montoVencido ?? 0).toFixed(2)}`}
        icon={<Clock className="h-4 w-4 text-gray-600" />}
        description={
          <p className="mt-1 flex items-center text-xs text-gray-600">
            <ArrowDownRight className="mr-1 h-3 w-3 text-red-600" />
            <span className="text-red-600">Facturas atrasadas</span>
          </p>
        }
      />

      <StatsCard
        title="Este Mes"
        value={`$${Number(totalEsteMes ?? 0).toFixed(2)}`}
        icon={<TrendingUp className="h-4 w-4 text-gray-600" />}
        description={
          <p className="mt-1 text-xs text-gray-600">
            Basado en las facturas recientes
          </p>
        }
      />
    </div>
  );
};