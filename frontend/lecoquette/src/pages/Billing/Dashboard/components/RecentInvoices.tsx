import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import type { Invoice } from "../types/types";
import { InvoiceItem } from "./InvoiceItem";

export const RecentInvoices = ({ invoices }: { invoices: Invoice[] }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Facturas Recientes</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="bg-(--color-fondo) text-(--color-primario) hover:bg-(--color-fondo) hover:text-(--boton-hover)"
            onClick={() => navigate("/invoices")}
          >
            Ver Todo
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <InvoiceItem key={invoice.id} invoice={invoice} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No hay facturas recientes.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};