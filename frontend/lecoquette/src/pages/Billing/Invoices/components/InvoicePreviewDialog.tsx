import { Button } from '../../../../components/ui/button';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from '../../../../components/ui/dialog';
import { Send, Download } from 'lucide-react';
import { InvoiceTemplate } from '../InvoiceTemplate';
import type { Invoice } from '../types/invoice.types';

interface InvoicePreviewDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
}

export function InvoicePreviewDialog({
  invoice,
  open,
  onOpenChange,
  onSend,
  onDownload,
}: InvoicePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vista previa de la factura</DialogTitle>
          <DialogDescription>
            Previsualiza la factura antes de enviarla o descargarla.
          </DialogDescription>
        </DialogHeader>

        {invoice && (
          <>
            <InvoiceTemplate invoice={invoice} />

            <div className="flex gap-2 justify-end border-t pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
              <Button variant="outline" onClick={() => onSend(invoice)}>
                <Send className="mr-2 h-4 w-4" />
                Enviar factura
              </Button>
              <Button onClick={() => onDownload(invoice)}>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}