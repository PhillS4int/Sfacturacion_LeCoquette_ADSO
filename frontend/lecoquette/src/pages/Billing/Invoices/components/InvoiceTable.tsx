import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Search,
  Download,
  Send,
  Eye,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  Ban,
  Trash2,
} from "lucide-react";

interface InvoiceTableRow {
  id: number;
  invoiceNumber: string;
  customer: string;
  issueDate: string;
  dueDate: string;
  status: string;
  amount: number;
}

type InvoiceStatus = "draft" | "paid" | "overdue" | "cancelled";

interface InvoiceTableProps {
  invoices: InvoiceTableRow[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onView: (invoice: InvoiceTableRow) => void;
  onSend: (invoice: InvoiceTableRow) => void;
  onDownload: (invoice: InvoiceTableRow) => void;
  onUpdateStatus?: (invoice: InvoiceTableRow, status: InvoiceStatus) => void;
  onDelete?: (invoice: InvoiceTableRow) => void;
}

function getStatusLabel(status: string) {
  switch ((status ?? "").toLowerCase()) {
    case "paid":
      return "Pagada";
    case "sent":
      return "Pendiente";
    case "overdue":
      return "Vencida";
    case "draft":
      return "Pendiente";
    case "cancelled":
      return "Anulada";
    default:
      return status || "Sin estado";
  }
}

function getStatusClass(status: string) {
  switch ((status ?? "").toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-700";
    case "sent":
      return "bg-yellow-100 text-yellow-700";
    case "overdue":
      return "bg-red-100 text-red-700";
    case "draft":
      return "bg-gray-100 text-gray-700";
    case "cancelled":
      return "bg-neutral-200 text-neutral-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function InvoiceTable({
  invoices,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onView,
  onSend,
  onDownload,
  onUpdateStatus,
  onDelete,
}: InvoiceTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Buscar facturas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="paid">Pagada</SelectItem>
              <SelectItem value="draft">Pendiente</SelectItem>
              <SelectItem value="overdue">Vencida</SelectItem>
              <SelectItem value="cancelled">Anulada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Factura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha de emisión</TableHead>
                <TableHead>Fecha de vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="w-12.5"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceNumber || invoice.id}</TableCell>
                  <TableCell>{invoice.customer || "Sin cliente"}</TableCell>
                  <TableCell>{invoice.issueDate || "-"}</TableCell>
                  <TableCell>{invoice.dueDate || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                        invoice.status
                      )}`}
                    >
                      {getStatusLabel(invoice.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    ${Number(invoice.amount ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(invoice)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onSend(invoice)}>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onDownload(invoice)}>
                          <Download className="mr-2 h-4 w-4" />
                          Descargar PDF
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onUpdateStatus?.(invoice, "paid")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como pagada
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onUpdateStatus?.(invoice, "draft")}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Marcar como pendiente
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onUpdateStatus?.(invoice, "overdue")}
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Marcar como vencida
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onUpdateStatus?.(invoice, "cancelled")}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Marcar como anulada
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onDelete?.(invoice)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar factura
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-gray-500">
                    No hay facturas para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}