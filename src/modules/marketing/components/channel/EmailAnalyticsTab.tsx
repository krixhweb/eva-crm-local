
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/shared/Icon';
import { formatCurrency } from '../../../../lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const timelineData = [
    { day: 'Mon', openRate: 22, clickRate: 2.5 },
    { day: 'Tue', openRate: 28, clickRate: 3.8 },
    { day: 'Wed', openRate: 25, clickRate: 3.0 },
    { day: 'Thu', openRate: 35, clickRate: 4.5 },
    { day: 'Fri', openRate: 30, clickRate: 3.9 },
    { day: 'Sat', openRate: 18, clickRate: 1.8 },
    { day: 'Sun', openRate: 20, clickRate: 2.0 },
];

const topCampaigns = [
    { name: "Summer Sale", opens: 4500, clicks: 1200, revenue: 15000 },
    { name: "Welcome Series", opens: 3200, clicks: 900, revenue: 8500 },
    { name: "Cart Recovery", opens: 1800, clicks: 600, revenue: 25000 },
];

const Stat = ({ title, value, icon, color }: any) => (
    <Card>
        <CardContent className="pt-6">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon name={icon} className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{title}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

export const EmailAnalyticsTab = () => {
    return (
        <div className="space-y-6 animate-in fade-in">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Stat title="Deliverability" value="99.2%" icon="checkCircle" color="bg-green-100 text-green-600 dark:bg-green-900/20" />
                <Stat title="Avg Open Rate" value="28.4%" icon="eye" color="bg-blue-100 text-blue-600 dark:bg-blue-900/20" />
                <Stat title="Avg Click Rate" value="4.2%" icon="mousePointer" color="bg-purple-100 text-purple-600 dark:bg-purple-900/20" />
                <Stat title="Total Revenue" value={formatCurrency(685000)} icon="dollarSign" color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trend Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Engagement Trend (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timelineData}>
                                    <defs>
                                        <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="openRate" stroke="#3B82F6" fillOpacity={1} fill="url(#colorOpen)" name="Open Rate %" />
                                    <Area type="monotone" dataKey="clickRate" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorClick)" name="Click Rate %" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {topCampaigns.map((c, i) => (
                                <div key={i} className="flex flex-col gap-2 pb-4 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{c.name}</span>
                                        <span className="text-green-600 text-sm font-bold">{formatCurrency(c.revenue)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{c.opens.toLocaleString()} Opens</span>
                                        <span>{c.clicks.toLocaleString()} Clicks</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5 mt-1">
                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(c.clicks / c.opens) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
