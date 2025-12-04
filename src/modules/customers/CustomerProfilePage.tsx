
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Icon } from '../../components/shared/Icon';
import type { Customer } from '../../types';
import AboutTab from './components/AboutTab';
import ActivityTab from './components/ActivityTab';
import RevenueTab from './components/RevenueTab';
import CommunicationsTab from './components/CommunicationsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { formatCurrency } from '../../lib/utils';
import { mockCustomers } from '../../data/mockData';

const StatCard: React.FC<{ title: string; value: string; icon: keyof typeof Icon.icons }> = ({ title, value, icon }) => (
    <Card className="p-4">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-500 mr-4">
                <Icon name={icon} className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{title}</p>
            </div>
        </div>
    </Card>
);

const CustomerProfilePage: React.FC = () => {
  const { id } = useParams();
  const customerData = mockCustomers.find(c => c.id === id);
  const [customer, setCustomer] = useState<Customer | undefined>(customerData);

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomer(updatedCustomer);
    // Note: In a real app, this would also update the central state/data source.
    const index = mockCustomers.findIndex(c => c.id === updatedCustomer.id);
    if (index !== -1) {
      mockCustomers[index] = updatedCustomer;
    }
  };

  if (!customer) {
    return (
      <Card className="p-12 text-center">
        <h1 className="text-2xl font-bold">Customer not found</h1>
        <Link to="/customers" className="text-blue-500 mt-4 inline-block">← Back to Customer Directory</Link>
      </Card>
    );
  }
  
  const TABS = ['About', 'Activity', 'Revenue', 'Communications'];
  
  const getLeadStatusColor = (status: string): 'blue' | 'yellow' | 'purple' | 'green' | 'red' | 'gray' => {
    switch(status) {
        case 'New Lead': return 'blue';
        case 'Contacted': return 'yellow';
        case 'Qualified': return 'purple';
        case 'Proposal Sent': return 'purple';
        case 'Won': return 'green';
        case 'Lost': return 'red';
        default: return 'gray';
    }
  }

  return (
    <div className="space-y-6">
      <Link to="/customers" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600">
        <Icon name="chevronLeft" className="w-4 h-4"/> Back to Customer Directory
      </Link>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-4xl font-bold text-gray-600 dark:text-gray-300 border-4 border-white dark:border-gray-800 flex-shrink-0">
            {customer.name.charAt(0)}
          </div>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2"><Icon name="mail" className="w-4 h-4"/>{customer.email}</span>
              <span className="flex items-center gap-2"><Icon name="phone" className="w-4 h-4"/>{customer.phone}</span>
              <span className="flex items-center gap-2"><Icon name="users" className="w-4 h-4"/>Customer since {customer.customerSince}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {customer.tags.map(tag => <Badge key={tag} variant="blue">{tag}</Badge>)}
            </div>
          </div>
          <div className="w-full md:w-auto flex md:flex-col gap-4 text-sm pt-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                    {customer.leadOwner.avatar}
                </div>
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Lead Owner</p>
                    <p className="font-semibold">{customer.leadOwner.name}</p>
                </div>
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400">Lead Status</p>
                <Badge variant={getLeadStatusColor(customer.leadStatus)}>{customer.leadStatus}</Badge>
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400">Last Contacted</p>
                <p className="font-semibold">{customer.lastContacted}</p>
            </div>
          </div>
        </div>
      </Card>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Spent" value={formatCurrency(customer.totalSpent)} icon="dollarSign" />
          <StatCard title="Total Orders" value={customer.orders.toString()} icon="shoppingCart" />
          <StatCard title="Avg Order Value" value={formatCurrency(customer.orders > 0 ? (customer.totalSpent / customer.orders) : 0)} icon="trendingUp" />
      </div>
      
      <Tabs defaultValue="About">
        <TabsList>
            {TABS.map(tab => (
                <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
            ))}
        </TabsList>
        <TabsContent value="About" className="mt-6">
            <AboutTab customer={customer} onUpdateCustomer={handleUpdateCustomer} />
        </TabsContent>
        <TabsContent value="Activity" className="mt-6">
            <ActivityTab />
        </TabsContent>
        <TabsContent value="Revenue" className="mt-6">
            <RevenueTab />
        </TabsContent>
        <TabsContent value="Communications" className="mt-6">
            <CommunicationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerProfilePage;
