
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Icon } from '../../components/shared/Icon';
import { Button } from '../../components/ui/Button';
import { DatePicker } from '../../components/ui/DatePicker';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import type { DateRange } from '../../components/ui/Calendar';
import {
  mockLowStockProducts,
  mockCustomers,
  mockDashboardRevenueData,
  mockDashboardAcquisitionData,
  mockDashboardFunnelData,
  mockDashboardTopProducts,
  mockDashboardRecentOrders,
} from '../../data/mockData';

// --- HELPER COMPONENTS ---

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: string;
  color: string;
}> = ({ title, value, change, changeType, icon, color }) => {
  const isUp = changeType === 'up';
  
  // Use a map to avoid dynamic class name generation
  const colorClassMap: { [key: string]: { bg: string, text: string, iconBg: string } } = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-500 dark:text-blue-400', iconBg: 'bg-blue-500' },
    green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-500 dark:text-green-400', iconBg: 'bg-green-500' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-500 dark:text-purple-400', iconBg: 'bg-purple-500' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-500 dark:text-orange-400', iconBg: 'bg-orange-500' },
  };

  const colorClasses = colorClassMap[color] || colorClassMap.blue;

  return (
    <Card className="p-6 relative overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 ${colorClasses.iconBg}`} />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <div className={`flex items-center text-sm ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            <Icon name={isUp ? "trendingUp" : "trendingUp"} className={`w-4 h-4 mr-1 ${!isUp ? 'transform rotate-180' : ''}`} />
            {change} vs last month
          </div>
        </div>
        <div className={`p-3 rounded-full ${colorClasses.iconBg} text-white shadow-lg`}>
          <Icon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const config = {
      Delivered: { variant: 'green' as const, icon: 'checkCircle' as const },
      Processing: { variant: 'blue' as const, icon: 'activity' as const },
      Pending: { variant: 'yellow' as const, icon: 'alertTriangle' as const },
      Cancelled: { variant: 'red' as const, icon: 'close' as const },
    }[status] || { variant: 'gray' as const, icon: 'zap' as const };
  
    return (
      <Badge variant={config.variant}>
        {status}
      </Badge>
    );
};

// --- MAIN DASHBOARD COMPONENT ---

const DashboardPage: React.FC = () => {
  // Date state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const ticketSummary = useMemo(() => {
    const allTickets = mockCustomers.flatMap(c => c.tickets);
    const open = allTickets.filter(t => t.status === 'Open').length;
    const pending = allTickets.filter(t => t.status === 'Pending').length;
    const solved = allTickets.filter(t => t.status === 'Solved').length;
    const total = allTickets.length;
    return { open, pending, solved, total };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your business at a glance.</p>
        </div>
        <div className="w-full md:w-auto">
            <DatePicker 
              mode="range" 
              value={dateRange} 
              onChange={(val) => setDateRange(val)} 
              className="w-full md:w-[260px]"
            />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue" value="₹3.88 Cr" change="+12.5%" changeType="up" icon="dollarSign" color="blue" />
        <StatCard title="Orders" value="1,247" change="+8.2%" changeType="up" icon="shoppingCart" color="green" />
        <StatCard title="Customers" value="12,843" change="+5.1%" changeType="up" icon="users" color="purple" />
        <StatCard title="Conversion" value="3.24%" change="-0.3%" changeType="down" icon="target" color="orange" />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <CardTitle className="mb-6">Revenue Overview</CardTitle>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockDashboardRevenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }} formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="goal" stroke="#9CA3AF" strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <CardTitle className="mb-6">Customer Acquisition</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={mockDashboardAcquisitionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {mockDashboardAcquisitionData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {mockDashboardAcquisitionData.map(source => (
              <div key={source.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span>{source.name}</span>
                </div>
                <span className="font-medium">{source.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Actionable Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardTitle className="mb-4">Support Tickets</CardTitle>
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <span className="text-sm">Open</span>
                  <span className="font-bold">{ticketSummary.open}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{width: `${(ticketSummary.open / ticketSummary.total) * 100}%`}}></div>
              </div>
              <div className="flex items-center justify-between">
                  <span className="text-sm">Pending</span>
                  <span className="font-bold">{ticketSummary.pending}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: `${(ticketSummary.pending / ticketSummary.total) * 100}%`}}></div>
              </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm">Solved</span>
                  <span className="font-bold">{ticketSummary.solved}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${(ticketSummary.solved / ticketSummary.total) * 100}%`}}></div>
              </div>
          </div>
        </Card>
        <Card className="p-6">
          <CardTitle className="mb-4">Low Stock Alerts</CardTitle>
          <div className="space-y-3">
            {mockLowStockProducts.map(product => (
              <div key={product.id} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name={product.icon} className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{product.name}</p>
                  </div>
                  <p className="text-sm font-bold text-orange-700 dark:text-orange-300">
                    {product.stock} left
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button size="sm" variant="outline" className="w-full mt-4">
            Manage Inventory
          </Button>
        </Card>
      </div>

      {/* Bottom Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
            <CardTitle className="mb-6">Sales Funnel</CardTitle>
             <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockDashboardFunnelData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.2)" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
                    <Bar dataKey="value" fill="#10B981" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </Card>

        <Card className="p-6">
            <CardTitle className="mb-6">Top Selling Products</CardTitle>
            <div className="space-y-4">
                {mockDashboardTopProducts.map(p => (
                    <div key={p.name} className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">📦</div>
                        <div className="flex-grow">
                            <p className="font-semibold text-sm">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.sales.toLocaleString()} sales</p>
                        </div>
                        <p className="font-bold text-green-500">{formatCurrency(p.revenue)}</p>
                    </div>
                ))}
            </div>
        </Card>
        
        <Card className="p-6">
            <CardTitle className="mb-6">Recent Orders</CardTitle>
            <div className="space-y-3">
              {mockDashboardRecentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-blue-500">{order.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(order.amount)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
