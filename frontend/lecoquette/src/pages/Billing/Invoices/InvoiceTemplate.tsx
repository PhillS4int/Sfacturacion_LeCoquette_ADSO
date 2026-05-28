import { forwardRef } from 'react';

interface InvoiceItem {
  descripcion: string;
  cantidad: number;
  tasa: number;
  monto: number;
}

interface InvoiceData {
  id: string;
  cliente: string;
  clienteEmail?: string;
  clienteDireccion?: string;
  fecha: string;
  fechaVencimiento: string;
  estado: string;
  articulo?: InvoiceItem[];
  subtotal?: number;
  impuesto?: number;
  total: number;
}

interface InvoiceTemplateProps {
  invoice: InvoiceData;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ invoice }, ref) => {
    const items = invoice.articulo || [
      { descripcion: 'Servicios profesionales', cantidad: 1, tasa: invoice.total / 1.1, monto: invoice.total / 1.1 },
    ];

    const subtotal = invoice.subtotal || items.reduce((sum, item) => sum + item.monto, 0);
    const tax = invoice.impuesto || subtotal * 0.1;
    const total = invoice.total;

    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-200">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2" style={{ fontWeight: 'bold' }}>Le Coquette</h1>
            <p className="text-gray-600 text-sm">Nombre de tu empresa</p>
            <p className="text-gray-600 text-sm">Dirección de tu empresa</p>
            <p className="text-gray-600 text-sm">Ciudad en donde se encuentra</p>
            <p className="text-gray-600 text-sm">tucorreo@tuempresa.com</p>
            <p className="text-gray-600 text-sm">+1 (555) 000-0000</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl text-gray-900 mb-2" style={{ fontWeight: 'bold' }}>FACTURA</h2>
            <p className="text-gray-600 text-sm mb-1">
              <span style={{ fontWeight: 'bold' }}>Factura #:</span> {invoice.id}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <span style={{ fontWeight: 'bold' }}>Emisión:</span> {invoice.fecha}
            </p>
            <p className="text-gray-600 text-sm">
              <span style={{ fontWeight: 'bold' }}>Vencimiento:</span> {invoice.fechaVencimiento}
            </p>
          </div>
        </div>

        {/* COBRAR A */}
        <div className="mb-8">
          <h3 className="text-sm text-gray-500 mb-2" style={{ fontWeight: 'bold' }}>COBRAR A</h3>
          <p className="text-gray-900 mb-1" style={{ fontWeight: 'bold' }}>{invoice.cliente}</p>
          {invoice.clienteEmail && (
            <p className="text-gray-600 text-sm">{invoice.clienteEmail}</p>
          )}
          {invoice.clienteDireccion && (
            <p className="text-gray-600 text-sm">{invoice.clienteDireccion}</p>
          )}
        </div>

        {/* Tabla de artículos */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-2 text-gray-700 text-sm" style={{ fontWeight: 'bold' }}>
                DESCRIPCIÓN
              </th>
              <th className="text-center py-3 px-2 text-gray-700 text-sm" style={{ fontWeight: 'bold', width: '80px' }}>
                CANT.
              </th>
              <th className="text-right py-3 px-2 text-gray-700 text-sm" style={{ fontWeight: 'bold', width: '120px' }}>
                TASA
              </th>
              <th className="text-right py-3 px-2 text-gray-700 text-sm" style={{ fontWeight: 'bold', width: '120px' }}>
                MONTO
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-2 text-gray-900 text-sm">{item.descripcion}</td>
                <td className="py-3 px-2 text-center text-gray-900 text-sm">{item.cantidad}</td>
                <td className="py-3 px-2 text-right text-gray-900 text-sm">
                  ${item.tasa.toFixed(2)}
                </td>
                <td className="py-3 px-2 text-right text-gray-900 text-sm">
                  ${item.monto.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">Impuesto (10%):</span>
              <span className="text-gray-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-200 text-base">
              <span className="text-gray-900" style={{ fontWeight: 'bold' }}>Total:</span>
              <span className="text-gray-900" style={{ fontWeight: 'bold' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Información de Pago */}
        <div className="border-t pt-6">
          <h3 className="text-sm text-gray-700 mb-3" style={{ fontWeight: 'bold' }}>INFORMACIÓN DE PAGO</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>El pago debe realizarse dentro de los 14 días posteriores a la fecha de la factura.</p>
            <p>Por favor, incluya el número de factura con su pago.</p>
            <p className="mt-3">
              <span style={{ fontWeight: 'bold' }}>Transferencia Bancaria:</span> Número de Cuenta #: 1234567890 | Código de Ruta #: 987654321
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
          <p>¡Gracias por su compra!</p>
          <p className="mt-1">Si tiene alguna pregunta, por favor contáctenos en  facturacion@lecoquette.com</p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';

