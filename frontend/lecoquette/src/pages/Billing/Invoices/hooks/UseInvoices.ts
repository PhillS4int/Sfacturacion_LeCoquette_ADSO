import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { toast } from "sonner";
import type { Invoice } from "../types/invoice.types";
import { mockInvoices } from '../mocks/invoices.mock';

export function useInvoices() {
  const [searchTerm, setSearchTerm]           = useState('');
  const [statusFilter, setStatusFilter]       = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen]     = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
 
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });
 
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };
 
  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      setSelectedInvoice(invoice);
 
      // Esperar a que el componente oculto se renderice
      await new Promise((resolve) => setTimeout(resolve, 100));
 
      if (!invoiceRef.current) {
        toast.error('No se pudo generar el PDF');
        return;
      }
 
      toast.info('Generando PDF...');
 
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
 
      const imgWidth  = 210; // A4 ancho en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
 
      const pdf     = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
 
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${invoice.id}.pdf`);
 
      toast.success('PDF descargado correctamente');
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };
 
  const handleSendInvoice = (invoice: Invoice) => {
    toast.success(`Factura ${invoice.id} enviada a ${invoice.cliente}`);
  };
 
  return {
    // Estado
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isPreviewOpen,
    setIsPreviewOpen,
    selectedInvoice,
    invoiceRef,
    // Datos
    filteredInvoices,
    // Handlers
    handleViewInvoice,
    handleDownloadPDF,
    handleSendInvoice,
  };
};