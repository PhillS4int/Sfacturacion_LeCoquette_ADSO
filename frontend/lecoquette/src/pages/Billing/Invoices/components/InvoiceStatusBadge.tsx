import { Badge } from '../../../../components/ui/badge';
import type { InvoiceStatus } from '../types/invoice.types';
 
interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}
 
const STATUS_CONFIG: Record<
  InvoiceStatus,
  { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }
> = {
  pagada:   { variant: 'default',     className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  pendiente:{ variant: 'default',     className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
  atrasada: { variant: 'destructive', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  borrador: { variant: 'secondary',   className: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
};
 
export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.borrador;
  const label  = status.charAt(0).toUpperCase() + status.slice(1);
 
  return (
    <Badge variant={config.variant} className={config.className}>
      {label}
    </Badge>
  );
}