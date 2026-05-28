import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { CompanyTab, BillingTab, NotificationsTab, IntegrationsTab } from './components';

export function Settings() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-(--color-fondo) font-bold text-xl">Ajustes</h2>
        <p className="text-gray-600 mt-1">Administra las preferencias de tu sistema de facturación.</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="billing">Facturación</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
        </TabsList>

        <CompanyTab />
        <BillingTab />
        <NotificationsTab />
        <IntegrationsTab />
      </Tabs>
    </div>
  );
}

export default Settings;