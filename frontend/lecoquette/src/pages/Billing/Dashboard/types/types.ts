export type Invoice = {
  id: string;
  cliente: string;
  monto: string;
  estado: "pagada" | "pendiente" | "atrasada";
  fecha: string;
};