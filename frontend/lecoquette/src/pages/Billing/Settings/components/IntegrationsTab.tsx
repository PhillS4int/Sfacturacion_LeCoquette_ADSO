import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { TabsContent } from '../../../../components/ui/tabs';

interface IntegrationItemProps {
  label: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

function IntegrationItem({ label, description, icon, iconBg, iconColor }: IntegrationItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <Button variant="outline">Conectar</Button>
    </div>
  );
}

export function IntegrationsTab() {
  return (
    <TabsContent value="integrations" className="space-y-6">
      {/* Pasarelas de pago */}
      <Card>
        <CardHeader>
          <CardTitle>Integraciones con pasarelas de pago</CardTitle>
          <CardDescription>
            Conecta tus servicios de procesamiento de pagos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <IntegrationItem
            label="Stripe"
            description="Procesar pagos con Stripe"
            icon="$"
            iconBg="bg-(--color-fondo)"
            iconColor="text-(--color-primario)"
          />
          <IntegrationItem
            label="PayPal"
            description="Aceptar pagos con PayPal"
            icon="P"
            iconBg="bg-(--color-fondo)"
            iconColor="text-(--color-primario)"
          />
          <IntegrationItem
            label="Square"
            description="Procesar pagos con Square"
            icon="S"
            iconBg="bg-(--color-fondo)"
            iconColor="text-(--color-primario)"
          />
        </CardContent>
      </Card>

      {/* Software contable */}
      <Card>
        <CardHeader>
          <CardTitle>Software contable</CardTitle>
          <CardDescription>
            Sincroniza tus datos con plataformas contables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <IntegrationItem
            label="QuickBooks"
            description="Sincronizar facturas y pagos"
            icon="Q"
            iconBg="bg-(--color-fondo)"
            iconColor="text-(--color-primario)"
          />
          <IntegrationItem
            label="Xero"
            description="Integrar con Xero"
            icon="X"
            iconBg="bg-(--color-fondo)"
            iconColor="text-(--color-primario)"
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}