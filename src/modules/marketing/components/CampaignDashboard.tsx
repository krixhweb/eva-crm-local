
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Icon } from "../../../components/shared/Icon";
import { formatCurrency } from '../../../lib/utils';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  Cell 
} from 'recharts';
import { mockCampaigns } from '../../../data/mockData';

// Mock Data for Charts
const trendData = [
  { name: 'Mon', spend: 4000, revenue: 24000 },
  { name: 'Tue', spend: 3000, revenue: 13980 },
  { name: 'Wed', spend: 2000, revenue: 9800 },
  { name: 'Thu', spend: 2780, revenue: 19080 },
  { name: 'Fri', spend: 1890, revenue: 18000 },
  { name: 'Sat', spend: 2390, revenue: 28000 },
  { name: 'Sun', spend: 3490, revenue: 33000 },
];

const StatCard = ({ title, value, trend, trendUp, icon, color }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon name={icon} className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          <span>{trend}</span>
          <Icon name={trendUp ? "trendingUp" : "trendingUp"} className={`w-4 h-4 ${!trendUp && "rotate-180"}`} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
    </CardContent>
  </Card>
);

export const CampaignDashboard = () => {
  // Aggregation for "Campaigns by Type"
  const typeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    mockCampaigns.forEach(c => {
        counts[c.type] = (counts[c.type] || 0) + 1;
    });
    // Ensure we have some data even if mock is empty/sparse
    if (Object.keys(counts).length === 0) {
        return [
            { name: 'Advertisement', value: 4 },
            { name: 'Email Campaign', value: 3 },
            { name: 'Social Media', value: 2 },
            { name: 'Webinar', value: 1 },
        ];
    }
    return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
  }, []);

  // Colors for the bars
  const BAR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(142840)} trend="+12.5%" trendUp={true} icon="dollarSign" color="bg-green-500" />
        <StatCard title="Ad Spend" value={formatCurrency(19550)} trend="+4.1%" trendUp={false} icon="creditCard" color="bg-blue-500" />
        <StatCard title="Total ROAS" value="7.3x" trend="+8.2%" trendUp={true} icon="target" color="bg-purple-500" />
        <StatCard title="Conversion Rate" value="3.2%" trend="-1.1%" trendUp={false} icon="activity" color="bg-orange-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                  <Area type="monotone" dataKey="spend" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" name="Ad Spend" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns by Type Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Campaigns by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeCounts} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" width={110} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                   <Tooltip cursor={{fill: 'transparent'}} />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {typeCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
