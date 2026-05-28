import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { TabsContent } from '../../../../components/ui/tabs';

export function CompanyTab() {
  return (
    <TabsContent value="company" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de la empresa</CardTitle>
          <CardDescription>
            Actualiza los detalles que aparecerán en las facturas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="company-name">Nombre de la empresa</Label>
            <Input id="company-name" defaultValue="Ingresa el nombre de tu empresa" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="company-email">Correo electrónico</Label>
            <Input id="company-email" type="email" defaultValue="lecoquette@email.com" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="company-phone">Número de teléfono</Label>
            <Input id="company-phone" type="tel" defaultValue="+57 (555) 000-0000" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="company-address">Dirección</Label>
            <Input id="company-address" defaultValue="Ingresa la dirección física de tu empresa" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" defaultValue="Bogotá" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">Estado / Departamento</Label>
              <Input id="state" defaultValue="Cundinamarca" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="zip">Código Postal</Label>
              <Input id="zip" defaultValue="10001" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">País</Label>
              <Select defaultValue="co">
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="co">Colombia</SelectItem>
                  <SelectItem value="us">Estados Unidos</SelectItem>
                  <SelectItem value="ca">Canadá</SelectItem>
                  <SelectItem value="uk">Reino Unido</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tax-id">ID Impuesto / Número VAT</Label>
            <Input id="tax-id" placeholder="Opcional" />
          </div>

          <Button className='bg-(--color-fondo) text-(--color-primario)'>Guardar cambios</Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}