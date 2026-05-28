import type { Invoice } from "../types/types";

export const InvoiceItem = ({ invoice }: { invoice: Invoice }) => {
  const statusStyles = {
    pagada: "bg-green-100 text-green-700",
    pendiente: "bg-yellow-100 text-yellow-700",
    atrasada: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="flex-1">
        <p className="text-gray-900">{invoice.cliente}</p>
        <p className="text-sm text-gray-600">
          {invoice.id} • {invoice.fecha}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[invoice.estado]}`}>
          {invoice.estado}
        </span>

        <span className="text-gray-900 min-w-25 text-right">
          {invoice.monto}
        </span>
      </div>
    </div>
  );
};