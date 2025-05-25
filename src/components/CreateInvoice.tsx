
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save } from 'lucide-react';
import { Invoice, InvoiceItem } from '@/types/invoice';
import { useToast } from '@/hooks/use-toast';

interface CreateInvoiceProps {
  onCreateInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  onNavigate: (page: string) => void;
  existingInvoice?: Invoice;
}

export function CreateInvoice({ onCreateInvoice, onNavigate, existingInvoice }: CreateInvoiceProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    invoiceNumber: existingInvoice?.invoiceNumber || `INV-${String(Date.now()).slice(-6)}`,
    clientName: existingInvoice?.clientName || '',
    clientEmail: existingInvoice?.clientEmail || '',
    clientAddress: existingInvoice?.clientAddress || '',
    issueDate: existingInvoice?.issueDate || new Date().toISOString().split('T')[0],
    dueDate: existingInvoice?.dueDate || '',
    status: existingInvoice?.status || 'draft' as const,
    notes: existingInvoice?.notes || ''
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    existingInvoice?.items || [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ]
  );

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.dueDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const invoice: Omit<Invoice, 'id'> = {
      ...formData,
      items: items.filter(item => item.description.trim() !== ''),
      subtotal,
      tax,
      total
    };

    onCreateInvoice(invoice);
    
    toast({
      title: "Invoice Created",
      description: `Invoice ${formData.invoiceNumber} has been created successfully.`,
    });
    
    onNavigate('invoices');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {existingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>
        <Button variant="outline" onClick={() => onNavigate('invoices')}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="clientAddress">Client Address</Label>
              <Textarea
                id="clientAddress"
                value={formData.clientAddress}
                onChange={(e) => setFormData({...formData, clientAddress: e.target.value})}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
                  <div className="md:col-span-5">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>Rate (₹)</Label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>Amount (₹)</Label>
                    <Input
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div className="md:col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-w-sm ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes or terms..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => onNavigate('invoices')}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {existingInvoice ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </div>
  );
}
