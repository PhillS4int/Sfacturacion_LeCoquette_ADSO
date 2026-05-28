import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { OverviewTab }   from './components/OverviewTab';
import { RevenueTab }    from './components/RevenueTab';
import { CustomersTab }  from './components/CustomersTab';

export function Analytics() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-(--color-fondo) font-bold text-xl">Análisis e informes</h2>
        <p className="text-gray-600 mt-1">
          Realiza el seguimiento del rendimiento de tu negocio y las tendencias de ingresos.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className='bg-gray-200'>
          <TabsTrigger value="overview">General</TabsTrigger>
          <TabsTrigger value="revenue">Ganancias</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueTab />
        </TabsContent>

        <TabsContent value="customers">
          <CustomersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Analytics;