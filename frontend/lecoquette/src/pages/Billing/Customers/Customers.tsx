import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Search } from "lucide-react";
import { CustomerStats } from "./components/CustomerStats";
import { CustomerTable } from "./components/CustomerTable";
import { CreateCustomerDialog } from "./components/CreateCustomerDialog";
import { customerService } from "../../../services/customer.service";
import type { Customer } from "../../../services/customer.service";

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error cargando clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const fullName = (customer.full_name ?? "").toLowerCase();
    const email = (customer.email ?? "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || email.includes(search);
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-(--color-fondo) text-xl font-bold">Clientes</h2>
          <p className="mt-1 text-gray-600">
            Gestiona la base de datos de tus clientes.
          </p>
        </div>

        <CreateCustomerDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>

      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <>
          <CustomerStats customers={filteredCustomers as any} />

          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>

            <CardContent>
              <CustomerTable customers={filteredCustomers as any} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default Customers;