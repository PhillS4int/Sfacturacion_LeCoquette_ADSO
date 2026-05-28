import { useEffect, useMemo, useState } from "react";
import { invoiceService } from "../../../../services/invoice.service";
import type { Invoice as DashboardInvoice } from "../types/types";
import type { Invoice as ApiInvoice } from "../../../../services/invoice.service";

export const useDashboardData = () => {
  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAll();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando facturas del dashboard:", error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const recentInvoices: DashboardInvoice[] = useMemo(() => {
    return [...invoices]
      .sort((a, b) => {
        const dateA = new Date(a.issue_date ?? a.fecha ?? "").getTime();
        const dateB = new Date(b.issue_date ?? b.fecha ?? "").getTime();
        return dateB - dateA;
      })
      .slice(0, 5)
      .map((invoice) => {
        const rawStatus = (invoice.status ?? invoice.estado ?? "").toLowerCase();

        const estado: "pendiente" | "atrasada" | "pagada" =
          rawStatus === "paid"
            ? "pagada"
            : rawStatus === "overdue"
            ? "atrasada"
            : "pendiente";

        return {
          id: invoice.invoice_number ?? `FAC-${invoice.id}`,
          cliente:
            invoice.customer ??
            invoice.cliente ??
            (invoice.customer_id ? `Cliente #${invoice.customer_id}` : "Sin cliente"),
          monto: `$${Number(
            invoice.total_amount ?? invoice.total ?? invoice.monto ?? 0
          ).toFixed(2)}`,
          estado,
          fecha: invoice.issue_date ?? invoice.fecha ?? "",
        };
      });
  }, [invoices]);

  const totalFacturado = useMemo(() => {
    return invoices.reduce(
      (acc, invoice) =>
        acc + Number(invoice.total_amount ?? invoice.total ?? invoice.monto ?? 0),
      0
    );
  }, [invoices]);

  const facturasPendientes = useMemo(() => {
    return invoices.filter((invoice) => {
      const status = (invoice.status ?? invoice.estado ?? "").toLowerCase();
      return status === "sent" || status === "pendiente" || status === "draft";
    }).length;
  }, [invoices]);

  const montoVencido = useMemo(() => {
    return invoices
      .filter((invoice) => {
        const status = (invoice.status ?? invoice.estado ?? "").toLowerCase();
        return status === "overdue" || status === "atrasada";
      })
      .reduce(
        (acc, invoice) =>
          acc + Number(invoice.total_amount ?? invoice.total ?? invoice.monto ?? 0),
        0
      );
  }, [invoices]);

  return {
    loading,
    recentInvoices,
    totalFacturado,
    facturasPendientes,
    montoVencido,
  };
};