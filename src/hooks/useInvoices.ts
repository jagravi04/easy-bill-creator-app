
import { useState } from 'react';
import { Invoice } from '@/types/invoice';

// Mock data for demonstration with INR amounts
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    clientName: 'Acme Corporation',
    clientEmail: 'contact@acme.com',
    clientAddress: '123 Business St, Mumbai, Maharashtra 400001',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    items: [
      {
        id: '1',
        description: 'Web Development Services',
        quantity: 40,
        rate: 6250,
        amount: 250000
      }
    ],
    subtotal: 250000,
    tax: 45000,
    total: 295000,
    status: 'sent',
    notes: 'Thank you for your business!'
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    clientName: 'Tech Solutions Inc',
    clientEmail: 'billing@techsolutions.com',
    clientAddress: '456 Tech Ave, Bangalore, Karnataka 560001',
    issueDate: '2024-01-20',
    dueDate: '2024-02-20',
    items: [
      {
        id: '1',
        description: 'UI/UX Design',
        quantity: 20,
        rate: 7083,
        amount: 141660
      }
    ],
    subtotal: 141660,
    tax: 25499,
    total: 167159,
    status: 'paid'
  }
];

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
    };
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === id ? { ...invoice, ...updates } : invoice
      )
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  const getInvoice = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  return {
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice
  };
}
