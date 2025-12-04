
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/shared/Icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { formatCurrency } from '../../lib/utils';
import { mockTeamMembers, mockSalesActivities, mockDeals } from '../../data/mockData';

const SalesPersonDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // Lookup Data
    const member = mockTeamMembers.find(m => m.id === id) || mockTeamMembers[0];
    const activities = mockSalesActivities; // Mock filtered list
    const deals = mockDeals.filter((d, i) => i % 2 === 0); // Mock filtered list

    // Mock Charts Data
    const performanceData = [
        { month: "Jan", revenue: 45000, deals: 4 },
        { month: "Feb", revenue: 52000, deals: 5 },
        { month: "Mar", revenue: 48000, deals: 4 },
        { month: "Apr", revenue: 61000, deals: 6 },
        { month: "May", revenue: 55000, deals: 5 },
        { month: "Jun", revenue: 75000, deals: 8 },
    ];

    const winRateData = [
        { name: "Won", value: 68, color: "#22C55E" },
        { name: "Lost", value: 32, color: "#EF4444" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/sales/analytics')} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
                        <Icon name="arrowLeft" className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-800 shadow-sm">
                            {member.avatar}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{member.name}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Senior Sales Executive • ID: {member.id}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Icon name="mail" className="w-4 h-4 mr-2"/> Email</Button>
                    <Button variant="outline"><Icon name="phone" className="w-4 h-4 mr-2"/> Call</Button>
                    <Button variant="default">Edit Profile</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{formatCurrency(member.revenue)}</p>
                            </div>
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                <Icon name="dollarSign" className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Deals Closed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{member.dealsClosed}</p>
                            </div>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <Icon name="checkCircle" className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Rate</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">68%</p>
                            </div>
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                <Icon name="trendingUp" className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Pipeline</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">12</p>
                            </div>
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                                <Icon name="pipeline" className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Win/Loss Ratio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={winRateData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.2)" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 500 }} width={50} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                                        {winRateData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="activities">
                <TabsList>
                    <TabsTrigger value="activities">Activity Log</TabsTrigger>
                    <TabsTrigger value="deals">Assigned Deals</TabsTrigger>
                </TabsList>
                
                <TabsContent value="activities" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-6 relative">
                                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                                {activities.map((activity, idx) => (
                                    <div key={idx} className="relative pl-10 group">
                                        <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 group-hover:border-green-500 z-10 transition-colors"></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{activity.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{activity.details}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{activity.timestamp}</span>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="deals" className="mt-6">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Stage</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Probability</TableHead>
                                        <TableHead>Closing Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deals.map(deal => (
                                        <TableRow key={deal.id}>
                                            <TableCell className="font-medium">{deal.company}</TableCell>
                                            <TableCell><Badge variant="outline">{deal.stage}</Badge></TableCell>
                                            <TableCell className="font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(deal.value)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500" style={{ width: `${deal.probability}%` }}></div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{deal.probability}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{deal.dueDate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SalesPersonDetailsPage;
