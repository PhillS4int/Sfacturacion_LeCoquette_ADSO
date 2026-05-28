import { useState } from "react";
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
import { customerService } from "../../../../services/customer.service";

interface CreateCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCustomerDialog({
  open,
  onOpenChange,
}: CreateCustomerDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
  };

  const handleCreateCustomer = async () => {
    try {
      setMessage("");

      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setMessage("Completa nombre, correo y teléfono.");
        return;
      }

      setLoading(true);

      await customerService.create({
        full_name: fullName,
        email,
        phone,
        status: "activo",
      });

      setMessage("Cliente creado correctamente.");
      resetForm();

      setTimeout(() => {
        onOpenChange(false);
        setMessage("");
      }, 1000);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Error creando cliente"
      );
    } finally {
      setLoading(false);
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
          Agregar cliente
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar nuevo cliente</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del cliente para agregarlo al sistema de facturación.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Nombre del cliente</Label>
            <Input
              id="full-name"
              placeholder="Ingresa el nombre del cliente"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+57 300 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {message && (
            <p className="text-sm text-(--color-fondo)">
              {message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            className="bg-(--color-fondo) text-(--color-primario)"
            onClick={handleCreateCustomer}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Agregar Cliente"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}