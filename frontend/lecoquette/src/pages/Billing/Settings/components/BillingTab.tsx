import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Separator } from '../../../../components/ui/separator';
import { Switch } from '../../../../components/ui/switch';
import { TabsContent } from '../../../../components/ui/tabs';

export function BillingTab() {
  return (
    <TabsContent value="billing" className="space-y-6">
      {/* Configuración de facturas */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de facturas</CardTitle>
          <CardDescription>
            Configura los ajustes predeterminados de las facturas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="invoice-prefix">Número prefijo de la factura</Label>
            <Input id="invoice-prefix" defaultValue="INV-" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="next-number">Siguiente número de factura</Label>
            <Input id="next-number" type="number" defaultValue="009" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="payment-terms">Términos de pago predeterminados (días)</Label>
            <Select defaultValue="14">
              <SelectTrigger id="payment-terms">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 días</SelectItem>
                <SelectItem value="14">14 días</SelectItem>
                <SelectItem value="30">30 días</SelectItem>
                <SelectItem value="60">60 días</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currency">Moneda predeterminada</Label>
            <Select defaultValue="cop">
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cop">COP - Peso colombiano</SelectItem>
                <SelectItem value="usd">USD - Dólar estadounidense</SelectItem>
                <SelectItem value="eur">EUR - Euro</SelectItem>
                <SelectItem value="gbp">GBP - Libra esterlina</SelectItem>
                <SelectItem value="cad">CAD - Dólar canadiense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Ajustes de impuestos */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Ajustes de impuestos</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Habilitar cálculo de impuestos</Label>
                <p className="text-sm text-gray-600">Calcular automáticamente el impuesto en las facturas</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tax-rate">Porcentaje de impuesto predeterminado (%)</Label>
              <Input id="tax-rate" type="number" defaultValue="10" step="0.01" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tax-name">Nombre del impuesto</Label>
              <Input id="tax-name" defaultValue="IVA" />
            </div>
          </div>

          <Button className='bg-(--color-fondo) text-(--color-primario)'>Guardar ajustes</Button>
        </CardContent>
      </Card>

      {/* Métodos de pago */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de pago</CardTitle>
          <CardDescription>
            Configura métodos de pago aceptados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Transferencia bancaria</Label>
              <p className="text-sm text-gray-600">Aceptar pagos por transferencia bancaria</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tarjeta de crédito</Label>
              <p className="text-sm text-gray-600">Aceptar pagos con tarjeta de crédito</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>PayPal</Label>
              <p className="text-sm text-gray-600">Aceptar pagos vía PayPal</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Criptomonedas</Label>
              <p className="text-sm text-gray-600">Aceptar pagos con criptomonedas</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}