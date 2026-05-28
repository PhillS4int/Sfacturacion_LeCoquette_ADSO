import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { customerService } from "../../../../services/customer.service";
import { invoiceService } from "../../../../services/invoice.service";

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CustomerOption {
  id: number;
  full_name: string;
  email: string;
}

export function CreateInvoiceDialog({
  open,
  onOpenChange,
}: CreateInvoiceDialogProps) {
  const today = new Date().toISOString().split("T")[0];

  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [customerId, setCustomerId] = useState("");
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [taxRate, setTaxRate] = useState("19");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;

    const loadCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const data = await customerService.getAll();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando clientes:", error);
        setCustomers([]);
        setMessage(
          error instanceof Error ? error.message : "Error cargando clientes"
        );
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, [open]);

  const quantityValue = Number(quantity || 0);
  const unitPriceValue = Number(unitPrice || 0);
  const taxRateValue = Number(taxRate || 0);

  const subtotal = useMemo(() => {
    return quantityValue * unitPriceValue;
  }, [quantityValue, unitPriceValue]);

  const taxAmount = useMemo(() => {
    return subtotal * (taxRateValue / 100);
  }, [subtotal, taxRateValue]);

  const total = useMemo(() => {
    return subtotal + taxAmount;
  }, [subtotal, taxAmount]);

  const resetForm = () => {
    setCustomerId("");
    setIssueDate(today);
    setDueDate("");
    setDescription("");
    setQuantity("1");
    setUnitPrice("");
    setTaxRate("19");
    setNotes("");
  };

  const handleCreateInvoice = async () => {
    try {
      setMessage("");

      if (!customerId) {
        setMessage("Selecciona un cliente.");
        return;
      }

      if (!issueDate || !dueDate) {
        setMessage("Completa las fechas.");
        return;
      }

      if (!description.trim()) {
        setMessage("Ingresa la descripción del artículo.");
        return;
      }

      if (quantityValue <= 0 || unitPriceValue <= 0) {
        setMessage("La cantidad y el precio deben ser mayores a 0.");
        return;
      }

      setSaving(true);

      await invoiceService.create({
        customer_id: Number(customerId),
        issue_date: issueDate,
        due_date: dueDate,
        currency_code: "USD",
        notes,
        status: "draft",
        items: [
          {
            description,
            quantity: quantityValue,
            unit_price: unitPriceValue,
            tax_rate: taxRateValue,
            discount_amount: 0,
          },
        ],
      });

      setMessage("Factura creada correctamente.");
      resetForm();

      setTimeout(() => {
        onOpenChange(false);
        setMessage("");
      }, 1000);
    } catch (error) {
      console.error("Error creando factura:", error);
      setMessage(
        error instanceof Error ? error.message : "Error creando factura"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) {
          resetForm();
          setMessage("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-(--color-fondo) text-(--color-primario)">
          <Plus className="mr-2 h-4 w-4" />
          Crear factura
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nueva factura</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear una nueva factura para tu cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cliente">Cliente</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger id="cliente">
                <SelectValue
                  placeholder={
                    loadingCustomers
                      ? "Cargando clientes..."
                      : customers.length === 0
                      ? "No hay clientes disponibles"
                      : "Selecciona un cliente"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {loadingCustomers ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Cargando clientes...
                  </div>
                ) : customers.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No hay clientes disponibles
                  </div>
                ) : (
                  customers.map((customer) => (
                    <SelectItem key={customer.id} value={String(customer.id)}>
                      {customer.full_name} - {customer.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="invoiceDate">Fecha de emisión</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fechaVencimiento">Fecha de vencimiento</Label>
              <Input
                id="fechaVencimiento"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Artículo de la factura</Label>
            <div className="space-y-3 rounded-md border p-4">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Input
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    placeholder="Cant."
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    placeholder="Precio"
                    type="number"
                    min="0"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                  />
                </div>

                <div className="col-span-1">
                  <Input
                    placeholder="%"
                    type="number"
                    min="0"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Input value={total.toFixed(2)} disabled />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              placeholder="Agrega notas adicionales..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {message && (
            <p className="text-sm text-(--color-fondo)">
              {message}
            </p>
          )}

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Impuesto ({taxRateValue}%)</span>
              <span className="text-gray-900">${taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            className="bg-(--color-fondo) text-(--color-primario)"
            onClick={handleCreateInvoice}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Crear factura"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}