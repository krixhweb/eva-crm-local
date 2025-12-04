
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/shared/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { formatCurrency } from '../../lib/utils';
import { mockCoupons } from '../../data/mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import type { Coupon } from '../../types';

const CouponDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
      const found = mockCoupons.find(c => c.id === id);
      if (found) setCoupon(found);
  }, [id]);

  if (!coupon) return <div className="p-10 text-center">Coupon not found</div>;

  // Mock Analytics Data
  const redemptionData = [
      { day: 'Mon', count: 12 }, { day: 'Tue', count: 19 }, { day: 'Wed', count: 15 },
      { day: 'Thu', count: 22 }, { day: 'Fri', count: 30 }, { day: 'Sat', count: 45 }, { day: 'Sun', count: 38 }
  ];
  
  const channelData = [
      { name: 'Email', value: 45, color: '#3B82F6' },
      { name: 'WhatsApp', value: 30, color: '#10B981' },
      { name: 'Social', value: 25, color: '#8B5CF6' },
  ];

  const segmentData = [
      { name: 'New Users', count: 450 },
      { name: 'Returning', count: 320 },
      { name: 'VIP', count: 180 },
      { name: 'At Risk', count: 50 },
  ];

  return (
    <div className="space-y-6 pb-10">
       <Button variant="ghost" size="sm" className="gap-2 pl-0 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100" onClick={() => navigate('/marketing/coupons')}>
          <Icon name="arrowLeft" className="w-4 h-4" /> Back to Coupons
       </Button>

       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400">
                    <Icon name="ticket" className="w-8 h-8" />
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{coupon.name}</h1>
                        <Badge variant="outline" className="font-mono text-base px-2 py-0.5 bg-gray-50 dark:bg-zinc-800">{coupon.code}</Badge>
                        <Badge variant={coupon.status === 'Active' ? 'green' : 'gray'}>{coupon.status}</Badge>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Created by Admin on Jan 15, 2024 • Valid until {new Date(coupon.validUntil).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline">Duplicate</Button>
                <Button variant="outline">Disable</Button>
                <Button>Edit Coupon</Button>
            </div>
       </div>

       {/* Analytics Section */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <Card className="bg-white dark:bg-zinc-900">
               <CardContent className="pt-6">
                   <p className="text-sm text-gray-500 uppercase font-medium">Total Redemptions</p>
                   <p className="text-2xl font-bold mt-1">{coupon.usageCount}</p>
               </CardContent>
           </Card>
           <Card className="bg-white dark:bg-zinc-900">
               <CardContent className="pt-6">
                   <p className="text-sm text-gray-500 uppercase font-medium">Unique Users</p>
                   <p className="text-2xl font-bold mt-1">{Math.round(coupon.usageCount * 0.85)}</p>
               </CardContent>
           </Card>
           <Card className="bg-white dark:bg-zinc-900">
               <CardContent className="pt-6">
                   <p className="text-sm text-gray-500 uppercase font-medium">Revenue Generated</p>
                   <p className="text-2xl font-bold mt-1 text-green-600">{formatCurrency(coupon.revenueGenerated)}</p>
               </CardContent>
           </Card>
           <Card className="bg-white dark:bg-zinc-900">
               <CardContent className="pt-6">
                   <p className="text-sm text-gray-500 uppercase font-medium">Avg Order Value</p>
                   <p className="text-2xl font-bold mt-1 text-blue-600">{formatCurrency(coupon.revenueGenerated / (coupon.usageCount || 1))}</p>
               </CardContent>
           </Card>
       </div>

       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics Charts</TabsTrigger>
                <TabsTrigger value="history">Usage History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader><CardTitle>Coupon Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-medium mb-1">Discount Type</p>
                                <p className="font-medium">{coupon.discountType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-medium mb-1">Value</p>
                                <p className="font-medium text-lg text-blue-600">{coupon.discountType === 'Flat Amount' ? '₹' : ''}{coupon.value}{coupon.discountType === 'Percentage' ? '%' : ''}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-medium mb-1">Usage Limit</p>
                                <p className="font-medium">{coupon.usageCount} / {coupon.usageLimit > 10000 ? 'Unlimited' : coupon.usageLimit}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-medium mb-1">Valid Channels</p>
                                <div className="flex gap-2">
                                    {coupon.channels.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-medium mb-1">Target Audience</p>
                                <p className="font-medium">{coupon.audience}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Rules</CardTitle></CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between"><span>Min Order:</span> <span className="font-mono">₹500</span></div>
                                <div className="flex justify-between"><span>Max Discount:</span> <span className="font-mono">₹200</span></div>
                                <div className="flex justify-between"><span>One-time Use:</span> <span>Yes</span></div>
                                <div className="flex justify-between"><span>Stackable:</span> <span>No</span></div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Files</CardTitle></CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                                    <Icon name="paperclip" className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                                    <p className="text-xs text-gray-500">Upload Banner/Creative</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>Redemptions Over Time</CardTitle></CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={redemptionData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Channel Performance</CardTitle></CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={channelData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                                        {channelData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>User Segment Breakdown</CardTitle></CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={segmentData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={30}>
                                         {segmentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="history">
                 <Card>
                     <CardContent className="p-8 text-center text-gray-500">
                         Usage history table would go here (User, Order ID, Date, Discount Amount).
                     </CardContent>
                 </Card>
            </TabsContent>
       </Tabs>
    </div>
  );
};

export default CouponDetailPage;
