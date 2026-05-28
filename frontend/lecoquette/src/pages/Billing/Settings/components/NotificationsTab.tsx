import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Switch } from '../../../../components/ui/switch';
import { TabsContent } from '../../../../components/ui/tabs';

export function NotificationsTab() {
  return (
    <TabsContent value="notifications" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones por correo electrónico</CardTitle>
          <CardDescription>
            Configura notificaciones automáticas por correo electrónico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Factura creada</Label>
              <p className="text-sm text-gray-600">Enviar correo cuando se genere una factura</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Pago recibido</Label>
              <p className="text-sm text-gray-600">Notificar cuando se reciba un pago</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recordatorio</Label>
              <p className="text-sm text-gray-600">Enviar recordatorio antes de la fecha de vencimiento</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reminder-days">Enviar recordatorio (días antes de vencer)</Label>
            <Select defaultValue="3">
              <SelectTrigger id="reminder-days">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 día</SelectItem>
                <SelectItem value="3">3 días</SelectItem>
                <SelectItem value="5">5 días</SelectItem>
                <SelectItem value="7">7 días</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificación de vencimiento</Label>
              <p className="text-sm text-gray-600">Enviar notificación cuando una factura esté vencida</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Button className='bg-(--color-fondo) text-(--color-primario)'>Guardar ajustes de notificaciones</Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}