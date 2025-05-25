
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Download, Mail, ArrowLeft } from 'lucide-react';
import { Invoice } from '@/types/invoice';

interface InvoiceViewProps {
  invoice: Invoice;
  onNavigate: (page: string, invoiceId?: string) => void;
}

export function InvoiceView({ invoice, onNavigate }: InvoiceViewProps) {
  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Button variant="ghost" onClick={() => onNavigate('invoices')} className="p-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
        
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status}
          </Badge>
          
          <Button variant="outline" onClick={() => onNavigate('edit', invoice.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <Button variant="outline" onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            Print/PDF
          </Button>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Mail className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>

      {/* Invoice Document */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
              <p className="text-lg font-semibold text-blue-600">{invoice.invoiceNumber}</p>
            </div>
            
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">InvoicePro</h2>
              <div className="text-sm text-gray-600">
                <p>123 Business Street</p>
                <p>Business City, Maharashtra 400001</p>
                <p>contact@invoicepro.com</p>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* Invoice Info and Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Bill To:</h3>
              <div className="text-gray-700">
                <p className="font-medium text-lg">{invoice.clientName}</p>
                {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
                {invoice.clientAddress && (
                  <div className="mt-2">
                    {invoice.clientAddress.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Issue Date: </span>
                  <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium">Due Date: </span>
                  <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium">Status: </span>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-2 font-semibold">Description</th>
                    <th className="text-center py-3 px-2 font-semibold">Qty</th>
                    <th className="text-right py-3 px-2 font-semibold">Rate</th>
                    <th className="text-right py-3 px-2 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3 px-2">{item.description}</td>
                      <td className="text-center py-3 px-2">{item.quantity}</td>
                      <td className="text-right py-3 px-2">{formatCurrency(item.rate)}</td>
                      <td className="text-right py-3 px-2 font-medium">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>{formatCurrency(invoice.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Notes:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t pt-6">
            <p>Thank you for your business!</p>
            <p className="mt-1">Please remit payment within the specified due date.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
