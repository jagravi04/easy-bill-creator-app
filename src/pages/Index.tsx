
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { InvoiceList } from '@/components/InvoiceList';
import { CreateInvoice } from '@/components/CreateInvoice';
import { InvoiceView } from '@/components/InvoiceView';
import { useInvoices } from '@/hooks/useInvoices';
import { useToast } from '@/hooks/use-toast';

type Page = 'dashboard' | 'invoices' | 'create' | 'view' | 'edit';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const { invoices, addInvoice, updateInvoice, deleteInvoice, getInvoice } = useInvoices();
  const { toast } = useToast();

  const handleNavigate = (page: string, invoiceId?: string) => {
    setCurrentPage(page as Page);
    if (invoiceId) {
      setSelectedInvoiceId(invoiceId);
    } else {
      setSelectedInvoiceId(null);
    }
  };

  const handleCreateInvoice = (invoiceData: any) => {
    const newInvoice = addInvoice(invoiceData);
    console.log('Created invoice:', newInvoice);
  };

  const handleDeleteInvoice = (id: string) => {
    deleteInvoice(id);
    toast({
      title: "Invoice Deleted",
      description: "The invoice has been deleted successfully.",
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard invoices={invoices} onNavigate={handleNavigate} />;
      
      case 'invoices':
        return (
          <InvoiceList 
            invoices={invoices} 
            onNavigate={handleNavigate}
            onDeleteInvoice={handleDeleteInvoice}
          />
        );
      
      case 'create':
        return (
          <CreateInvoice 
            onCreateInvoice={handleCreateInvoice}
            onNavigate={handleNavigate}
          />
        );
      
      case 'edit':
        const editInvoice = selectedInvoiceId ? getInvoice(selectedInvoiceId) : null;
        return editInvoice ? (
          <CreateInvoice 
            onCreateInvoice={(data) => {
              updateInvoice(editInvoice.id, data);
              toast({
                title: "Invoice Updated",
                description: "The invoice has been updated successfully.",
              });
              handleNavigate('invoices');
            }}
            onNavigate={handleNavigate}
            existingInvoice={editInvoice}
          />
        ) : (
          <div>Invoice not found</div>
        );
      
      case 'view':
        const viewInvoice = selectedInvoiceId ? getInvoice(selectedInvoiceId) : null;
        return viewInvoice ? (
          <InvoiceView 
            invoice={viewInvoice}
            onNavigate={handleNavigate}
          />
        ) : (
          <div>Invoice not found</div>
        );
      
      default:
        return <Dashboard invoices={invoices} onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
};

export default Index;
