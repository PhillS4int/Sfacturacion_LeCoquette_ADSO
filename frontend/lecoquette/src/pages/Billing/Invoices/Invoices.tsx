import { useEffect, useMemo, useRef, useState } from "react";
import { InvoiceTable } from "./components/InvoiceTable";
import { CreateInvoiceDialog } from "./components/CreateInvoiceDialog";
import { InvoicePreviewDialog } from "./components/InvoicePreviewDialog";
import { InvoiceTemplate } from "./InvoiceTemplate";
import { invoiceService } from "../../../services/invoice.service";
import type {
  Invoice,
  InvoiceStatus,
} from "../../../services/invoice.service";

export function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error cargando facturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const mappedInvoices = useMemo(() => {
    return invoices.map((invoice: any) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number ?? invoice.numeroFactura ?? `FAC-${invoice.id ?? ""}`,
      customerId: invoice.customer_id ?? null,
      customer:
        invoice.customer ??
        invoice.cliente ??
        (invoice.customer_id ? `Cliente #${invoice.customer_id}` : "Sin cliente"),
      amount: Number(invoice.total_amount ?? invoice.total ?? invoice.monto ?? 0),
      total: Number(invoice.total_amount ?? invoice.total ?? invoice.monto ?? 0),
      subtotal: Number(invoice.subtotal ?? 0),
      taxAmount: Number(invoice.tax_amount ?? 0),
      discountAmount: Number(invoice.discount_amount ?? 0),
      balanceDue: Number(
        invoice.balance_due ?? invoice.total_amount ?? invoice.total ?? invoice.monto ?? 0
      ),
      status: invoice.status ?? invoice.estado ?? "",
      date: invoice.issue_date ?? invoice.fecha ?? "",
      issueDate: invoice.issue_date ?? invoice.fecha ?? "",
      dueDate: invoice.due_date ?? invoice.fechaVencimiento ?? "",
      currency: invoice.currency_code ?? "USD",
      notes: invoice.notes ?? "",
      items: invoice.items ?? [],
      raw: invoice,
    }));
  }, [invoices]);

  const filteredInvoices = mappedInvoices.filter((invoice) => {
    const search = searchTerm.toLowerCase();
    const invoiceNumber = (invoice.invoiceNumber ?? "").toLowerCase();
    const customer = (invoice.customer ?? "").toLowerCase();
    const status = (invoice.status ?? "").toLowerCase();

    const matchesSearch =
      invoiceNumber.includes(search) || customer.includes(search);

    const matchesStatus =
      statusFilter === "all" || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const handleDownloadPDF = () => {
    alert("La descarga PDF se conectará después.");
  };

  const handleSendInvoice = () => {
    alert("El envío de factura se conectará después.");
  };

  const handleUpdateStatus = async (
    invoice: any,
    newStatus: InvoiceStatus
  ) => {
    try {
      await invoiceService.updateStatus(invoice.id, newStatus);
      await loadInvoices();

      const statusLabels: Record<InvoiceStatus, string> = {
        draft: "pendiente",
        paid: "pagada",
        overdue: "vencida",
        cancelled: "anulada",
      };

      alert(`Factura marcada como ${statusLabels[newStatus]}.`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Error actualizando el estado de la factura"
      );
    }
  };

  const handleDeleteInvoice = async (invoice: any) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la factura ${invoice.invoiceNumber || invoice.id}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await invoiceService.remove(invoice.id);
      await loadInvoices();
      alert("Factura eliminada correctamente.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Error eliminando la factura"
      );
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-(--color-fondo) font-bold text-xl">Facturas</h2>
          <p className="mt-1 text-gray-600">
            Gestiona y realiza el seguimiento de todas tus facturas.
          </p>
        </div>

        <CreateInvoiceDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>

      {loading ? (
        <p>Cargando facturas...</p>
      ) : (
        <>
          <InvoiceTable
            invoices={filteredInvoices as any}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onView={handleViewInvoice}
            onSend={handleSendInvoice}
            onDownload={handleDownloadPDF}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteInvoice}
          />

          <InvoicePreviewDialog
            invoice={selectedInvoice}
            open={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
            onSend={handleSendInvoice}
            onDownload={handleDownloadPDF}
          />

          <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
            {selectedInvoice && (
              <InvoiceTemplate ref={invoiceRef} invoice={selectedInvoice} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Invoices;