
import { ReactNode } from 'react';
import { FileText, Plus, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                InvoicePro
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center space-x-2 ${
                  currentPage === 'dashboard' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
              
              <Button
                variant={currentPage === 'invoices' ? 'default' : 'ghost'}
                onClick={() => onNavigate('invoices')}
                className={`flex items-center space-x-2 ${
                  currentPage === 'invoices' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Invoices</span>
              </Button>
              
              <Button
                variant={currentPage === 'create' ? 'default' : 'ghost'}
                onClick={() => onNavigate('create')}
                className={`flex items-center space-x-2 ${
                  currentPage === 'create' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Create Invoice</span>
              </Button>
            </nav>

            <Button
              onClick={() => onNavigate('create')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
